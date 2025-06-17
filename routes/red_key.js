var express = require('express');
const fs = require('fs');
const { exec } = require("child_process");
var rimraf = require("rimraf");
const rkRouter = express.Router();
const cors = require('cors');
const path = require('path');
const { makeHash, makeToken, IsValidToken } = require('../lib/auth_tools');
const { pdb } = require('../lib/postgress');

const redkey_homepath = 'redkey_modules/';
const set_session_id = "SET SESSION my.vars.CurrentSID = '71';";

function make_temp_path(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter++;
  }
  return result;
}

rkRouter.use(async (_, __, next) => {
  await pdb.query(set_session_id);
  next();
});

// ------------------------------------------------------------------
// red_key_get_vproject_list
rkRouter.post('/red_key_get_vproject_list', cors(), function (req, res) {
  console.log('red_key_get_vproject_list request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user !== undefined) {
      var _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "RedKey"."VProject";';
      pdb.any(_sql_str)
        .then(data => { res.send({ data: data, jwt: token }); })
        .catch(error => { console.log(error.message); res.send(error); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// red_key_get_project_by_id
rkRouter.post('/red_key_get_project_by_id', cors(), function (req, res) {
  console.log('red_key_get_project_by_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user !== undefined) {
      var _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "RedKey"."Project" WHERE "ID" = \'' + req.body.ID + '\';';
      pdb.any(_sql_str)
        .then(data => { res.send({ data: data, jwt: token }); })
        .catch(error => { console.log(error.message); res.send(error); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// red_key_activation_project
rkRouter.post('/red_key_activation_project', cors(), function (req, res) {
  console.log('red_key_activation_project request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user !== undefined) {
      var _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'UPDATE "RedKey"."Project" SET "ArchiveSign" = \'' + req.body.project.ArchiveSign + '\'' +
        ' WHERE "ID" = \'' + req.body.project.ID + '\'';
      pdb.any(_sql_str)
        .then(data => { res.send({ res: 'success' }); })
        .catch(error => { console.log(error.message); res.send({ res: error.message }); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_update_project
rkRouter.post('/redkey_update_project', cors(), function (req, res) {
  console.log('redkey_update_project request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    var _sql_str = '';
    if (req.body.user !== undefined) {
      _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'UPDATE "RedKey"."Project" SET ' +
        ' "ShortTitle" = \'' + req.body.item.ShortTitle + '\',' +
        ' "Description" = \'' + req.body.item.Description + '\',' +
        ' "SecurityLevel" = \'' + req.body.item.SecurityLevel + '\'' +
        ' WHERE "ID" = \'' + req.body.item.ID + '\'';
      pdb.any(_sql_str)
        .then(data => { res.send({ res: 'success' }); })
        .catch(error => { console.log(error.message); res.send({ res: error.message }); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_get_calculations_by_parent_id
rkRouter.post('/redkey_get_calculations_by_parent_id', cors(), function (req, res) {
  console.log('redkey_get_calculations_by_parent_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user !== undefined) {
      var _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "RedKey"."VCalculation" WHERE "Project" = \'' + req.body.ID + '\';';
      pdb.any(_sql_str)
        .then(data => { res.send({ data: data, jwt: token }); })
        .catch(error => { console.log(error); res.send(error); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_get_calculations_by_id
rkRouter.post('/redkey_get_calculations_by_id', cors(), function (req, res) {
  console.log('redkey_get_calculations_by_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user !== undefined) {
      var _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "RedKey"."VCalculation" WHERE "ID" = \'' + req.body.ID + '\';';
      pdb.any(_sql_str)
        .then(data => { res.send({ data: data, jwt: token }); })
        .catch(error => { console.log(error); res.send(error); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_get_modules_list
rkRouter.post('/redkey_get_modules_list', cors(), function (req, res) {
  console.log('redkey_get_modules_list request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user !== undefined) {
      var _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "RedKey"."VModule";';
      pdb.any(_sql_str)
        .then(data => { res.send({ data: data, jwt: token }); })
        .catch(error => { console.log(error); res.send(error); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_update_project (повторное обновление проекта)
rkRouter.post('/redkey_update_project', cors(), function (req, res) {
  console.log('redkey_update_project request (duplicate)');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    var _sql_str = '';
    if (req.body.user !== undefined) {
      _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'UPDATE "RedKey"."Project" SET ' +
        ' "ShortTitle" = \'' + req.body.item.ShortTitle + '\',' +
        ' "Description" = \'' + req.body.item.Description + '\',' +
        ' "InOutFile" = \'' + req.body.item.InOutFile + '\'' +
        ' WHERE "ID" = \'' + req.body.item.ID + '\'';
      pdb.any(_sql_str)
        .then(data => { res.send({ res: 'success' }); })
        .catch(error => { console.log(error.message); res.send({ res: error.message }); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_create_calculation
rkRouter.post('/redkey_create_calculation', cors(), function (req, res) {
  console.log('redkey_create_calculation request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    var _sql_str = '';
    if (req.body.user !== undefined) {
      _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'INSERT INTO "RedKey"."Calculation" (' +
        '"ShortTitle", "Description", "Project", "Module", "InOutFile", "Status", "Path"' +
        ') VALUES (' +
        '\'' + req.body.item.ShortTitle + '\',' +
        ' \'' + req.body.item.Description + '\',' +
        ' \'' + req.body.item.Project + '\',' +
        ' \'' + req.body.item.Module + '\',' +
        ' \'' + req.body.item.InOutFile + '\',' +
        ' \'' + req.body.item.Status + '\',' +
        ' \'' + req.body.item.Path + '\'' +
        ');';
      console.log(_sql_str);
      pdb.any(_sql_str)
        .then(data => { res.send({ res: 'success' }); })
        .catch(error => { console.log(error.message); res.send({ res: error.message }); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_remove_calculation
rkRouter.post('/redkey_remove_calculation', cors(), function (req, res) {
  console.log('redkey_remove_calculation request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    var _sql_str = '';
    if (req.body.user !== undefined) {
      _sql_str = 'DELETE FROM "RedKey"."Calculation" WHERE "ID" = \'' + req.body.ID + '\';';
      console.log(_sql_str);
      pdb.any(_sql_str)
        .then(data => { res.send({ res: 'success' }); })
        .catch(error => { console.log(error.message); res.send({ res: error.message }); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_update_calculation
rkRouter.post('/redkey_update_calculation', cors(), function (req, res) {
  console.log('redkey_update_calculation request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    var _sql_str = '';
    if (req.body.user !== undefined) {
      _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'UPDATE "RedKey"."Calculation" SET ' +
        ' "ShortTitle" = \'' + req.body.item.ShortTitle + '\',' +
        ' "Description" = \'' + req.body.item.Description + '\',' +
        ' "Status" = \'' + req.body.item.Status + '\',' +
        ' "InOutFile" = \'' + req.body.item.InOutFile + '\'' +
        ' WHERE "ID" = \'' + req.body.item.ID + '\'';
      pdb.any(_sql_str)
        .then(data => { res.send({ res: 'success' }); })
        .catch(error => { console.log(error.message); res.send({ res: error.message }); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_create_project
rkRouter.post('/redkey_create_project', cors(), function (req, res) {
  console.log('redkey_create_project request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user !== undefined) {
      var _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'INSERT INTO "RedKey"."Project" ("ShortTitle", "Description", "SecurityLevel") ' +
        'VALUES (' +
        '\'' + req.body.item.data.ShortTitle + '\',' +
        ' \'' + req.body.item.data.Description + '\',' +
        ' \'' + req.body.item.security_level.ID + '\');';
      console.log(_sql_str);
      pdb.any(_sql_str)
        .then(data => { res.send({ res: 'success' }); })
        .catch(error => { console.log(error.message); res.send({ res: error.message }); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_launch_calc
rkRouter.post('/redkey_launch_calc', cors(), function (req, res) {
  console.log('redkey_launch_calc request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  let _calculation = {};
  let _module = {};
  let _tmp_path = '';
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user !== undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "RedKey"."Calculation" WHERE "ID" = \'' + req.body.ID + '\';';
      pdb.any(_sql_str)
        .then(data => {
          _calculation = data[0];
          var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'SELECT * FROM "RedKey"."Module" WHERE "ID" = \'' + _calculation.Module + '\';';
          pdb.any(_sql_str)
            .then(data => {
              _module = data[0];
              _tmp_path = redkey_homepath + make_temp_path(10);
              console.log(_tmp_path);
              fs.mkdir(_tmp_path, err => {
                if (err) {
                  res.send('error create file: ' + err);
                } else {
                  _calculation.Path = _tmp_path;
                  fs.writeFile(_tmp_path + '/InFile.csv', _calculation.InOutFile, result => {
                    let _cmd = _module.CommandLine.replace('InFile.csv', _tmp_path + '/InFile.csv');
                    _cmd = _cmd.replace('OutFile.csv', _tmp_path + '/OutFile.csv');
                    console.log('cmd line:' + _cmd);
                    exec(_cmd, (error, stdout, stderr) => {
                      if (error) {
                        console.log(`error: ${error.message}`);
                        res.send({ data: "error", jwt: token });
                      }
                      if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        res.send({ data: "error", jwt: token });
                        return;
                      }
                      console.log(`stdout: ${stdout}`);
                      _calculation.InOutFile = fs.readFileSync(_tmp_path + '/OutFile.csv');
                      _calculation.Status = "Готово";
                      _calculation.Path = "";
                      _sql_str =
                        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                        'UPDATE "RedKey"."Calculation" SET ' +
                        ' "InOutFile" = \'' + _calculation.InOutFile + '\',' +
                        ' "Status" = \'' + _calculation.Status + '\',' +
                        ' "Path" = \'' + _calculation.Path + '\'' +
                        ' WHERE "ID" = \'' + _calculation.ID + '\'';
                      rimraf.sync(_tmp_path);
                      console.log(_sql_str);
                      pdb.any(_sql_str)
                        .then(data => { res.send({ data: "success", jwt: token }); })
                        .catch(error => { console.log(error.message); res.send({ res: error.message }); });
                    });
                  });
                }
              });
            })
            .catch(error => { console.log(error); res.send(error); });
        })
        .catch(error => { console.log(error); res.send(error); });
    } else {
      res.send({ error: 'Not authorized' });
    }
  } else {
    res.send({ error: 'Token not valid. Not authorized' });
  }
});

// ------------------------------------------------------------------
// redkey_get_files_by_module
rkRouter.post('/redkey_get_files_by_module', cors(), async function (req, res) {
  console.log('redkey_get_files_by_module request body:', req.body); 
  
  try {
    let token_check_result = IsValidToken(req.body.jwt);
    if (!token_check_result.jwt) {
      return res.status(401).json({ error: 'Token not valid. Not authorized' });
    }

    const { Module } = req.body; 
    if (!Module) {
      return res.status(400).json({ error: 'Module parameter is required' });
    }

    const filesData = await pdb.any(
      `SELECT "ID", "ShortTitle", "URL"
       FROM "RedKey"."VFile"
       WHERE "Module" = $1`,
      [Module]
    );

    const token = makeToken(req.body.user.ID);
    res.json({ data: filesData, jwt: token });
    
  } catch (error) {
    console.error('Error in redkey_get_files_by_module:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// ------------------------------------------------------------------
// download_file

rkRouter.get('/redkey_download_file/:fileId', cors(), async (req, res) => {
  console.log('=== START FILE DOWNLOAD ===');
  console.log('Request received for fileId:', req.params.fileId);
  
  try {
    // Проверка токена
    const token = req.query.jwt;
    if (!token || !IsValidToken(token).jwt) {
      console.error('Invalid or missing token');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Получение информации о файле из БД
    const fileData = await pdb.oneOrNone(
      `SELECT "ID", "ShortTitle", "URL" 
       FROM "RedKey"."VFile" 
       WHERE "ID" = $1`,
      [req.params.fileId]
    );

    if (!fileData) {
      console.error('File not found in database for ID:', req.params.fileId);
      return res.status(404).json({ error: 'File record not found in database' });
    }

    console.log('File data from DB:', fileData);

    // Формирование абсолютного пути
    const uploadsBaseDir = '/home/user1/_development/mglaer_asptn_backend/uploads';
    const filePath = path.join(uploadsBaseDir, fileData.URL);
    
    console.log('Constructed file path:', filePath);
    console.log('Current working directory:', process.cwd());

    // Проверка существования файла
    if (!fs.existsSync(filePath)) {
      console.error('Physical file not found at path:', filePath);
      console.log('Directory contents:', fs.readdirSync(uploadsBaseDir));
      return res.status(404).json({ 
        error: 'File Not Found',
        details: {
          expectedPath: filePath,
          actualFiles: fs.readdirSync(uploadsBaseDir),
          suggestion: 'Check file permissions and path consistency'
        }
      });
    }

    // Проверка прав доступа
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch (err) {
      console.error('File access denied:', err);
      return res.status(403).json({
        error: 'Forbidden',
        details: 'Server has no read permissions for this file'
      });
    }

    // Отправка файла
    const stats = fs.statSync(filePath);
    console.log('File stats:', {
      size: stats.size,
      modified: stats.mtime,
      permissions: (stats.mode & 0o777).toString(8)
    });

    res.download(filePath, fileData.ShortTitle, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        }
      }
    });

  } catch (error) {
    console.error('Critical error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error.message
      });
    }
  }
});

module.exports = rkRouter;
