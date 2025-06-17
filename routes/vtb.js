var express = require('express');
const fs = require('fs');
const vtbRouter = express.Router();
const cors = require('cors');

const { makeHash, makeToken, IsValidToken } = require('../lib/auth_tools');
const { pdb } = require('../lib/postgress');

const set_session_id = "SET SESSION my.vars.CurrentSID = '71';";

vtbRouter.use(async(_, __, next) => {
  await pdb.query(set_session_id);
  next();
});


vtbRouter.post('/get_security_list', cors(),
  function (req, res) {
    console.log('get_security_list request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "Security"."VSecurityLevel";';
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
vtbRouter.post('/get_template_list_by_parent_id', cors(),
  function (req, res) {
    console.log('get_template_list_by_parent_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = '';
        if (req.body.full_data) {
          _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'SELECT *' +
            ' FROM "Ontologies"."VEntities"' +
            ' WHERE "VEntities"."VEntityStructure" = ' + req.body.parent_id +
            'AND "VEntities"."TemplateSign"';
        }
        else {
          _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'SELECT "VEntities"."ID", "ShortTitle", "Description", "ArchiveSign", "SecurityLevel"' +
            ' FROM "Ontologies"."VEntities"' +
            ' WHERE "VEntities"."EntityStructure" = ' + req.body.parent_id +
            ' AND "VEntities"."TemplateSign"';
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
vtbRouter.post('/get_template_by_id', cors(),
  function (req, res) {
    console.log('get_template_by_id request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT *' +
          ' FROM "Ontologies"."Entities"' +
          //' WHERE "VEntities"."ID" = ' + req.body.id;//+
          ' WHERE "Entities"."ID" = ' + req.body.id;//+
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
vtbRouter.post('/custom_request', cors(),
  function (req, res) {
    console.log('custom_request request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' + req.body.custom_request;

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
vtbRouter.post('/download_file', cors(),
  function (req, res) {
    console.log('download_file request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        if (req.body.filename != '') {
          fs.readFile(ontology_storage + req.body.filename, 'base64', (err, data) => {
            //fs.readFile(ontology_storage + req.body.filename, (err, data) => {
            if (err) {
              console.error(err);
              res.send(err.message);
            }
            else
            {
              //console.log(data);
              res.send({ res: "success", data: data, jwt: token });
            }            
          });
        }
        else {
          res.send({ error: 'Not authorized' });
        }
      }
      else {
        res.send({ error: 'filename is empty' });
      }
    }
    else {
      res.send({ error: 'Token not valid. Not authorized' });
    }
    //-------------------------------------
  });

module.exports = vtbRouter;  