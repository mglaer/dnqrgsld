var express = require('express');
const fs = require('fs');
const adminRouter = express.Router();
const cors = require('cors');

//var config = JSON.parse(fs.readFileSync("config.json"));

const { makeHash, makeToken, IsValidToken } = require('../lib/auth_tools');
const { pdb } = require('../lib/postgress');

const set_session_id = "SET SESSION my.vars.CurrentSID = '71';";

adminRouter.use(async(_, __, next) => {
  await pdb.query(set_session_id);
  next();
});

adminRouter.post('/get_groups_and_users', cors(),
  function (req, res) {
    console.log('structure request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "Security"."VGroupsAndUsersStructure";';
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
adminRouter.post('/users', cors(),
  function (req, res) {
    console.log('users request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "Security"."VUsers";';
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
adminRouter.post('/create_user', cors(),
  function (req, res) {
    console.log('create_user request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'INSERT INTO "Security"."Users" (' +
          '"FirstName", "LastName", "MiddleName", "Login", "Password", "SecurityLevel")' +
          ' VALUES ' +
          '(\'' + req.body.target_user.data.FirstName + '\',' +
          ' \'' + req.body.target_user.data.LastName + '\',' +
          ' \'' + req.body.target_user.data.MiddleName + '\',' +
          ' \'' + req.body.target_user.data.Login + '\',' +
          ' \'' + makeHash(req.body.target_user.data.Password) + '\',' +
          ' \'' + req.body.target_user.security_level.ID + '\');';

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
adminRouter.post('/update_user', cors(),
  function (req, res) {
    console.log('update_user request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      var _sql_str = '';
      if (req.body.user != undefined) {
        if (req.body.target_user.data.Password != '') {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "Security"."Users"' +
            'SET ' +
            '  "Login"=' + '\'' + req.body.target_user.data.Login + '\'' +
            ', "Password"=' + "'" + makeHash(req.body.target_user.data.Password) + "'" +
            ', "FirstName"=' + "'" + req.body.target_user.data.FirstName + "'" +
            ', "LastName"=' + "'" + req.body.target_user.data.LastName + "'" +
            ', "MiddleName"=' + "'" + req.body.target_user.data.MiddleName + "'" +
            ', "Email"=' + "'" + req.body.target_user.data.Email + "'" +
            ', "Phone"=' + "'" + req.body.target_user.Phone + "'" +
            ', "SecurityLevel"=' + "'" + req.body.target_user.security_level.ID + "'" +
            //', ArchiveSign= ' + req.body.ArchiveSign +
            ' WHERE "ID"=' + "'" + req.body.target_user.data.ID + "'";
        }
        else {
          _sql_str =
            'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
            'UPDATE "Security"."Users"' +
            'SET ' +
            ' "Login"=' + '\'' + req.body.target_user.data.Login + '\'' +
            //', "Password"=' + "'" + makeHash(req.body.target_user.Password) + "'" +
            ', "FirstName"=' + "'" + req.body.target_user.data.FirstName + "'" +
            ', "LastName"=' + "'" + req.body.target_user.data.LastName + "'" +
            ', "MiddleName"=' + "'" + req.body.target_user.data.MiddleName + "'" +
            ', "Email"=' + "'" + req.body.target_user.data.Email + "'" +
            ', "Phone"=' + "'" + req.body.target_user.data.Phone + "'" +
            ', "SecurityLevel"=' + "'" + req.body.target_user.security_level.ID + "'" +
            //', ArchiveSign= ' + req.body.ArchiveSign +
            ' WHERE "ID"=' + "'" + req.body.target_user.data.ID + "'";
        }
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
adminRouter.post('/user_activation', cors(),
  function (req, res) {
    console.log('user_activation request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'UPDATE "Security"."Users"' +
          ' SET' +
          ' "ArchiveSign"=' + '\'' + req.body.target_user.ArchiveSign + '\'' +
          ' WHERE "ID"=' + '\'' + req.body.target_user.ID + '\'';
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
//---Groups--------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
adminRouter.post('/groups', cors(),
function (req, res) {
  console.log('groups request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."VGroups";';
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
//---user modal form---------------------------------------------------------------
adminRouter.post('/group_modal_form', cors(),
function (req, res) {
  console.log('group_modal_form request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var group_data;
      var security_data;
      var membership_data;
      //
      var _sql_str_user = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."Groups' +
        '" WHERE "ID" = \'' + req.body.ID + '\';';
      //
      var _sql_str_security_levels = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."VSecurityLevel"';
      //
      var _sql_str_groups_member = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        ' SELECT "Parent_Group"."ID", "Parent_Group"."ShortTitle"' +
        ' FROM "Security"."VGroupsAndUsersStructure" AS "Parent_Group", "Security"."VGroupsAndUsersStructure" AS "Child_User"' +
        ' WHERE "Child_User"."ID" = \'' + req.body.ID + '\' AND "Child_User"."Parent" = "Parent_Group"."ID" AND "Parent_Group"."ID" <> \'-2\';';
      //request user
      pdb.any(_sql_str_user)
        .then(data => {
          group_data = data[0];
          //request security levels
          pdb.any(_sql_str_security_levels)
            .then(data => {
              security_data = data;
              //request groups membership
              pdb.any(_sql_str_groups_member)
                .then(data => {
                  membership_data = data;
                  //return result tables
                  res.send({ group_data: group_data, security_data: security_data, membership_data: membership_data, jwt: token });
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
adminRouter.post('/create_group', cors(),
function (req, res) {
  console.log('create_group request');
  let token;
  var _sql_str = '';
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      if (req.body.target_group.data.Parent != '-1') {
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'INSERT INTO "Security"."Groups" (' +
          '"ShortTitle", "Description", "Parent", "SecurityLevel")' +
          ' VALUES ' +
          '(\'' + req.body.target_group.data.ShortTitle + '\',' +
          ' \'' + req.body.target_group.data.Description + '\',' +
          ' \'' + req.body.target_group.data.Parent + '\',' +
          ' \'' + req.body.target_group.security_level.ID + '\');';
      }
      else {
        _sql_str =
          'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'INSERT INTO "Security"."Groups" (' +
          '"ShortTitle", "Description", "Parent", "SecurityLevel")' +
          ' VALUES ' +
          '(\'' + req.body.target_group.data.ShortTitle + '\',' +
          ' \'' + req.body.target_group.data.Description + '\',' +
          ' NULL,' +
          ' \'' + req.body.target_group.security_level.ID + '\');';

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
adminRouter.post('/update_group', cors(),
function (req, res) {
  console.log('update_group request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    var _sql_str = '';
    if (req.body.user != undefined) {
      _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'UPDATE "Security"."Groups"' +
        'SET ' +
        '  "ShortTitle"=' + '\'' + req.body.target_group.data.ShortTitle + '\'' +
        ', "Description"=' + "'" + req.body.target_group.data.Description + "'" +
        //', "Parent"=' + "'" + req.body.target_group.Parent + "'" +
        ', "SecurityLevel"=' + "'" + req.body.target_group.security_level.ID + "'" +
        ' WHERE "ID"=' + "'" + req.body.target_group.data.ID + "'";

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
adminRouter.post('/group_activation', cors(),
function (req, res) {
  console.log('group_activation request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str =
        'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'UPDATE "Security"."Groups"' +
        ' SET' +
        ' "ArchiveSign"=' + '\'' + req.body.target_group.ArchiveSign + '\'' +
        ' WHERE "ID"=' + '\'' + req.body.target_group.ID + '\'';
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
adminRouter.post('/get_users_by_parent_id', cors(),
function (req, res) {
  console.log('get_users_by_parent_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."' +
        'VUsers' +
        '" where "Parent" = \'' + req.body.Parent + '\';';
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
adminRouter.post('/get_groups_by_parent_id', cors(),
function (req, res) {
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  console.log('get_groups_by_parent_id request');
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."' +
        'VGroups' +
        '" where "Parent" = \'' + req.body.Parent + '\';';
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
adminRouter.post('/get_user_by_id', cors(),
function (req, res) {
  console.log('get_users_by_parent_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."' +
        'VUsers' +
        '" WHERE "ID" = \'' + req.body.ID + '\';';
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
//---!!!-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//---VGroupsAndUsersStructure---
adminRouter.post('/vgroupsandusersstructure_get_item_by_id', cors(),
function (req, res) {
  console.log('vgroupsandusersstructure_get_item_by_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."' +
        'VGroupsAndUsersStructure' +
        '" WHERE "ID" = \'' + req.body.ID + '\';';
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
adminRouter.post('/vgroupsandusersstructure_get_items_by_parent_id', cors(),
function (req, res) {
  console.log('vgroupsandusersstructure_get_items_by_parent_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  var _sql_str = '';
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      if (req.body.Parent === 0) {
        _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "Security"."' +
          'VGroupsAndUsersStructure' +
          '" WHERE "Parent" IS NULL;';
      }
      else {
        _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "Security"."' +
          'VGroupsAndUsersStructure' +
          '" WHERE "Parent" = \'' + req.body.Parent + '\';';
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
//---VGroups---
adminRouter.post('/vgroups_get_item_by_id', cors(),
function (req, res) {
  console.log('vgroups_get_item_by_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."' +
        'VGroups' +
        '" where "ID" = \'' + req.body.ID + '\';';
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
adminRouter.post('/vgroups_get_items_by_parent_id', cors(),
function (req, res) {
  console.log('vgroups_get_items_by_parent_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."' +
        'VGroups' +
        '" where "Parent" = \'' + req.body.Parent + '\';';
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
//---VUsers---
adminRouter.post('/vusers_get_item_by_id', cors(),
function (req, res) {
  console.log('vusers_get_item_by_id request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."' +
        'VUsers' +
        '" WHERE "ID" = \'' + req.body.ID + '\';';
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
//---Groups member-------------------------------------------------------------------
adminRouter.post('/groups_member', cors(),
function (req, res) {
  console.log('groups_member request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        ' SELECT "Parent_Group"."ID", "Parent_Group"."ShortTitle"' +
        ' FROM "Security"."VGroupsAndUsersStructure" AS "Parent_Group", "Security"."VGroupsAndUsersStructure" AS "Child_User"' +
        ' WHERE "Child_User"."ID" = \'' + req.body.ID + '\' AND "Child_User"."Parent" = "Parent_Group"."ID" AND "Parent_Group"."ID" <> \'-2\';';
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
//---user modal form---------------------------------------------------------------
adminRouter.post('/user_modal_form', cors(),
function (req, res) {
  console.log('user_modal_form request');
  let token;
  let token_check_result = IsValidToken(req.body.jwt);
  if (token_check_result.jwt) {
    token = makeToken(req.body.user.ID);
    if (req.body.user != undefined) {
      var user_data;
      var security_data;
      var membership_data;
      //
      var _sql_str_user = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."Users' +
        '" WHERE "ID" = \'' + req.body.ID + '\';';
      //
      var _sql_str_security_levels = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        'SELECT * FROM "Security"."VSecurityLevel"';
      //
      var _sql_str_groups_member = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
        ' SELECT "Parent_Group"."ID", "Parent_Group"."ShortTitle"' +
        ' FROM "Security"."VGroupsAndUsersStructure" AS "Parent_Group", "Security"."VGroupsAndUsersStructure" AS "Child_User"' +
        ' WHERE "Child_User"."ID" = \'' + req.body.ID + '\' AND "Child_User"."Parent" = "Parent_Group"."ID" AND "Parent_Group"."ID" <> \'-2\';';
      //request user
      pdb.any(_sql_str_user)
        .then(data => {
          user_data = data[0];
          //request security levels
          pdb.any(_sql_str_security_levels)
            .then(data => {
              security_data = data;
              //request groups membership
              pdb.any(_sql_str_groups_member)
                .then(data => {
                  membership_data = data;
                  //return result tables
                  res.send({ user_data: user_data, security_data: security_data, membership_data: membership_data, jwt: token });
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

module.exports = adminRouter; 