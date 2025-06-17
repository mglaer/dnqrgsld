var express = require('express');
const fs = require('fs');
const pasportRouter = express.Router();
const cors = require('cors');

const { makeHash, makeToken, IsValidToken } = require('../lib/auth_tools');
const { pdb } = require('../lib/postgress');

const set_session_id = "SET SESSION my.vars.CurrentSID = '71';";

pasportRouter.use(async(_, __, next) => {
  await pdb.query(set_session_id);
  next();
});


pasportRouter.post('/create_tech_passport', cors(),
  function (req, res) {
    console.log('create_tech_passport request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        if (req.body.passport.TemplateSign) {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'INSERT INTO "MSTG"."TechnologyPassport"(' +
            '"ShortTitle",' +
            '"ArchiveSign",' +
            '"EntityStructure",' +
            '"SecurityLevel",' +
            '"Content",' +
            '"TemplateSign"' +
            ') VALUES (' +
            '\'' + req.body.passport.ShortTitle + '\',' +
            ' \'' + 'false' + '\',' +
            ' \'' + req.body.passport.EntityStructure + '\',' +
            ' \'' + req.body.passport.SecurityLevel + '\',' +
            ' \'' + JSON.stringify(req.body.passport.Content) + '\',' +
            ' \'' + req.body.passport.TemplateSign + '\'' +
            ' );';
        }
        else {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'INSERT INTO "MSTG"."TechnologyPassport" (' +
            ' "ShortTitle",' +
            '"ArchiveSign",' +
            ' "Content",' +
            ' "SecurityLevel",' +
            ' "EntityStructure",' +
            ' "Template",' +
            ' "TemplateSign")' +
            ' VALUES ' +
            '(\'' + req.body.passport.ShortTitle + '\',' +
            ' \'' + 'false' + '\',' +
            ' \'' + JSON.stringify(req.body.passport.Content) + '\',' +
            ' \'' + req.body.passport.SecurityLevel + '\',' +
            ' \'' + req.body.passport.EntityStructure + '\',' +
            ' \'' + req.body.passport.Template + '\',' +
            ' \'' + req.body.passport.TemplateSign +
            '\');';
        }
        console.log(_sql_str);
        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/get_tech_pasport_template_by_id', cors(),
  function (req, res) {
    console.log('get_tech_pasport_template_by_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT *' +
          ' FROM "MSTG"."TechnologyPassport"' +
          ' WHERE "TechnologyPassport"."ID" = ' + req.body.id;//+

        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/update_tech_passport', cors(),
  function (req, res) {
    console.log('update_tech_passport request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        /*var type = req.body.Type;
        if (type === 'Structure') {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "MSTG"."EntityStructure"' +
            'SET ' +
            ' "ShortTitle"=' + '\'' + req.body.target_entity.data.ShortTitle + '\'' +
            ', "Description"=' + "'" + req.body.target_entity.data.Description + "'" +
            ', "SecurityLevel"=' + "'" + req.body.target_entity.security_level.ID + "'" +//security_level
            ' WHERE "ID"=' + "'" + req.body.target_entity.data.ID + "'";
        }
        else {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "MSTG"."TechnologyPassport"' +
            'SET ' +
            ' "ShortTitle"=' + '\'' + req.body.passport.ShortTitle + '\'' +
            ', "Content"=' + "'" + JSON.stringify(req.body.passport.Content) + "'" +
            ', "SecurityLevel"=' + "'" + req.body.passport.SecurityLevel + "'" +
            ' WHERE "ID"=' + "'" + req.body.passport.ID + "'";
        //}*/
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'UPDATE "MSTG"."TechnologyPassport"' +
          'SET ' +
          ' "ShortTitle"=' + '\'' + req.body.passport.ShortTitle + '\'' +
          ', "Content"=' + "'" + JSON.stringify(req.body.passport.Content) + "'" +
          ', "SecurityLevel"=' + "'" + req.body.passport.SecurityLevel + "'" +
          ' WHERE "ID"=' + "'" + req.body.passport.ID + "'";

        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }

  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/tech_passport_activation', cors(),
  function (req, res) {
    console.log('tech_passport_activation request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = "";
        /*let type = req.body.passport.TypeElement;
        if (type === "Structure") {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "MSTG"."TechnologyPassport"' +
            ' SET' +
            ' "ArchiveSign"=' + '\'' + req.body.passport.ArchiveSign + '\'' +
            ' WHERE "ID"=' + '\'' + req.body.passport.ID + '\'';
        }
        else //if(type==="Entity")
        {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "Ontologies"."Entities"' +
            ' SET' +
            ' "ArchiveSign"=' + '\'' + req.body.passport.ArchiveSign + '\'' +
            ' WHERE "ID"=' + '\'' + req.body.passport.ID + '\'';
        }*/
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'UPDATE "MSTG"."TechnologyPassport"' +
          ' SET' +
          ' "ArchiveSign"=' + '\'' + req.body.passport.ArchiveSign + '\'' +
          ' WHERE "ID"=' + '\'' + req.body.passport.ID + '\'';
        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });


      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
pasportRouter.post('/get_template_tech_passport_by_id', cors(),
  function (req, res) {
    console.log('get_template_tech_passport_by_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT *' +
          ' FROM "MSTG"."TechnologyPassport"' +
          //' WHERE "VEntities"."ID" = ' + req.body.id;//+
          ' WHERE "TechnologyPassport"."ID" = ' + req.body.id;//+
        //' AND "VEntities"."TemplateSign"';

        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
pasportRouter.post('/get_tech_passport_template_list_by_parent_id', cors(),
  function (req, res) {
    console.log('get_tech_passport_template_list_by_parent_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = '';
        if (req.body.full_data) {
          _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'SELECT *' +
            ' FROM "MSTG"."VTechnologyPassport"' +
            ' WHERE "VTechnologyPassport"."VEntityStructure" = ' + req.body.parent_id +
            'AND "VTechnologyPassport"."TemplateSign"';
        }
        else {
          _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'SELECT "VTechnologyPassport"."ID", "ShortTitle", "ArchiveSign", "SecurityLevel"' +
            ' FROM "MSTG"."VTechnologyPassport"' +
            ' WHERE "VTechnologyPassport"."EntityStructure" = ' + req.body.parent_id +
            ' AND "VTechnologyPassport"."TemplateSign"';
        }
        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });
//---
//get_type_targeted_list
//-----------------------------------------------------------------------------------
pasportRouter.post('/get_type_targeted_list', cors(),
  function (req, res) {
    console.log('get_type_targeted_list request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "MSTG"."TypeTargeted";';
        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/get_targeted_list', cors(),
  function (req, res) {
    console.log('get_targeted_list request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "MSTG"."VTargeted" ' +
          ' WHERE "PassportCSTP"=' + "'" + req.body.parent_id + "'";
        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });
//-----------------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------------
pasportRouter.post('/create_targeted', cors(),
  function (req, res) {
    console.log('create_targeted request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'INSERT INTO "MSTG"."Targeted"(' +
          '"PassportCSTP",' +
          '"TypeTargeted",' +
          '"Name",' +
          '"Volume"' +
          ') VALUES (' +
          '\'' + req.body.targeted.PassportCSTP + '\',' +
          ' \'' + req.body.targeted.TypeTargeted + '\',' +
          ' \'' + req.body.targeted.Name + '\',' +
          ' \'' + req.body.targeted.Volume + '\'' +
          ' );';
        console.log(_sql_str);
        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/remove_targeted', cors(),
  function (req, res) {
    console.log('remove_targeted request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        _sql_str =
          'DELETE FROM "MSTG"."Targeted" WHERE "ID"=\'' + req.body.ID + '\';';
        console.log(_sql_str);
        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/get_registry_by_parent_id', cors(),
  function (req, res) {
    console.log('get_registry_by_parent_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "MSTG"."VTechnologyCSTP" ' +
          ' WHERE "PassportCSTP"=' + "'" + req.body.ID + "'";
        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/create_registry', cors(),
  function (req, res) {
    console.log('create_registry request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        //TODO
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'INSERT INTO "MSTG"."VTechnologyCSTP"(' +
          '"PassportCSTP",' +
          '"TypeTargeted",' +
          '"Name",' +
          '"Volume"' +
          ') VALUES (' +
          '\'' + req.body.targeted.PassportCSTP + '\',' +
          ' \'' + req.body.targeted.TypeTargeted + '\',' +
          ' \'' + req.body.targeted.Name + '\',' +
          ' \'' + req.body.targeted.Volume + '\'' +
          ' );';
        console.log(_sql_str);
        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/create_registry_list', cors(),
  function (req, res) {
    console.log('create_registry_list request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if ((req.body.user != undefined) && (req.body.passport_list != undefined)) {
        //TODO
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'INSERT INTO "MSTG"."TechnologyCSTP"(' +
          '"PassportCSTP",' +
          '"TechnologyPassport"' +
          ') VALUES ';
        for (let i = 0; i < req.body.passport_list.length - 1; i++) {
          _sql_str += '(\'' + req.body.cstp_id + '\', \'' + req.body.passport_list[i] + '\'),';
        }
        _sql_str += '(\'' + req.body.cstp_id + '\', \'' + req.body.passport_list[req.body.passport_list.length - 1] + '\');';
        //'\'' + req.body.targeted.PassportCSTP + '\',' +
        //' \'' + req.body.targeted.TypeTargeted + '\',' +
        //' \'' + req.body.targeted.Name + '\',' +
        //' \'' + req.body.targeted.Volume + '\'' +
        //' );';
        console.log(_sql_str);
        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/remove_registry', cors(),
  function (req, res) {
    console.log('remove_registry request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        _sql_str =
          'DELETE FROM "MSTG"."TechnologyCSTP" WHERE "TechnologyPassport"=\'' + req.body.tech_id +
          '\' AND ' +
          '"PassportCSTP"=\'' + req.body.cstp_id + '\';';
        console.log(_sql_str);
        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/vtb_get_csv_list', cors(),
  function (req, res) {
    console.log('vtb_get_csv_list request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = '';
        _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT *' +
          ' FROM "VTB"."VViewVTB"' +
          ' WHERE "VViewVTB"."Entities" = \'' + req.body.parent_id + '\'';
        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/vtb_get_csv_by_id', cors(),
  function (req, res) {
    console.log('vtb_get_csv_by_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    //
    let _csv_array = [];
    let _names_array = [];
    let csv_results = [];
    //
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = '';
        _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT *' +
          ' FROM "VTB"."VViewVTB"' +
          ' WHERE "VViewVTB"."ID" = \'' + req.body.id + '\'';
        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/vtb_remove_csv', cors(),
  function (req, res) {
    console.log('vtb_remove_csv request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        _sql_str =
          'DELETE FROM "VTB"."ViewVTB" WHERE "ID"=\'' + req.body.id + '\';';
        console.log(_sql_str);
        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/create_vtb_csv', cors(),
  function (req, res) {
    console.log('create_vtb_csv request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'INSERT INTO "VTB"."ViewVTB"(' +
          '"ShortTitle",' +
          '"Description",' +
          '"Entities",' +
          '"SecurityLevel",' +
          '"Content"' +
          ') VALUES (' +
          '\'' + req.body.item.ShortTitle + '\',' +
          ' \'' + req.body.item.Description + '\',' +
          ' \'' + req.body.item.Entities + '\',' +
          ' \'' + req.body.item.SecurityLevel + '\',' +
          ' \'' + req.body.item.Content + '\'' +
          ' );';
        console.log(_sql_str);
        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//-----------------------------------------------------------------------------------
pasportRouter.post('/update_vtb_csv', cors(),
  function (req, res) {
    console.log('update_vtb_csv request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'UPDATE "VTB"."ViewVTB"' +
          'SET ' +
          ' "ShortTitle"=' + '\'' + req.body.item.ShortTitle + '\'' +
          ', "Description"=' + "'" + req.body.item.Description + "'" +
          ', "Content"=' + "'" + req.body.item.Content + "'" +
          ', "SecurityLevel"=' + "'" + req.body.item.SecurityLevel + "'" +
          ' WHERE "ID"=' + "'" + req.body.item.ID + "'";

        pdb.any(_sql_str)
          .then(data => {
            res.send({ res: 'success' });
          })
          .catch(error => {
            console.log(error.message);
            res.send({ res: error.message });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });
//------------------------------------------------------------------------
pasportRouter.post('/csv_vtb_modal_form', cors(),
  function (req, res) {
    console.log('csv_vtb_modal_form request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var entity_data;
        var security_data;
        var _sql_str_entity = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "VTB"."ViewVTB' +
          '" WHERE "ID" = \'' + req.body.ID + '\';';
        //
        var _sql_str_security_levels = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "Security"."VSecurityLevel"';
        //request entity
        console.log(_sql_str_entity);
        pdb.any(_sql_str_entity)
          .then(data => {
            entity_data = data[0];
            //request security levels
            pdb.any(_sql_str_security_levels)
              .then(data => {
                security_data = data;
                res.send({ entity_data: entity_data, security_data: security_data, jwt: token });
              })
              .catch(error => {
                console.log(error);
                res.send(error);
              });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });

module.exports = pasportRouter;