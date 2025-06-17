var express = require('express');
const fs = require('fs');
const path = require('path'); 
const multer = require('multer');
const ontologyRouter = express.Router();
const cors = require('cors');

const { makeHash, makeToken, IsValidToken } = require('../lib/auth_tools');
const { pdb } = require('../lib/postgress');

// Конфигурация multer для сохранения файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads'); 
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const set_session_id = "SET SESSION my.vars.CurrentSID = '71';";

ontologyRouter.use(async (_, __, next) => {
  await pdb.query(set_session_id);
  next();
});

// ------------------------------------------------------------------
// Существующий маршрут для получения структуры по родительскому ID
ontologyRouter.post('/ventityStructure_get_items_by_parent_id', cors(),
  function (req, res) {
    console.log('ventityStructure_get_items_by_parent_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    var _sql_str = '';
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        if (req.body.entity_all_types) {
          if (req.body.all_data === true) {
            _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
              'SELECT * FROM "Ontologies"."VEntityStructure";';
          } else {
            if (req.body.Parent === 0) {
              _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                'SELECT * FROM "Ontologies"."VEntityStructure" WHERE "Parent" IS NULL;';
            } else {
              _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                'SELECT * FROM "Ontologies"."VEntityStructure" WHERE "Parent" = \'' + req.body.Parent + '\';';
            }
          }
        } else {
          if (req.body.all_data === true) {
            _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
              'SELECT * FROM "Ontologies"."VEntityStructure" WHERE "TypeElement" = \'Structure\';';
          } else {
            if (req.body.Parent === 0) {
              _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                'SELECT * FROM "Ontologies"."VEntityStructure" WHERE "Parent" IS NULL AND "TypeElement" = \'Structure\';';
            } else {
              _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                'SELECT * FROM "Ontologies"."VEntityStructure" WHERE "Parent" = \'' + req.body.Parent + '\' AND "TypeElement" = \'Structure\';';
            }
          }
        }
        console.log(_sql_str);
        pdb.any(_sql_str)
          .then(data => { res.send({ data: data, jwt: token }); })
          .catch(error => { console.log(error); res.send(error); });
      } else { res.send({ error: 'Not authorized' }); }
    } else { res.send({ error: 'Token not valid. Not authorized' }); }
  }
);

// ------------------------------------------------------------------
// Пример маршрута для получения модальной формы сущности
ontologyRouter.post('/ontology_modal_form', cors(),
  function (req, res) {
    console.log('ontology_modal_form request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var entity_data, security_data;
        var type = req.body.Type;
        if (type === 'Structure') {
          var _sql_str_entity = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'SELECT * FROM "Ontologies"."EntityStructure" WHERE "ID" = \'' + req.body.ID + '\';';
        } else {
          var _sql_str_entity = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'SELECT * FROM "Ontologies"."Entities" WHERE "ID" = \'' + req.body.ID + '\';';
        }
        var _sql_str_security_levels = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "Security"."VSecurityLevel"';
        console.log(_sql_str_entity);
        pdb.any(_sql_str_entity)
          .then(data => {
            entity_data = data[0];
            pdb.any(_sql_str_security_levels)
              .then(data => {
                security_data = data;
                res.send({ entity_data: entity_data, security_data: security_data, jwt: token });
              })
              .catch(error => { console.log(error); res.send(error); });
          })
          .catch(error => { console.log(error); res.send(error); });
      } else { res.send({ error: 'Not authorized' }); }
    } else { res.send({ error: 'Token not valid. Not authorized' }); }
  }
);

// ------------------------------------------------------------------
// Маршрут обновления сущности (/update_ontology)
// При обновлении сущности поле URLPicture передаётся в запросе
ontologyRouter.post('/update_ontology', cors(),
  function (req, res) {
    console.log('update_ontology request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        var type = req.body.Type;
        if (type === 'Structure') {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "Ontologies"."EntityStructure" SET ' +
            ' "ShortTitle"=' + '\'' + req.body.target_entity.data.ShortTitle + '\'' +
            ', "Description"=' + "'" + req.body.target_entity.data.Description + "'" +
            ', "SecurityLevel"=' + "'" + req.body.target_entity.security_level.ID + "'" +
            ' WHERE "ID"=' + "'" + req.body.target_entity.data.ID + "'";
        } else {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "Ontologies"."Entities" SET ' +
            ' "ShortTitle"=' + '\'' + req.body.target_entity.ShortTitle + '\'' +
            ', "Description"=' + "'" + req.body.target_entity.Description + "'" +
            ', "OpenContent"=' + "'" + JSON.stringify(req.body.target_entity.OpenContent) + "'" +
            ', "PrivateContent"=' + "'" + JSON.stringify(req.body.target_entity.PrivateContent) + "'" +
            ', "SecurityLevel"=' + "'" + req.body.target_entity.SecurityLevel + "'" +
            ', "URLPicture"=' + "'" + req.body.target_entity.URLPicture + "'" +
            ' WHERE "ID"=' + "'" + req.body.target_entity.ID + "'";
        }
        pdb.any(_sql_str)
          .then(data => { res.send({ res: 'success' }); })
          .catch(error => { console.log(error.message); res.send({ res: error.message }); });
      } else { res.send({ error: 'Not authorized' }); }
    } else { res.send({ error: 'Token not valid. Not authorized' }); }
  }
);

// ------------------------------------------------------------------
// Маршрут обновления содержимого шаблона (/update_template_content)
ontologyRouter.post('/update_template_content', cors(),
  function (req, res) {
    console.log('update_template_content request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'UPDATE "Ontologies"."Entities" SET ' +
        ' "OpenContent"=' + "'" + JSON.stringify(req.body.open_content) + "'" +
        ', "PrivateContent"=' + "'" + JSON.stringify(req.body.private_content) + "'" +
        ' WHERE "ID"=' + "'" + req.body.ID + "'";
      pdb.any(_sql_str)
        .then(data => { res.send({ res: 'success' }); })
        .catch(error => { console.log(error.message); res.send({ res: error.message }); });
    } else { res.send({ error: 'Not authorized' }); }
  }
);

// ------------------------------------------------------------------
// Маршрут активации сущности (/ontology_activation)
ontologyRouter.post('/ontology_activation', cors(),
  function (req, res) {
    console.log('ontology_activation request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = "";
        let type = req.body.target_entity.TypeElement;
        if (type === "Structure") {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "Ontologies"."EntityStructure" SET "ArchiveSign"=' + '\'' + req.body.target_entity.ArchiveSign + '\'' +
            ' WHERE "ID"=' + '\'' + req.body.target_entity.ID + '\'';
        } else {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "Ontologies"."Entities" SET "ArchiveSign"=' + '\'' + req.body.target_entity.ArchiveSign + '\'' +
            ' WHERE "ID"=' + '\'' + req.body.target_entity.ID + '\'';
        }
        pdb.any(_sql_str)
          .then(data => { res.send({ res: 'success' }); })
          .catch(error => { console.log(error.message); res.send({ res: error.message }); });
      } else { res.send({ error: 'Not authorized' }); }
    } else { res.send({ error: 'Token not valid. Not authorized' }); }
  }
);

// ------------------------------------------------------------------
// Маршрут создания сущности (/create_ontology)
ontologyRouter.post('/create_ontology', cors(),
  function (req, res) {
    console.log('create_ontology request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      var _order = 1;
      if (req.body.user != undefined) {
        var type = req.body.Type;
        if (type === 'Structure') {
          if (req.body.target_entity.data.Parent != undefined) {
            var _order_str = 'SELECT MAX ("Order")+1 AS max_order FROM "Ontologies"."EntityStructure" WHERE "Parent" = \'' + req.body.target_entity.data.Parent + '\'';
            pdb.any(_order_str)
              .then(data => {
                _order = data[0].max_order === null ? 1 : data[0].max_order;
                _sql_str =
                  'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                  'INSERT INTO "Ontologies"."EntityStructure" ("ShortTitle", "Description", "SecurityLevel", "Parent", "Order") VALUES (' +
                  '\'' + req.body.target_entity.data.ShortTitle + '\',' +
                  '\'' + req.body.target_entity.data.Description + '\',' +
                  '\'' + req.body.target_entity.security_level.ID + '\',' +
                  '\'' + req.body.target_entity.data.Parent + '\',' +
                  '\'' + _order + '\');';
                console.log(_sql_str);
                pdb.any(_sql_str)
                  .then(data => { res.send({ res: 'success' }); })
                  .catch(error => { console.log(error.message); res.send({ res: error.message }); });
              })
              .catch(error => { console.log(error.message); res.send({ res: error.message }); });
          } else {
            _order = 1;
            _sql_str =
              'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
              'INSERT INTO "Ontologies"."EntityStructure" ("ShortTitle", "Description", "SecurityLevel", "Order") VALUES (' +
              '\'' + req.body.target_entity.data.ShortTitle + '\',' +
              '\'' + req.body.target_entity.data.Description + '\',' +
              '\'' + req.body.target_entity.security_level.ID + '\',' +
              '\'' + _order + '\');';
            console.log(_sql_str);
            pdb.any(_sql_str)
              .then(data => { res.send({ res: 'success' }); })
              .catch(error => { console.log(error.message); res.send({ res: error.message }); });
          }
        } else { // Entity and Template
          if (req.body.target_entity.TemplateSign) {
            _sql_str =
              'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
              'INSERT INTO "Ontologies"."Entities" ("ShortTitle", "Description", "OpenContent", "PrivateContent", "SecurityLevel", "EntityStructure", "URLPicture", "TemplateSign") VALUES (' +
              '\'' + req.body.target_entity.ShortTitle + '\',' +
              '\'' + req.body.target_entity.Description + '\',' +
              '\'' + JSON.stringify(req.body.target_entity.OpenContent) + '\',' +
              '\'' + JSON.stringify(req.body.target_entity.PrivateContent) + '\',' +
              '\'' + req.body.target_entity.SecurityLevel + '\',' +
              '\'' + req.body.target_entity.EntityStructure + '\',' +
              '\'' + req.body.target_entity.URLPicture + '\',' +
              '\'' + req.body.target_entity.TemplateSign + '\');';
          } else {
            _sql_str =
              'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
              'INSERT INTO "Ontologies"."Entities" ("ShortTitle", "Description", "OpenContent", "PrivateContent", "SecurityLevel", "EntityStructure", "Template", "URLPicture", "TemplateSign") VALUES (' +
              '\'' + req.body.target_entity.ShortTitle + '\',' +
              '\'' + req.body.target_entity.Description + '\',' +
              '\'' + JSON.stringify(req.body.target_entity.OpenContent) + '\',' +
              '\'' + JSON.stringify(req.body.target_entity.PrivateContent) + '\',' +
              '\'' + req.body.target_entity.SecurityLevel + '\',' +
              '\'' + req.body.target_entity.EntityStructure + '\',' +
              '\'' + req.body.target_entity.Template + '\',' +
              '\'' + req.body.target_entity.URLPicture + '\',' +
              '\'' + req.body.target_entity.TemplateSign + '\');';
          }
          pdb.any(_sql_str)
            .then(data => { res.send({ res: 'success' }); })
            .catch(error => { console.log(error.message); res.send({ res: error.message }); });
        }
      } else { res.send({ error: 'Not authorized' }); }
    } else { res.send({ error: 'Token not valid. Not authorized' }); }
  }
);

// ------------------------------------------------------------------
// Маршрут получения файлов, связанных с сущностью (/get_files)
ontologyRouter.post('/get_files', cors(),
  async function (req, res) {
    console.log('get_files request');
    let token_check_result = IsValidToken(req.body.jwt);
    if (!token_check_result.jwt) {
      return res.status(401).send({ error: 'Token not valid. Not authorized' });
    }
    const entityId = req.body.entityId;
    if (!entityId) {
      return res.status(400).send({ error: 'Entity ID is required' });
    }
    const _sql_str = `
      SELECT "ID", "ShortTitle", "URL", "Entities"
      FROM "Ontologies"."VFiles"
      WHERE "Entities" = '${entityId}';
    `;
    try {
      const data = await pdb.any(_sql_str);
      const token = makeToken(req.body.user.ID);
      res.send({ data: data, jwt: token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
);

// ------------------------------------------------------------------
// Маршрут добавления файла (/add_file)
ontologyRouter.post('/add_file', cors(), upload.single('file'),
  async function (req, res) {
    console.log('add_file request');
    let token_check_result = IsValidToken(req.body.jwt);
    if (!token_check_result.jwt) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).send({ error: 'Token not valid. Not authorized' });
    }
    const entityId = req.body.entityId;
    if (!entityId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).send({ error: 'Entity ID is required' });
    }
    if (!req.file) {
      return res.status(400).send({ error: 'File is required' });
    }
    const shortTitle = req.body.shortTitle || req.file.originalname;
    const url = req.file.filename;
    const _sql_str = `
      INSERT INTO "Ontologies"."File" ("ShortTitle", "URL", "Entities")
      VALUES ('${shortTitle}', '${url}', '${entityId}');
    `;
    try {
      await pdb.any(_sql_str);
      res.send({ res: 'success' });
    } catch (error) {
      console.log(error);
      fs.unlinkSync(req.file.path);
      res.status(500).send({ res: error.message });
    }
  }
);

// ------------------------------------------------------------------
// Маршрут удаления файла (/delete_file)
ontologyRouter.post('/delete_file', cors(),
  async function (req, res) {
    console.log('delete_file request');
    let token_check_result = IsValidToken(req.body.jwt);
    if (!token_check_result.jwt) {
      return res.status(401).send({ error: 'Token not valid. Not authorized' });
    }
    const fileId = req.body.fileId;
    if (!fileId) {
      return res.status(400).send({ error: 'File ID is required' });
    }
    const select_sql = `
      SELECT "URL" FROM "Ontologies"."VFiles" WHERE "ID" = '${fileId}';
    `;
    try {
      const fileData = await pdb.any(select_sql);
      if (fileData.length === 0) {
        return res.status(404).send({ error: 'File not found' });
      }
      const filePath = path.join(__dirname, '..', 'uploads', fileData[0].URL);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      const delete_sql = `
        DELETE FROM "Ontologies"."File" WHERE "ID" = '${fileId}';
      `;
      await pdb.any(delete_sql);
      res.send({ res: 'success' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ res: error.message });
    }
  }
);

// ------------------------------------------------------------------
// Маршрут скачивания файла (/download_file/:fileId)
ontologyRouter.get('/download_file/:fileId', cors(),
  async function (req, res) {
    console.log('download_file request');
    let token_check_result = IsValidToken(req.query.jwt);
    if (!token_check_result.jwt) {
      return res.status(401).send({ error: 'Token not valid. Not authorized' });
    }
    const fileId = req.params.fileId;
    if (!fileId) {
      return res.status(400).send({ error: 'File ID is required' });
    }
    const _sql_str = `
      SELECT "ShortTitle", "URL" FROM "Ontologies"."VFiles" WHERE "ID" = '${fileId}';
    `;
    try {
      const fileData = await pdb.any(_sql_str);
      if (fileData.length === 0) {
        return res.status(404).send({ error: 'File not found' });
      }
      const filePath = path.join(__dirname, '..', 'uploads', fileData[0].URL);
      if (fs.existsSync(filePath)) {
        fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
          if (err) {
            console.log(err);
            return res.status(500).send({ error: 'Error reading file' });
          }
          const ext = path.extname(filePath).toLowerCase();
          let mimeType = 'image/png';
          if (ext === '.jpg' || ext === '.jpeg') {
            mimeType = 'image/jpeg';
          } else if (ext === '.gif') {
            mimeType = 'image/gif';
          } else if (ext === '.png') {
            mimeType = 'image/png';
          }
          res.send({ data: data, mimeType: mimeType });
        });
      } else {
        res.status(404).send({ error: 'File not found on server' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
);

// ------------------------------------------------------------------

ontologyRouter.post('/upload_main_image', cors(), upload.single('file'),
  async function (req, res) {
    console.log('upload_main_image request');
    let token_check_result = IsValidToken(req.body.jwt);
    if (!token_check_result.jwt) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).send({ error: 'Token not valid. Not authorized' });
    }
    if (!req.file) {
      return res.status(400).send({ error: 'File is required' });
    }
    // Файл успешно сохранён – возвращаем его имя
    res.send({ res: 'success', data: req.file.filename });
  }
);

// ------------------------------------------------------------------
ontologyRouter.get('/download_main_image/:filename', cors(),
  async function (req, res) {
    console.log('download_main_image request');
    const filename = req.params.filename;
    if (!filename) {
      return res.status(400).send({ error: 'Filename is required' });
    }
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ error: 'Error reading file' });
        }
        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') {
          mimeType = 'image/jpeg';
        } else if (ext === '.gif') {
          mimeType = 'image/gif';
        } else if (ext === '.png') {
          mimeType = 'image/png';
        }
        res.send({ data: data, mimeType: mimeType });
      });
    } else {
      res.status(404).send({ error: 'File not found on server' });
    }
  }
);


ontologyRouter.post('/delete_main_image', cors(),
  async function (req, res) {
    console.log('delete_main_image request');
    let token_check_result = IsValidToken(req.body.jwt);
    if (!token_check_result.jwt) {
      return res.status(401).send({ error: 'Token not valid. Not authorized' });
    }
    const filename = req.body.filename;
    const entityId = req.body.entityId;
    if (!filename) {
      return res.status(400).send({ error: 'Filename is required' });
    }
    if (!entityId) {
      return res.status(400).send({ error: 'Entity ID is required' });
    }
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        const update_sql = `
          UPDATE "Ontologies"."Entities"
          SET "URLPicture" = NULL
          WHERE "ID" = '${entityId}';
        `;
        await pdb.any(update_sql);
        res.send({ res: 'success' });
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
      }
    } else {
      res.status(404).send({ error: 'File not found on server' });
    }
  }
);


module.exports = ontologyRouter;
