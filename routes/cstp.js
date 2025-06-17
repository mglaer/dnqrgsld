var express = require('express');
const fs = require('fs');
var router = express.Router();
const cors = require('cors');
//var config = JSON.parse(fs.readFileSync("config.json"));

const { makeHash, makeToken, IsValidToken } = require('../lib/auth_tools');
const { pdb } = require('../lib/postgress');

//-------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------
router.post('/get_passport_cstp', cors(),
  function (req, res) {
    console.log('get_passport_cstp request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT "ID",' +
          '"ShortTitle",' +
          '"ArchiveSign",' +
          '"SecurityLevel",' +
          '"SecurityID",' +
          '"Goal",' +
          '"Type",' +
          ' to_char("DateInitiation", \'dd.mm.yyyy\') AS "DateInitiation",' +
          '"Document",' +
          '"Members",' +
          'to_char("StartDate", \'dd.mm.yyyy\') AS "StartDate",' +
          'to_char("EndDate", \'dd.mm.yyyy\') AS "EndDate",' +
          '"Costs"' +
          'FROM "MSTG"."VPassportCSTP";';
        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error.message);
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
  });
//-----------------------------------------------------------------------------------
router.post('/get_passport_cstp_by_id', cors(),
  function (req, res) {
    console.log('get_passport_cstp_by_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT "ID",' +
          '"ShortTitle",' +
          '"ArchiveSign",' +
          '"SecurityLevel",' +
          '"SecurityID",' +
          '"Goal",' +
          '"Type",' +
          ' to_char("DateInitiation", \'dd.mm.yyyy\') AS "DateInitiation",' +
          '"Document",' +
          '"Members",' +
          'to_char("StartDate", \'dd.mm.yyyy\') AS "StartDate",' +
          'to_char("EndDate", \'dd.mm.yyyy\') AS "EndDate",' +
          '"Costs"' +
          'FROM "MSTG"."PassportCSTP"' +
          ' WHERE "ID" = \'' + req.body.ID + '\';';
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
  });
//-----------------------------------------------------------------------------------  
router.post('/passport_cstp_activation', cors(),
  function (req, res) {
    console.log('passport_cstp_activation request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = "";
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'UPDATE "MSTG"."PassportCSTP"' +
          ' SET' +
          ' "ArchiveSign"=' + '\'' + req.body.target_entity.ArchiveSign + '\'' +
          ' WHERE "ID"=' + '\'' + req.body.target_entity.ID + '\'';
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
router.post('/vtechnology_passport_get_items_by_parent_id', cors(),
  function (req, res) {
    console.log('vvtechnology_passport_get_items_by_parent_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    var _sql_str = '';
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        if (req.body.entity_all_types) {//all types
          if (req.body.all_data === true) {
            _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
              'SELECT * FROM "MSTG"."' +
              'VTechnologyPassportStructure;';
          }
          else {
            if (req.body.Parent === 0) {
              _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                'SELECT * FROM "MSTG"."' +
                'VTechnologyPassportStructure' +
                '" WHERE "Parent" IS NULL ;';
            }
            else {
              _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                'SELECT * FROM "MSTG"."' +
                'VTechnologyPassportStructure' +
                '" WHERE "Parent" = \'' + req.body.Parent + '\';';
            }
          }
        }
        else {//only structure
          if (req.body.all_data === true) {
            _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
              'SELECT * FROM "MSTG"."' +
              'VTechnologyPassportStructure' +
              '" WHERE "TypeElement" = \'Structure\';';
          }
          else {
            if (req.body.Parent === 0) {
              _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                'SELECT * FROM "MSTG"."' +
                'VTechnologyPassportStructure' +
                '" WHERE "Parent" IS NULL AND "TypeElement" = \'Structure\';';
            }
            else {
              _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
                'SELECT * FROM "MSTG"."' +
                'VTechnologyPassportStructure' +
                '" WHERE "Parent" = \'' + req.body.Parent + '\' AND "TypeElement" = \'Structure\';';
            }
          }
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
//-----------------------------------------------------------------------------------
router.post('/create_passport_cstp', cors(),
  function (req, res) {
    console.log('create_passport_cstp request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'INSERT INTO "MSTG"."PassportCSTP"(' +
          '"ShortTitle",' +
          '"ArchiveSign",' +
          '"SecurityLevel",' +
          '"Goal",' +
          '"Type",' +
          '"DateInitiation",' +
          '"Document",' +
          '"Members",' +
          '"StartDate",' +
          '"EndDate",' +
          '"Costs")' +
          'VALUES (' +
          '\'' + req.body.passport_cstp.ShortTitle + '\',' +
          ' \'' + 'false' + '\',' +
          ' \'' + req.body.passport_cstp.SecurityLevel + '\',' +
          ' \'' + req.body.passport_cstp.Goal + '\',' +
          ' \'' + req.body.passport_cstp.Type + '\',' +
          '  to_date(\'' + req.body.passport_cstp.DateInitiation + '\',\'dd.mm.yyyy\'),' +
          ' \'' + req.body.passport_cstp.Document + '\',' +
          ' \'' + req.body.passport_cstp.Members + '\',' +
          '  to_date(\'' + req.body.passport_cstp.StartDate + '\',\'dd.mm.yyyy\'),' +
          '  to_date(\'' + req.body.passport_cstp.EndDate + '\',\'dd.mm.yyyy\'),' +
          ' \'' + req.body.passport_cstp.Costs + '\');';
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
//----------------------------------------------------------------------------------
router.post('/get_passport_cstp_by_id', cors(),
  function (req, res) {
    console.log('get_passport_cstp_by_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    var _sql_str = '';
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "MSTG"."' +
          'PassportCSTP' +
          '" WHERE "ID"=' + req.body.id + ' ;';
        console.log(_sql_str);
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
router.post('/update_passport_cstp', cors(),
  function (req, res) {
    console.log('update_passport_cstp request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'UPDATE "MSTG"."PassportCSTP"' +
          ' SET ' +
          ' "ShortTitle"=' + '\'' + req.body.passport.ShortTitle + '\'' +
          ', "ArchiveSign"=' + req.body.passport.ArchiveSign +
          ', "SecurityLevel"=' + "'" + req.body.passport.SecurityLevel + "'" +
          ', "Goal"=' + "'" + req.body.passport.Goal + "'" +
          ', "Type"=' + "'" + req.body.passport.Type + "'" +
          ', "DateInitiation"=' + '  to_date(\'' + req.body.passport.DateInitiation + '\',\'dd.mm.yyyy\')' +//"'" + req.body + "'" +
          ', "Document"=' + "'" + req.body.passport.Document + "'" +
          ', "Members"=' + "'" + req.body.passport.Members + "'" +
          ', "StartDate"=' + '  to_date(\'' + req.body.passport.StartDate + '\',\'dd.mm.yyyy\')' + //"'" + req.body + "'" +
          ', "EndDate"=' + '  to_date(\'' + req.body.passport.EndDate + '\',\'dd.mm.yyyy\')' +//"'" + req.body + "'" +
          ', "Costs"=' + "'" + req.body.passport.Costs + "'" +
          ' WHERE "ID"=' + "'" + req.body.passport.ID + "'";
        //console.log(_sql_str);
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
module.exports = router; 