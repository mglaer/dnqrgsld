var express = require('express');
const fs = require('fs');
var router = express.Router();
var multer = require('multer');
const cors = require('cors');
const { exec } = require("child_process");
var rimraf = require("rimraf");
//var config = JSON.parse(fs.readFileSync("config.json"));
const j = express.json();

const { makeHash, makeToken, IsValidToken } = require('../lib/auth_tools');
const { pdb } = require('../lib/postgress');
//const __basedir = "~/upload_files";
const file_storage = 'tempuploads/';
const ontology_storage = 'ontology_storage/';
const redkey_homepath = 'redkey_modules/';
const adminRouter = require('./admin');
const ontologyRouter = require('./ontology');
const cstpRouter = require('./cstp');
const rkRouter = require('./red_key');
const projectRouter = require('./project')
const vtbRouter = require('./vtb')
const pasportRouter = require('./pasport')
//---------------------------upload file-----------
//const passport= require('passport');
//const authWare = passport.authenticate('jwt', {session:false});
var upload = multer({
  dest: file_storage, fileFilter(req, file, cb) {

    // We are providing a regular expression 
    // which accepts only jpg,jpeg and png
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Upload an image'));
    }
    cb(undefined, true);
  }
});


// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it
/*
var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    // Uploads is the Upload_folder_name
    cb(null, "uploads")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg")
  }
})

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {

    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);

    //var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    var extname = '~/storage/'+file.originalname;

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb("Error: File upload only supports the "
      + "following filetypes - " + filetypes);
  }

  // mypic is the name of file attribute
}).single("file");
*/
//-------------------------------------------------

router.use(cors({
  credentials: true,
  origin: true
  /*origin: [    '*',    'http://localhost:4200',  ],*/
  //methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
//
//
const set_session_id = "SET SESSION my.vars.CurrentSID = '71';";

//! Setting session id
router.use(async(_, __, next) => {
    await pdb.query(set_session_id);
    next();
});


console.log('astpn backend runned');

router.get('/', function (req, res, next) {
  console.log('show home page');
  res.render('index', { title: 'Express' });
});
//-----------------------------------------------------------------------------------
router.post('/root_menu', cors(),
  function (req, res) {
    console.log('root_menu request');
    let token;
    let token_check_result = IsValidToken(req.body.jwt);
    if (token_check_result.jwt) {
      token = makeToken(req.body.user.ID);
      if (req.body.user != undefined) {
        var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
          'SELECT * FROM "Security"."VMenusOperations";';
        pdb.any(_sql_str)
          .then(data => {
            res.send({ data: data, jwt: token });
          })
          .catch(error => {
            console.log(error);
            res.send({ error: error });
          });
      }
      else {
        res.send({ error: 'Not authorized' });
      }
    }
    else {
      console.log('token not valid');
      res.send({ error: 'Token not valid. Not authorized' });
    }
  });

router.use('/', adminRouter);
router.use('/', ontologyRouter);
router.use('/', cstpRouter);
router.use('/', rkRouter);
router.use('/', projectRouter);
router.use('/', vtbRouter);
router.use('/', pasportRouter);
//-----------------------------------------------------------------------------------
// router.post('/get_groups_and_users', cors(),
//   function (req, res) {
//     console.log('structure request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."VGroupsAndUsersStructure";';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/users', cors(),
//   function (req, res) {
//     console.log('users request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."VUsers";';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }

//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/create_user', cors(),
//   function (req, res) {
//     console.log('create_user request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'INSERT INTO "Security"."Users" (' +
//           '"FirstName", "LastName", "MiddleName", "Login", "Password", "SecurityLevel")' +
//           ' VALUES ' +
//           '(\'' + req.body.target_user.data.FirstName + '\',' +
//           ' \'' + req.body.target_user.data.LastName + '\',' +
//           ' \'' + req.body.target_user.data.MiddleName + '\',' +
//           ' \'' + req.body.target_user.data.Login + '\',' +
//           ' \'' + makeHash(req.body.target_user.data.Password) + '\',' +
//           ' \'' + req.body.target_user.security_level.ID + '\');';

//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/update_user', cors(),
//   function (req, res) {
//     console.log('update_user request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         if (req.body.target_user.data.Password != '') {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "Security"."Users"' +
//             'SET ' +
//             '  "Login"=' + '\'' + req.body.target_user.data.Login + '\'' +
//             ', "Password"=' + "'" + makeHash(req.body.target_user.data.Password) + "'" +
//             ', "FirstName"=' + "'" + req.body.target_user.data.FirstName + "'" +
//             ', "LastName"=' + "'" + req.body.target_user.data.LastName + "'" +
//             ', "MiddleName"=' + "'" + req.body.target_user.data.MiddleName + "'" +
//             ', "Email"=' + "'" + req.body.target_user.data.Email + "'" +
//             ', "Phone"=' + "'" + req.body.target_user.Phone + "'" +
//             ', "SecurityLevel"=' + "'" + req.body.target_user.security_level.ID + "'" +
//             //', ArchiveSign= ' + req.body.ArchiveSign +
//             ' WHERE "ID"=' + "'" + req.body.target_user.data.ID + "'";
//         }
//         else {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "Security"."Users"' +
//             'SET ' +
//             ' "Login"=' + '\'' + req.body.target_user.data.Login + '\'' +
//             //', "Password"=' + "'" + makeHash(req.body.target_user.Password) + "'" +
//             ', "FirstName"=' + "'" + req.body.target_user.data.FirstName + "'" +
//             ', "LastName"=' + "'" + req.body.target_user.data.LastName + "'" +
//             ', "MiddleName"=' + "'" + req.body.target_user.data.MiddleName + "'" +
//             ', "Email"=' + "'" + req.body.target_user.data.Email + "'" +
//             ', "Phone"=' + "'" + req.body.target_user.data.Phone + "'" +
//             ', "SecurityLevel"=' + "'" + req.body.target_user.security_level.ID + "'" +
//             //', ArchiveSign= ' + req.body.ArchiveSign +
//             ' WHERE "ID"=' + "'" + req.body.target_user.data.ID + "'";
//         }
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/user_activation', cors(),
//   function (req, res) {
//     console.log('user_activation request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "Security"."Users"' +
//           ' SET' +
//           ' "ArchiveSign"=' + '\'' + req.body.target_user.ArchiveSign + '\'' +
//           ' WHERE "ID"=' + '\'' + req.body.target_user.ID + '\'';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }

//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
//-----------------------------------------------------------------------------------
//---Groups--------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
// router.post('/groups', cors(),
//   function (req, res) {
//     console.log('groups request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."VGroups";';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }

//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //---user modal form---------------------------------------------------------------
// router.post('/group_modal_form', cors(),
//   function (req, res) {
//     console.log('group_modal_form request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var group_data;
//         var security_data;
//         var membership_data;
//         //
//         var _sql_str_user = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."Groups' +
//           '" WHERE "ID" = \'' + req.body.ID + '\';';
//         //
//         var _sql_str_security_levels = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."VSecurityLevel"';
//         //
//         var _sql_str_groups_member = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           ' SELECT "Parent_Group"."ID", "Parent_Group"."ShortTitle"' +
//           ' FROM "Security"."VGroupsAndUsersStructure" AS "Parent_Group", "Security"."VGroupsAndUsersStructure" AS "Child_User"' +
//           ' WHERE "Child_User"."ID" = \'' + req.body.ID + '\' AND "Child_User"."Parent" = "Parent_Group"."ID" AND "Parent_Group"."ID" <> \'-2\';';
//         //request user
//         pdb.any(_sql_str_user)
//           .then(data => {
//             group_data = data[0];
//             //request security levels
//             pdb.any(_sql_str_security_levels)
//               .then(data => {
//                 security_data = data;
//                 //request groups membership
//                 pdb.any(_sql_str_groups_member)
//                   .then(data => {
//                     membership_data = data;
//                     //return result tables
//                     res.send({ group_data: group_data, security_data: security_data, membership_data: membership_data, jwt: token });
//                   })
//                   .catch(error => {
//                     console.log(error);
//                     res.send(error);
//                   });
//               })
//               .catch(error => {
//                 console.log(error);
//                 res.send(error);
//               });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/create_group', cors(),
//   function (req, res) {
//     console.log('create_group request');
//     let token;
//     var _sql_str = '';
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         if (req.body.target_group.data.Parent != '-1') {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'INSERT INTO "Security"."Groups" (' +
//             '"ShortTitle", "Description", "Parent", "SecurityLevel")' +
//             ' VALUES ' +
//             '(\'' + req.body.target_group.data.ShortTitle + '\',' +
//             ' \'' + req.body.target_group.data.Description + '\',' +
//             ' \'' + req.body.target_group.data.Parent + '\',' +
//             ' \'' + req.body.target_group.security_level.ID + '\');';
//         }
//         else {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'INSERT INTO "Security"."Groups" (' +
//             '"ShortTitle", "Description", "Parent", "SecurityLevel")' +
//             ' VALUES ' +
//             '(\'' + req.body.target_group.data.ShortTitle + '\',' +
//             ' \'' + req.body.target_group.data.Description + '\',' +
//             ' NULL,' +
//             ' \'' + req.body.target_group.security_level.ID + '\');';

//         }
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/update_group', cors(),
//   function (req, res) {
//     console.log('update_group request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "Security"."Groups"' +
//           'SET ' +
//           '  "ShortTitle"=' + '\'' + req.body.target_group.data.ShortTitle + '\'' +
//           ', "Description"=' + "'" + req.body.target_group.data.Description + "'" +
//           //', "Parent"=' + "'" + req.body.target_group.Parent + "'" +
//           ', "SecurityLevel"=' + "'" + req.body.target_group.security_level.ID + "'" +
//           ' WHERE "ID"=' + "'" + req.body.target_group.data.ID + "'";

//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/group_activation', cors(),
//   function (req, res) {
//     console.log('group_activation request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "Security"."Groups"' +
//           ' SET' +
//           ' "ArchiveSign"=' + '\'' + req.body.target_group.ArchiveSign + '\'' +
//           ' WHERE "ID"=' + '\'' + req.body.target_group.ID + '\'';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }

//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/get_users_by_parent_id', cors(),
//   function (req, res) {
//     console.log('get_users_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."' +
//           'VUsers' +
//           '" where "Parent" = \'' + req.body.Parent + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/get_groups_by_parent_id', cors(),
//   function (req, res) {
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     console.log('get_groups_by_parent_id request');
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."' +
//           'VGroups' +
//           '" where "Parent" = \'' + req.body.Parent + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/get_user_by_id', cors(),
//   function (req, res) {
//     console.log('get_users_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."' +
//           'VUsers' +
//           '" WHERE "ID" = \'' + req.body.ID + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //---!!!-----------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------
// //---VGroupsAndUsersStructure---
// router.post('/vgroupsandusersstructure_get_item_by_id', cors(),
//   function (req, res) {
//     console.log('vgroupsandusersstructure_get_item_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."' +
//           'VGroupsAndUsersStructure' +
//           '" WHERE "ID" = \'' + req.body.ID + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/vgroupsandusersstructure_get_items_by_parent_id', cors(),
//   function (req, res) {
//     console.log('vgroupsandusersstructure_get_items_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     var _sql_str = '';
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         if (req.body.Parent === 0) {
//           _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'SELECT * FROM "Security"."' +
//             'VGroupsAndUsersStructure' +
//             '" WHERE "Parent" IS NULL;';
//         }
//         else {
//           _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'SELECT * FROM "Security"."' +
//             'VGroupsAndUsersStructure' +
//             '" WHERE "Parent" = \'' + req.body.Parent + '\';';
//         }
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }

//     //-------------------------------------
//   });
// //---VGroups---
// router.post('/vgroups_get_item_by_id', cors(),
//   function (req, res) {
//     console.log('vgroups_get_item_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."' +
//           'VGroups' +
//           '" where "ID" = \'' + req.body.ID + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/vgroups_get_items_by_parent_id', cors(),
//   function (req, res) {
//     console.log('vgroups_get_items_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."' +
//           'VGroups' +
//           '" where "Parent" = \'' + req.body.Parent + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //---VUsers---
// router.post('/vusers_get_item_by_id', cors(),
//   function (req, res) {
//     console.log('vusers_get_item_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."' +
//           'VUsers' +
//           '" WHERE "ID" = \'' + req.body.ID + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //---Groups member-------------------------------------------------------------------
// router.post('/groups_member', cors(),
//   function (req, res) {
//     console.log('groups_member request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           ' SELECT "Parent_Group"."ID", "Parent_Group"."ShortTitle"' +
//           ' FROM "Security"."VGroupsAndUsersStructure" AS "Parent_Group", "Security"."VGroupsAndUsersStructure" AS "Child_User"' +
//           ' WHERE "Child_User"."ID" = \'' + req.body.ID + '\' AND "Child_User"."Parent" = "Parent_Group"."ID" AND "Parent_Group"."ID" <> \'-2\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //---user modal form---------------------------------------------------------------
// router.post('/user_modal_form', cors(),
//   function (req, res) {
//     console.log('user_modal_form request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var user_data;
//         var security_data;
//         var membership_data;
//         //
//         var _sql_str_user = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."Users' +
//           '" WHERE "ID" = \'' + req.body.ID + '\';';
//         //
//         var _sql_str_security_levels = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."VSecurityLevel"';
//         //
//         var _sql_str_groups_member = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           ' SELECT "Parent_Group"."ID", "Parent_Group"."ShortTitle"' +
//           ' FROM "Security"."VGroupsAndUsersStructure" AS "Parent_Group", "Security"."VGroupsAndUsersStructure" AS "Child_User"' +
//           ' WHERE "Child_User"."ID" = \'' + req.body.ID + '\' AND "Child_User"."Parent" = "Parent_Group"."ID" AND "Parent_Group"."ID" <> \'-2\';';
//         //request user
//         pdb.any(_sql_str_user)
//           .then(data => {
//             user_data = data[0];
//             //request security levels
//             pdb.any(_sql_str_security_levels)
//               .then(data => {
//                 security_data = data;
//                 //request groups membership
//                 pdb.any(_sql_str_groups_member)
//                   .then(data => {
//                     membership_data = data;
//                     //return result tables
//                     res.send({ user_data: user_data, security_data: security_data, membership_data: membership_data, jwt: token });
//                   })
//                   .catch(error => {
//                     console.log(error);
//                     res.send(error);
//                   });
//               })
//               .catch(error => {
//                 console.log(error);
//                 res.send(error);
//               });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
//-----------------------------------------------------------------------------------
//---Ontology------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
// router.post('/ventityStructure_get_items_by_parent_id', cors(),
//   function (req, res) {
//     console.log('ventityStructure_get_items_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     var _sql_str = '';
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         if (req.body.entity_all_types) {//all types
//           if (req.body.all_data === true) {
//             _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//               'SELECT * FROM "Ontologies"."' +
//               'VEntityStructure";';
//           }
//           else {
//             if (req.body.Parent === 0) {
//               _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                 'SELECT * FROM "Ontologies"."' +
//                 'VEntityStructure' +
//                 '" WHERE "Parent" IS NULL ;';
//             }
//             else {
//               _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                 'SELECT * FROM "Ontologies"."' +
//                 'VEntityStructure' +
//                 '" WHERE "Parent" = \'' + req.body.Parent + '\';';
//             }
//           }
//         }
//         else {//only structure
//           if (req.body.all_data === true) {
//             _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//               'SELECT * FROM "Ontologies"."' +
//               'VEntityStructure' +
//               '" WHERE "TypeElement" = \'Structure\';';
//           }
//           else {
//             if (req.body.Parent === 0) {
//               _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                 'SELECT * FROM "Ontologies"."' +
//                 'VEntityStructure' +
//                 '" WHERE "Parent" IS NULL AND "TypeElement" = \'Structure\';';
//             }
//             else {
//               _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                 'SELECT * FROM "Ontologies"."' +
//                 'VEntityStructure' +
//                 '" WHERE "Parent" = \'' + req.body.Parent + '\' AND "TypeElement" = \'Structure\';';
//             }
//           }
//         }
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/ontology_modal_form', cors(),
//   function (req, res) {
//     console.log('ontology_modal_form request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var entity_data;
//         var security_data;
//         var type = req.body.Type;
//         if (type === 'Structure') {
//           var _sql_str_entity = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'SELECT * FROM "Ontologies"."EntityStructure' +
//             '" WHERE "ID" = \'' + req.body.ID + '\';';
//         }
//         else {
//           var _sql_str_entity = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'SELECT * FROM "Ontologies"."Entities' +
//             '" WHERE "ID" = \'' + req.body.ID + '\';';
//         }
//         //
//         var _sql_str_security_levels = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."VSecurityLevel"';
//         //request entity
//         console.log(_sql_str_entity);
//         pdb.any(_sql_str_entity)
//           .then(data => {
//             entity_data = data[0];
//             //request security levels
//             pdb.any(_sql_str_security_levels)
//               .then(data => {
//                 security_data = data;
//                 res.send({ entity_data: entity_data, security_data: security_data, jwt: token });
//               })
//               .catch(error => {
//                 console.log(error);
//                 res.send(error);
//               });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/update_ontology', cors(),
//   function (req, res) {
//     console.log('update_ontology request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         var type = req.body.Type;
//         if (type === 'Structure') {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "Ontologies"."EntityStructure"' +
//             'SET ' +
//             ' "ShortTitle"=' + '\'' + req.body.target_entity.data.ShortTitle + '\'' +
//             ', "Description"=' + "'" + req.body.target_entity.data.Description + "'" +
//             ', "SecurityLevel"=' + "'" + req.body.target_entity.security_level.ID + "'" +//security_level
//             ' WHERE "ID"=' + "'" + req.body.target_entity.data.ID + "'";
//         }
//         else {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "Ontologies"."Entities"' +
//             'SET ' +
//             ' "ShortTitle"=' + '\'' + req.body.target_entity.ShortTitle + '\'' +
//             ', "Description"=' + "'" + req.body.target_entity.Description + "'" +
//             ', "OpenContent"=' + "'" + JSON.stringify(req.body.target_entity.OpenContent) + "'" +
//             ', "PrivateContent"=' + "'" + JSON.stringify(req.body.target_entity.PrivateContent) + "'" +
//             //', "SecurityLevel"=' + "'" + req.body.target_entity.security_level.ID + "'" +//security_level
//             ', "SecurityLevel"=' + "'" + req.body.target_entity.SecurityLevel + "'" +
//             ', "URLPicture"=' + "'" + req.body.target_entity.URLPicture + "'" +

//             ' WHERE "ID"=' + "'" + req.body.target_entity.ID + "'";
//         }

//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }

//   });
// //-----------------------------------------------------------------------------------
// router.post('/update_template_content', cors(),
//   function (req, res) {
//     console.log('update_template_content request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "Ontologies"."Entities"' +
//           'SET ' +
//           ' "OpenContent"=' + "'" + JSON.stringify(req.body.open_content) + "'" +
//           ', "PrivateContent"=' + "'" + JSON.stringify(req.body.private_content) + "'" +
//           //', "SecurityLevel"=' + "'" + req.body.target_entity.security_level.ID + "'" +//security_level
//           ' WHERE "ID"=' + "'" + req.body.ID + "'";

//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }

//   });
// //-----------------------------------------------------------------------------------
// router.post('/ontology_activation', cors(),
//   function (req, res) {
//     console.log('ontology_activation request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = "";
//         let type = req.body.target_entity.TypeElement;
//         if (type === "Structure") {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "Ontologies"."EntityStructure"' +
//             ' SET' +
//             ' "ArchiveSign"=' + '\'' + req.body.target_entity.ArchiveSign + '\'' +
//             ' WHERE "ID"=' + '\'' + req.body.target_entity.ID + '\'';
//         }
//         else //if(type==="Entity")
//         {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "Ontologies"."Entities"' +
//             ' SET' +
//             ' "ArchiveSign"=' + '\'' + req.body.target_entity.ArchiveSign + '\'' +
//             ' WHERE "ID"=' + '\'' + req.body.target_entity.ID + '\'';
//         }
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });


//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/create_ontology', cors(),
//   function (req, res) {
//     console.log('create_ontology request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       var _order = 1;
//       if (req.body.user != undefined) {
//         var type = req.body.Type;
//         //---Structure---
//         if (type === 'Structure') {
//           //нужно получить order
//           if (req.body.target_entity.data.Parent != undefined) {
//             var _order_str = 'SELECT MAX ("Order")+1 AS max_order FROM "Ontologies"."EntityStructure" WHERE "Parent" = \'' + req.body.target_entity.data.Parent + '\'';
//             pdb.any(_order_str)
//               .then(data => {
//                 //---
//                 if (data[0].max_order === null) {
//                   _order = 1;
//                 }
//                 else {
//                   _order = data[0].max_order;
//                 }
//                 //---
//                 _sql_str =
//                   'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                   'INSERT INTO "Ontologies"."EntityStructure" (' +
//                   ' "ShortTitle",' +
//                   ' "Description",' +
//                   ' "SecurityLevel",' +
//                   ' "Parent",' +
//                   ' "Order")' +
//                   ' VALUES ' +
//                   '(\'' + req.body.target_entity.data.ShortTitle + '\',' +
//                   ' \'' + req.body.target_entity.data.Description + '\',' +
//                   ' \'' + req.body.target_entity.security_level.ID + '\',' +
//                   ' \'' + req.body.target_entity.data.Parent + '\',' +
//                   ' \'' + _order + '\');';
//                 console.log(_sql_str);
//                 pdb.any(_sql_str)
//                   .then(data => {
//                     res.send({ res: 'success' });
//                   })
//                   .catch(error => {
//                     console.log(error.message);
//                     res.send({ res: error.message });
//                   });
//               })
//               .catch(error => {
//                 console.log(error.message);
//                 res.send({ res: error.message });
//               });
//           }
//           else {//корневой элемент, order=1
//             _order = 1;
//             _sql_str =
//               'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//               'INSERT INTO "Ontologies"."EntityStructure" (' +
//               ' "ShortTitle",' +
//               ' "Description",' +
//               ' "SecurityLevel",' +
//               //' "Parent",' +
//               ' "Order")' +
//               ' VALUES ' +
//               '(\'' + req.body.target_entity.data.ShortTitle + '\',' +
//               ' \'' + req.body.target_entity.data.Description + '\',' +
//               ' \'' + req.body.target_entity.security_level.ID + '\',' +
//               //' \'' + req.body.target_entity.data.Parent + '\',' +
//               ' \'' + _order + '\');';
//             console.log(_sql_str);
//             pdb.any(_sql_str)
//               .then(data => {
//                 res.send({ res: 'success' });
//               })
//               .catch(error => {
//                 console.log(error.message);
//                 res.send({ res: error.message });
//               });
//           }
//         }
//         else {//---Entity and Template---
//           if (req.body.target_entity.TemplateSign) {
//             _sql_str =
//               'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//               'INSERT INTO "Ontologies"."Entities" (' +
//               ' "ShortTitle",' +
//               ' "Description",' +
//               ' "OpenContent",' +
//               ' "PrivateContent",' +
//               ' "SecurityLevel",' +
//               ' "EntityStructure",' +
//               ' "URLPicture",' +
//               ' "TemplateSign")' +
//               ' VALUES ' +
//               '(\'' + req.body.target_entity.ShortTitle + '\',' +
//               ' \'' + req.body.target_entity.Description + '\',' +
//               ' \'' + JSON.stringify(req.body.target_entity.OpenContent) + '\',' +
//               ' \'' + JSON.stringify(req.body.target_entity.PrivateContent) + '\',' +

//               ' \'' + req.body.target_entity.SecurityLevel + '\',' +
//               ' \'' + req.body.target_entity.EntityStructure + '\',' +
//               ' \'' + req.body.target_entity.URLPicture + '\',' +
//               ' \'' + req.body.target_entity.TemplateSign + '\');';
//           }
//           else {
//             _sql_str =
//               'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//               'INSERT INTO "Ontologies"."Entities" (' +
//               ' "ShortTitle",' +
//               ' "Description",' +
//               ' "OpenContent",' +
//               ' "PrivateContent",' +
//               ' "SecurityLevel",' +
//               ' "EntityStructure",' +
//               ' "Template",' +
//               ' "URLPicture",' +
//               ' "TemplateSign")' +
//               ' VALUES ' +
//               '(\'' + req.body.target_entity.ShortTitle + '\',' +
//               ' \'' + req.body.target_entity.Description + '\',' +
//               ' \'' + JSON.stringify(req.body.target_entity.OpenContent) + '\',' +
//               ' \'' + JSON.stringify(req.body.target_entity.PrivateContent) + '\',' +

//               ' \'' + req.body.target_entity.SecurityLevel + '\',' +
//               ' \'' + req.body.target_entity.EntityStructure + '\',' +
//               ' \'' + req.body.target_entity.Template + '\',' +
//               ' \'' + req.body.target_entity.URLPicture + '\',' +
//               ' \'' + req.body.target_entity.TemplateSign + '\');';
//           }

//           pdb.any(_sql_str)
//             .then(data => {
//               res.send({ res: 'success' });
//             })
//             .catch(error => {
//               console.log(error.message);
//               res.send({ res: error.message });
//             });
//         }
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
//----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
// router.post('/get_security_list', cors(),
//   function (req, res) {
//     console.log('get_security_list request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."VSecurityLevel";';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/get_template_list_by_parent_id', cors(),
//   function (req, res) {
//     console.log('get_template_list_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = '';
//         if (req.body.full_data) {
//           _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'SELECT *' +
//             ' FROM "Ontologies"."VEntities"' +
//             ' WHERE "VEntities"."VEntityStructure" = ' + req.body.parent_id +
//             'AND "VEntities"."TemplateSign"';
//         }
//         else {
//           _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'SELECT "VEntities"."ID", "ShortTitle", "Description", "ArchiveSign", "SecurityLevel"' +
//             ' FROM "Ontologies"."VEntities"' +
//             ' WHERE "VEntities"."EntityStructure" = ' + req.body.parent_id +
//             ' AND "VEntities"."TemplateSign"';
//         }
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/get_template_by_id', cors(),
//   function (req, res) {
//     console.log('get_template_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT *' +
//           ' FROM "Ontologies"."Entities"' +
//           //' WHERE "VEntities"."ID" = ' + req.body.id;//+
//           ' WHERE "Entities"."ID" = ' + req.body.id;//+
//         //' AND "VEntities"."TemplateSign"';

//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/custom_request', cors(),
//   function (req, res) {
//     console.log('custom_request request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' + req.body.custom_request;

//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/download_file', cors(),
//   function (req, res) {
//     console.log('download_file request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         if (req.body.filename != '') {
//           fs.readFile(ontology_storage + req.body.filename, 'base64', (err, data) => {
//             //fs.readFile(ontology_storage + req.body.filename, (err, data) => {
//             if (err) {
//               console.error(err);
//               res.send(err.message);
//             }
//             else
//             {
//               //console.log(data);
//               res.send({ res: "success", data: data, jwt: token });
//             }            
//           });
//         }
//         else {
//           res.send({ error: 'Not authorized' });
//         }
//       }
//       else {
//         res.send({ error: 'filename is empty' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
//-----------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------
// router.post('/get_passport_cstp', cors(),
//   function (req, res) {
//     console.log('get_passport_cstp request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT "ID",' +
//           '"ShortTitle",' +
//           '"ArchiveSign",' +
//           '"SecurityLevel",' +
//           '"SecurityID",' +
//           '"Goal",' +
//           '"Type",' +
//           ' to_char("DateInitiation", \'dd.mm.yyyy\') AS "DateInitiation",' +
//           '"Document",' +
//           '"Members",' +
//           'to_char("StartDate", \'dd.mm.yyyy\') AS "StartDate",' +
//           'to_char("EndDate", \'dd.mm.yyyy\') AS "EndDate",' +
//           '"Costs"' +
//           'FROM "MSTG"."VPassportCSTP";';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/get_passport_cstp_by_id', cors(),
//   function (req, res) {
//     console.log('get_passport_cstp_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT "ID",' +
//           '"ShortTitle",' +
//           '"ArchiveSign",' +
//           '"SecurityLevel",' +
//           '"SecurityID",' +
//           '"Goal",' +
//           '"Type",' +
//           ' to_char("DateInitiation", \'dd.mm.yyyy\') AS "DateInitiation",' +
//           '"Document",' +
//           '"Members",' +
//           'to_char("StartDate", \'dd.mm.yyyy\') AS "StartDate",' +
//           'to_char("EndDate", \'dd.mm.yyyy\') AS "EndDate",' +
//           '"Costs"' +
//           'FROM "MSTG"."PassportCSTP"' +
//           ' WHERE "ID" = \'' + req.body.ID + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------  
// router.post('/passport_cstp_activation', cors(),
//   function (req, res) {
//     console.log('passport_cstp_activation request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = "";
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "MSTG"."PassportCSTP"' +
//           ' SET' +
//           ' "ArchiveSign"=' + '\'' + req.body.target_entity.ArchiveSign + '\'' +
//           ' WHERE "ID"=' + '\'' + req.body.target_entity.ID + '\'';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });


//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/vtechnology_passport_get_items_by_parent_id', cors(),
//   function (req, res) {
//     console.log('vvtechnology_passport_get_items_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     var _sql_str = '';
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         if (req.body.entity_all_types) {//all types
//           if (req.body.all_data === true) {
//             _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//               'SELECT * FROM "MSTG"."' +
//               'VTechnologyPassportStructure;';
//           }
//           else {
//             if (req.body.Parent === 0) {
//               _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                 'SELECT * FROM "MSTG"."' +
//                 'VTechnologyPassportStructure' +
//                 '" WHERE "Parent" IS NULL ;';
//             }
//             else {
//               _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                 'SELECT * FROM "MSTG"."' +
//                 'VTechnologyPassportStructure' +
//                 '" WHERE "Parent" = \'' + req.body.Parent + '\';';
//             }
//           }
//         }
//         else {//only structure
//           if (req.body.all_data === true) {
//             _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//               'SELECT * FROM "MSTG"."' +
//               'VTechnologyPassportStructure' +
//               '" WHERE "TypeElement" = \'Structure\';';
//           }
//           else {
//             if (req.body.Parent === 0) {
//               _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                 'SELECT * FROM "MSTG"."' +
//                 'VTechnologyPassportStructure' +
//                 '" WHERE "Parent" IS NULL AND "TypeElement" = \'Structure\';';
//             }
//             else {
//               _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                 'SELECT * FROM "MSTG"."' +
//                 'VTechnologyPassportStructure' +
//                 '" WHERE "Parent" = \'' + req.body.Parent + '\' AND "TypeElement" = \'Structure\';';
//             }
//           }
//         }
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/create_passport_cstp', cors(),
//   function (req, res) {
//     console.log('create_passport_cstp request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'INSERT INTO "MSTG"."PassportCSTP"(' +
//           '"ShortTitle",' +
//           '"ArchiveSign",' +
//           '"SecurityLevel",' +
//           '"Goal",' +
//           '"Type",' +
//           '"DateInitiation",' +
//           '"Document",' +
//           '"Members",' +
//           '"StartDate",' +
//           '"EndDate",' +
//           '"Costs")' +
//           'VALUES (' +
//           '\'' + req.body.passport_cstp.ShortTitle + '\',' +
//           ' \'' + 'false' + '\',' +
//           ' \'' + req.body.passport_cstp.SecurityLevel + '\',' +
//           ' \'' + req.body.passport_cstp.Goal + '\',' +
//           ' \'' + req.body.passport_cstp.Type + '\',' +
//           '  to_date(\'' + req.body.passport_cstp.DateInitiation + '\',\'dd.mm.yyyy\'),' +
//           ' \'' + req.body.passport_cstp.Document + '\',' +
//           ' \'' + req.body.passport_cstp.Members + '\',' +
//           '  to_date(\'' + req.body.passport_cstp.StartDate + '\',\'dd.mm.yyyy\'),' +
//           '  to_date(\'' + req.body.passport_cstp.EndDate + '\',\'dd.mm.yyyy\'),' +
//           ' \'' + req.body.passport_cstp.Costs + '\');';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //----------------------------------------------------------------------------------
// router.post('/get_passport_cstp_by_id', cors(),
//   function (req, res) {
//     console.log('get_passport_cstp_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     var _sql_str = '';
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "MSTG"."' +
//           'PassportCSTP' +
//           '" WHERE "ID"=' + req.body.id + ' ;';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/update_passport_cstp', cors(),
//   function (req, res) {
//     console.log('update_passport_cstp request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "MSTG"."PassportCSTP"' +
//           ' SET ' +
//           ' "ShortTitle"=' + '\'' + req.body.passport.ShortTitle + '\'' +
//           ', "ArchiveSign"=' + req.body.passport.ArchiveSign +
//           ', "SecurityLevel"=' + "'" + req.body.passport.SecurityLevel + "'" +
//           ', "Goal"=' + "'" + req.body.passport.Goal + "'" +
//           ', "Type"=' + "'" + req.body.passport.Type + "'" +
//           ', "DateInitiation"=' + '  to_date(\'' + req.body.passport.DateInitiation + '\',\'dd.mm.yyyy\')' +//"'" + req.body + "'" +
//           ', "Document"=' + "'" + req.body.passport.Document + "'" +
//           ', "Members"=' + "'" + req.body.passport.Members + "'" +
//           ', "StartDate"=' + '  to_date(\'' + req.body.passport.StartDate + '\',\'dd.mm.yyyy\')' + //"'" + req.body + "'" +
//           ', "EndDate"=' + '  to_date(\'' + req.body.passport.EndDate + '\',\'dd.mm.yyyy\')' +//"'" + req.body + "'" +
//           ', "Costs"=' + "'" + req.body.passport.Costs + "'" +
//           ' WHERE "ID"=' + "'" + req.body.passport.ID + "'";
//         //console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
//-----------------------------------------------------------------------------------
// router.post('/create_tech_passport', cors(),
//   function (req, res) {
//     console.log('create_tech_passport request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         if (req.body.passport.TemplateSign) {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'INSERT INTO "MSTG"."TechnologyPassport"(' +
//             '"ShortTitle",' +
//             '"ArchiveSign",' +
//             '"EntityStructure",' +
//             '"SecurityLevel",' +
//             '"Content",' +
//             '"TemplateSign"' +
//             ') VALUES (' +
//             '\'' + req.body.passport.ShortTitle + '\',' +
//             ' \'' + 'false' + '\',' +
//             ' \'' + req.body.passport.EntityStructure + '\',' +
//             ' \'' + req.body.passport.SecurityLevel + '\',' +
//             ' \'' + JSON.stringify(req.body.passport.Content) + '\',' +
//             ' \'' + req.body.passport.TemplateSign + '\'' +
//             ' );';
//         }
//         else {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'INSERT INTO "MSTG"."TechnologyPassport" (' +
//             ' "ShortTitle",' +
//             '"ArchiveSign",' +
//             ' "Content",' +
//             ' "SecurityLevel",' +
//             ' "EntityStructure",' +
//             ' "Template",' +
//             ' "TemplateSign")' +
//             ' VALUES ' +
//             '(\'' + req.body.passport.ShortTitle + '\',' +
//             ' \'' + 'false' + '\',' +
//             ' \'' + JSON.stringify(req.body.passport.Content) + '\',' +
//             ' \'' + req.body.passport.SecurityLevel + '\',' +
//             ' \'' + req.body.passport.EntityStructure + '\',' +
//             ' \'' + req.body.passport.Template + '\',' +
//             ' \'' + req.body.passport.TemplateSign +
//             '\');';
//         }
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------
// router.post('/get_tech_pasport_template_by_id', cors(),
//   function (req, res) {
//     console.log('get_tech_pasport_template_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT *' +
//           ' FROM "MSTG"."TechnologyPassport"' +
//           ' WHERE "TechnologyPassport"."ID" = ' + req.body.id;//+

//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/update_tech_passport', cors(),
//   function (req, res) {
//     console.log('update_tech_passport request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         /*var type = req.body.Type;
//         if (type === 'Structure') {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "MSTG"."EntityStructure"' +
//             'SET ' +
//             ' "ShortTitle"=' + '\'' + req.body.target_entity.data.ShortTitle + '\'' +
//             ', "Description"=' + "'" + req.body.target_entity.data.Description + "'" +
//             ', "SecurityLevel"=' + "'" + req.body.target_entity.security_level.ID + "'" +//security_level
//             ' WHERE "ID"=' + "'" + req.body.target_entity.data.ID + "'";
//         }
//         else {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "MSTG"."TechnologyPassport"' +
//             'SET ' +
//             ' "ShortTitle"=' + '\'' + req.body.passport.ShortTitle + '\'' +
//             ', "Content"=' + "'" + JSON.stringify(req.body.passport.Content) + "'" +
//             ', "SecurityLevel"=' + "'" + req.body.passport.SecurityLevel + "'" +
//             ' WHERE "ID"=' + "'" + req.body.passport.ID + "'";
//         //}*/
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "MSTG"."TechnologyPassport"' +
//           'SET ' +
//           ' "ShortTitle"=' + '\'' + req.body.passport.ShortTitle + '\'' +
//           ', "Content"=' + "'" + JSON.stringify(req.body.passport.Content) + "'" +
//           ', "SecurityLevel"=' + "'" + req.body.passport.SecurityLevel + "'" +
//           ' WHERE "ID"=' + "'" + req.body.passport.ID + "'";

//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }

//   });
// //-----------------------------------------------------------------------------------
// router.post('/tech_passport_activation', cors(),
//   function (req, res) {
//     console.log('tech_passport_activation request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = "";
//         /*let type = req.body.passport.TypeElement;
//         if (type === "Structure") {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "MSTG"."TechnologyPassport"' +
//             ' SET' +
//             ' "ArchiveSign"=' + '\'' + req.body.passport.ArchiveSign + '\'' +
//             ' WHERE "ID"=' + '\'' + req.body.passport.ID + '\'';
//         }
//         else //if(type==="Entity")
//         {
//           _sql_str =
//             'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'UPDATE "Ontologies"."Entities"' +
//             ' SET' +
//             ' "ArchiveSign"=' + '\'' + req.body.passport.ArchiveSign + '\'' +
//             ' WHERE "ID"=' + '\'' + req.body.passport.ID + '\'';
//         }*/
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "MSTG"."TechnologyPassport"' +
//           ' SET' +
//           ' "ArchiveSign"=' + '\'' + req.body.passport.ArchiveSign + '\'' +
//           ' WHERE "ID"=' + '\'' + req.body.passport.ID + '\'';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });


//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------
// router.post('/get_template_tech_passport_by_id', cors(),
//   function (req, res) {
//     console.log('get_template_tech_passport_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT *' +
//           ' FROM "MSTG"."TechnologyPassport"' +
//           //' WHERE "VEntities"."ID" = ' + req.body.id;//+
//           ' WHERE "TechnologyPassport"."ID" = ' + req.body.id;//+
//         //' AND "VEntities"."TemplateSign"';

//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------
// router.post('/get_tech_passport_template_list_by_parent_id', cors(),
//   function (req, res) {
//     console.log('get_tech_passport_template_list_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = '';
//         if (req.body.full_data) {
//           _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'SELECT *' +
//             ' FROM "MSTG"."VTechnologyPassport"' +
//             ' WHERE "VTechnologyPassport"."VEntityStructure" = ' + req.body.parent_id +
//             'AND "VTechnologyPassport"."TemplateSign"';
//         }
//         else {
//           _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//             'SELECT "VTechnologyPassport"."ID", "ShortTitle", "ArchiveSign", "SecurityLevel"' +
//             ' FROM "MSTG"."VTechnologyPassport"' +
//             ' WHERE "VTechnologyPassport"."EntityStructure" = ' + req.body.parent_id +
//             ' AND "VTechnologyPassport"."TemplateSign"';
//         }
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //---
// //get_type_targeted_list
// //-----------------------------------------------------------------------------------
// router.post('/get_type_targeted_list', cors(),
//   function (req, res) {
//     console.log('get_type_targeted_list request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "MSTG"."TypeTargeted";';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/get_targeted_list', cors(),
//   function (req, res) {
//     console.log('get_targeted_list request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "MSTG"."VTargeted" ' +
//           ' WHERE "PassportCSTP"=' + "'" + req.body.parent_id + "'";
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// //  
// //-----------------------------------------------------------------------------------
// router.post('/create_targeted', cors(),
//   function (req, res) {
//     console.log('create_targeted request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'INSERT INTO "MSTG"."Targeted"(' +
//           '"PassportCSTP",' +
//           '"TypeTargeted",' +
//           '"Name",' +
//           '"Volume"' +
//           ') VALUES (' +
//           '\'' + req.body.targeted.PassportCSTP + '\',' +
//           ' \'' + req.body.targeted.TypeTargeted + '\',' +
//           ' \'' + req.body.targeted.Name + '\',' +
//           ' \'' + req.body.targeted.Volume + '\'' +
//           ' );';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/remove_targeted', cors(),
//   function (req, res) {
//     console.log('remove_targeted request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'DELETE FROM "MSTG"."Targeted" WHERE "ID"=\'' + req.body.ID + '\';';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/get_registry_by_parent_id', cors(),
//   function (req, res) {
//     console.log('get_registry_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "MSTG"."VTechnologyCSTP" ' +
//           ' WHERE "PassportCSTP"=' + "'" + req.body.ID + "'";
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/create_registry', cors(),
//   function (req, res) {
//     console.log('create_registry request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         //TODO
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'INSERT INTO "MSTG"."VTechnologyCSTP"(' +
//           '"PassportCSTP",' +
//           '"TypeTargeted",' +
//           '"Name",' +
//           '"Volume"' +
//           ') VALUES (' +
//           '\'' + req.body.targeted.PassportCSTP + '\',' +
//           ' \'' + req.body.targeted.TypeTargeted + '\',' +
//           ' \'' + req.body.targeted.Name + '\',' +
//           ' \'' + req.body.targeted.Volume + '\'' +
//           ' );';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/create_registry_list', cors(),
//   function (req, res) {
//     console.log('create_registry_list request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if ((req.body.user != undefined) && (req.body.passport_list != undefined)) {
//         //TODO
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'INSERT INTO "MSTG"."TechnologyCSTP"(' +
//           '"PassportCSTP",' +
//           '"TechnologyPassport"' +
//           ') VALUES ';
//         for (let i = 0; i < req.body.passport_list.length - 1; i++) {
//           _sql_str += '(\'' + req.body.cstp_id + '\', \'' + req.body.passport_list[i] + '\'),';
//         }
//         _sql_str += '(\'' + req.body.cstp_id + '\', \'' + req.body.passport_list[req.body.passport_list.length - 1] + '\');';
//         //'\'' + req.body.targeted.PassportCSTP + '\',' +
//         //' \'' + req.body.targeted.TypeTargeted + '\',' +
//         //' \'' + req.body.targeted.Name + '\',' +
//         //' \'' + req.body.targeted.Volume + '\'' +
//         //' );';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/remove_registry', cors(),
//   function (req, res) {
//     console.log('remove_registry request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'DELETE FROM "MSTG"."TechnologyCSTP" WHERE "TechnologyPassport"=\'' + req.body.tech_id +
//           '\' AND ' +
//           '"PassportCSTP"=\'' + req.body.cstp_id + '\';';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/vtb_get_csv_list', cors(),
//   function (req, res) {
//     console.log('vtb_get_csv_list request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = '';
//         _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT *' +
//           ' FROM "VTB"."VViewVTB"' +
//           ' WHERE "VViewVTB"."Entities" = \'' + req.body.parent_id + '\'';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/vtb_get_csv_by_id', cors(),
//   function (req, res) {
//     console.log('vtb_get_csv_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     //
//     let _csv_array = [];
//     let _names_array = [];
//     let csv_results = [];
//     //
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = '';
//         _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT *' +
//           ' FROM "VTB"."VViewVTB"' +
//           ' WHERE "VViewVTB"."ID" = \'' + req.body.id + '\'';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/vtb_remove_csv', cors(),
//   function (req, res) {
//     console.log('vtb_remove_csv request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'DELETE FROM "VTB"."ViewVTB" WHERE "ID"=\'' + req.body.id + '\';';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/create_vtb_csv', cors(),
//   function (req, res) {
//     console.log('create_vtb_csv request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'INSERT INTO "VTB"."ViewVTB"(' +
//           '"ShortTitle",' +
//           '"Description",' +
//           '"Entities",' +
//           '"SecurityLevel",' +
//           '"Content"' +
//           ') VALUES (' +
//           '\'' + req.body.item.ShortTitle + '\',' +
//           ' \'' + req.body.item.Description + '\',' +
//           ' \'' + req.body.item.Entities + '\',' +
//           ' \'' + req.body.item.SecurityLevel + '\',' +
//           ' \'' + req.body.item.Content + '\'' +
//           ' );';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/update_vtb_csv', cors(),
//   function (req, res) {
//     console.log('update_vtb_csv request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "VTB"."ViewVTB"' +
//           'SET ' +
//           ' "ShortTitle"=' + '\'' + req.body.item.ShortTitle + '\'' +
//           ', "Description"=' + "'" + req.body.item.Description + "'" +
//           ', "Content"=' + "'" + req.body.item.Content + "'" +
//           ', "SecurityLevel"=' + "'" + req.body.item.SecurityLevel + "'" +
//           ' WHERE "ID"=' + "'" + req.body.item.ID + "'";

//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //------------------------------------------------------------------------
// router.post('/csv_vtb_modal_form', cors(),
//   function (req, res) {
//     console.log('csv_vtb_modal_form request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var entity_data;
//         var security_data;
//         var _sql_str_entity = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "VTB"."ViewVTB' +
//           '" WHERE "ID" = \'' + req.body.ID + '\';';
//         //
//         var _sql_str_security_levels = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "Security"."VSecurityLevel"';
//         //request entity
//         console.log(_sql_str_entity);
//         pdb.any(_sql_str_entity)
//           .then(data => {
//             entity_data = data[0];
//             //request security levels
//             pdb.any(_sql_str_security_levels)
//               .then(data => {
//                 security_data = data;
//                 res.send({ entity_data: entity_data, security_data: security_data, jwt: token });
//               })
//               .catch(error => {
//                 console.log(error);
//                 res.send(error);
//               });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//---

//-----------------------------------------------------------------------------------
// router.post('/red_key_get_vproject_list', cors(),
//   function (req, res) {
//     console.log('red_key_get_vproject_list request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "RedKey"."VProject";';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/red_key_get_project_by_id', cors(),
//   function (req, res) {
//     console.log('red_key_get_project_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "RedKey"."Project"' +
//           ' WHERE "ID" = \'' + req.body.ID + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/red_key_activation_project', cors(),
//   function (req, res) {
//     console.log('red_key_activation_project request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = "";
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "RedKey"."Project" ' +
//           ' SET' +
//           ' "ArchiveSign"=' + '\'' + req.body.project.ArchiveSign + '\'' +
//           ' WHERE "ID"=' + '\'' + req.body.project.ID + '\'';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });


//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/redkey_update_project', cors(),
//   function (req, res) {
//     console.log('redkey_update_project request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "RedKey"."Project"' +
//           'SET ' +
//           ' "ShortTitle"=' + '\'' + req.body.item.ShortTitle + '\'' +
//           ', "Description"=' + "'" + req.body.item.Description + "'" +
//           ', "SecurityLevel"=' + "'" + req.body.item.SecurityLevel + "'" +
//           ' WHERE "ID"=' + "'" + req.body.item.ID + "'";
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });

// //-----------------------------------------------------------------------------------
// router.post('/redkey_get_calculations_by_parent_id', cors(),
//   function (req, res) {
//     console.log('redkey_get_calculations_by_parent_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "RedKey"."VCalculation"' +
//           ' WHERE "Project" = \'' + req.body.ID + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------
// router.post('/redkey_get_calculations_by_id', cors(),
//   function (req, res) {
//     console.log('redkey_get_calculations_by_id request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "RedKey"."VCalculation"' +
//           ' WHERE "ID" = \'' + req.body.ID + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------
// router.post('/redkey_get_modules_list', cors(),
//   function (req, res) {
//     console.log('redkey_get_modules_list request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str = '';
//         _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "RedKey"."VModule";';
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ data: data, jwt: token });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
// //-----------------------------------------------------------------------------------
// router.post('/redkey_update_project', cors(),
//   function (req, res) {
//     console.log('redkey_update_project request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "RedKey"."Project"' +
//           'SET ' +
//           ' "ShortTitle"=' + '\'' + req.body.item.ShortTitle + '\'' +
//           ', "Description"=' + "'" + req.body.item.Description + "'" +
//           ', "InOutFile"=' + "'" + req.body.item.InOutFile + "'" +
//           ' WHERE "ID"=' + "'" + req.body.item.ID + "'";
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/redkey_create_calculation', cors(),
//   function (req, res) {
//     console.log('redkey_create_calculation request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'INSERT INTO "RedKey"."Calculation"(' +
//           '"ShortTitle",' +
//           '"Description",' +
//           '"Project",' +
//           '"Module",' +
//           '"InOutFile",' +
//           '"Status",' +
//           '"Path"' +
//           ') VALUES (' +
//           '\'' + req.body.item.ShortTitle + '\',' +
//           ' \'' + req.body.item.Description + '\',' +
//           ' \'' + req.body.item.Project + '\',' +
//           ' \'' + req.body.item.Module + '\',' +
//           ' \'' + req.body.item.InOutFile + '\',' +
//           ' \'' + req.body.item.Status + '\',' +
//           ' \'' + req.body.item.Path + '\'' +
//           ' );';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/redkey_remove_calculation', cors(),
//   function (req, res) {
//     console.log('redkey_remove_calculation request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'DELETE FROM "RedKey"."Calculation" WHERE "ID"=\'' + req.body.ID + '\';';
//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// //
// //-----------------------------------------------------------------------------------
// router.post('/redkey_update_calculation', cors(),
//   function (req, res) {
//     console.log('redkey_update_calculation request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       var _sql_str = '';
//       if (req.body.user != undefined) {
//         _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'UPDATE "RedKey"."Calculation"' +
//           'SET ' +
//           ' "ShortTitle"=' + '\'' + req.body.item.ShortTitle + '\'' +
//           ', "Description"=' + "'" + req.body.item.Description + "'" +
//           ', "Status"=' + "'" + req.body.item.Status + "'" +
//           ', "InOutFile"=' + "'" + req.body.item.InOutFile + "'" +
//           ' WHERE "ID"=' + "'" + req.body.item.ID + "'";
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //-----------------------------------------------------------------------------------
// router.post('/redkey_create_project', cors(),
//   function (req, res) {
//     console.log('redkey_create_project request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         var _sql_str =
//           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'INSERT INTO "RedKey"."Project" (' +
//           '"ShortTitle", "Description", "SecurityLevel")' +
//           ' VALUES ' +
//           '(\'' + req.body.item.data.ShortTitle + '\',' +
//           ' \'' + req.body.item.data.Description + '\',' +
//           ' \'' + req.body.item.security_level.ID + '\');';

//         console.log(_sql_str);
//         pdb.any(_sql_str)
//           .then(data => {
//             res.send({ res: 'success' });
//           })
//           .catch(error => {
//             console.log(error.message);
//             res.send({ res: error.message });
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//   });
// //---------------------------------------------------------------------------------
// router.post('/redkey_launch_calc', cors(),
//   function (req, res) {
//     console.log('redkey_launch_calc request');
//     let token;
//     let token_check_result = IsValidToken(req.body.jwt);
//     let _calculation = {};
//     let _module = {};
//     let _tmp_path = '';
//     if (token_check_result.jwt) {
//       token = makeToken(req.body.user.ID);
//       if (req.body.user != undefined) {
//         //get calc data
//         var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//           'SELECT * FROM "RedKey"."Calculation"' +
//           ' WHERE "ID" = \'' + req.body.ID + '\';';
//         pdb.any(_sql_str)
//           .then(data => {
//             _calculation = data[0];
//             //get module data
//             var _sql_str = 'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//               'SELECT * FROM "RedKey"."Module"' +
//               ' WHERE "ID" = \'' + _calculation.Module + '\';';
//             pdb.any(_sql_str)
//               .then(data => {
//                 _module = data[0];
//                 _tmp_path = redkey_homepath + make_temp_path(10);
//                 fs.mkdir(_tmp_path, err => {
//                   if (err) {
//                     res.send('error create file: ' + err);
//                   }
//                   else {
//                     _calculation.Path = _tmp_path;
//                     fs.writeFile(_tmp_path + '/InFile.csv', _calculation.InOutFile, result => {
//                       //TODO update calculation, launch
//                       //1 replace InFile.csv name
//                       let _cmd = _module.CommandLine.replace('InFile.csv', _tmp_path + '/InFile.csv');
//                       _cmd = _cmd.replace('OutFile.csv', _tmp_path + '/OutFile.csv');
//                       //2 replace OutFile.csv
//                       console.log('cmd line:' + _cmd);
//                       //3 run CommandLine
//                       exec(_cmd, (error, stdout, stderr) => {
//                         if (error) {
//                           console.log(`error: ${error.message}`);
//                           res.send({ data: "error", jwt: token });
//                         }
//                         if (stderr) {
//                           console.log(`stderr: ${stderr}`);
//                           res.send({ data: "error", jwt: token });
//                           return;
//                         }
//                         console.log(`stdout: ${stdout}`);
//                         _calculation.InOutFile = fs.readFileSync(_tmp_path + '/OutFile.csv');
//                         _calculation.Status = "Готово";
//                         _calculation.Path = "";
//                         _sql_str =
//                           'SET SESSION my.vars.CurrentSID = \'' + req.body.user.SecurityID + '\';' +
//                           'UPDATE "RedKey"."Calculation"' +
//                           'SET ' +
//                           ' "InOutFile"=' + "'" + _calculation.InOutFile + "'" +
//                           ', "Status"=' + "'" + _calculation.Status + "'" +
//                           ', "Path"=' + "'" + _calculation.Path + "'" +
//                           ' WHERE "ID"=' + "'" + _calculation.ID + "'";
//                         rimraf.sync(_tmp_path);
//                         console.log(_sql_str);
//                         pdb.any(_sql_str)
//                           .then(data => {
//                             res.send({ data: "success", jwt: token });
//                           })
//                           .catch(error => {
//                             console.log(error.message);
//                             res.send({ res: error.message });
//                           });
//                         //                        
//                       });
//                       //4 Status=busy
//                       //console.log('file writed');
//                     });
//                   }
//                 });
//               })
//               .catch(error => {
//                 console.log(error);
//                 res.send(error);
//               });
//           })
//           .catch(error => {
//             console.log(error);
//             res.send(error);
//           });
//       }
//       else {
//         res.send({ error: 'Not authorized' });
//       }
//     }
//     else {
//       res.send({ error: 'Token not valid. Not authorized' });
//     }
//     //-------------------------------------
//   });
//-----------------------------------------------------------------------------------
// function make_temp_path(length) {
//   let result = '';
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength = characters.length;
//   let counter = 0;
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     counter += 1;
//   }
//   return result;
// }

//-----------------------------------------------------------------------------------

router.post('/upload_file', cors(), upload.any(),
  function (req, res) {
    console.log('upload_file request');
    //TODO Security refactoring!!!
    //let token;
    //let token_check_result = IsValidToken(req.body.jwt);
    //if (token_check_result.jwt) {
    //token = makeToken(req.body.user.ID);
    fs.copyFile(req.files[0].path, ontology_storage + req.files[0].filename, fs.constants.COPYFILE_EXCL, fr => {
      console.log(fr);
      res.send({ data: req.files[0].filename });
    });
    //  
    //var writeStream = fs.createWriteStream(ontology_storage+'/'+req.files[0].originalname);
    //      writeStream.write(req.files[0]);
    //writeStream.end();
    //
    //}
    //ontology_storage
    //    res.send({ data: 'success' });
  });


//----clowzed start---

// router.get("/security_levels", async(req, res) => {

//   let query = 'SELECT "ID", "ShortTitle" FROM "Security"."VSecurityLevel";';

//   pdb
//       .query(query)
//       .then((data) => res.status(200).json(data))
//       .catch((error) => res.status(500).send(error.toString()));
// });

// router.get("/entity_structures", async(req, res) => {
//   await pdb.query(set_session_id);

//   let query = `
//         SELECT "ID", "Parent", "ShortTitle"
//         FROM "Ontologies".
//         "VEntityStructure"
//         WHERE "TypeElement" = 'Structure'
//         `;

//   pdb
//       .query(query)
//       .then((data) => res.status(200).json(data))
//       .catch((error) => res.status(500).send(error.toString()));
// });

// router.get("/stands/:id", async(req, res) => {

//   if (req.params.id === undefined) {
//       return res.status(422).send("Entity id missing");
//   }
//   await pdb.query(set_session_id);


//   let query = `
//         SELECT * FROM "Ontologies".
//         "VEntities"
//         WHERE "EntityStructure" = $1 AND NOT "TemplateSign";
//         `;

//   let query2 = `SELECT * FROM "Booking"."VStage"`;

//   pdb
//       .query(query, [req.params.id])
//       .then((data) => res.status(200).json(data))
//       .catch((error) => res.status(500).send(error.toString()));
// });

// router.post("/gant", j, async(req, res) => {
//   let values = [Number(req.body.ID)];
//   console.log(values);
//   await pdb.query(set_session_id);

//   let query = `SELECT
//   "Potential"."Entities_ID",
//   "Potential"."Entities",
//   "Potential"."StartDate",
//   "Potential"."EndDate"
//   FROM "Booking"."VStage" AS "Potential"
//   WHERE "EntityStructure_ID" = $1
//     `;


//   pdb
//       .query(query, values)
//       .then((data) => {
//           data.map((s) => new Date(s.StartDate)).forEach((d) => console.log(d.toDateString()));
//           data.map((s) => new Date(s.EndDate)).forEach((d) => console.log(d.toDateString()));
//           console.log(data);
//           res.status(200).json(data);
//       })
//       .catch((error) => {
//           res.status(500).send(error.toString())
//       });
// });

//----clowzed end-----


module.exports = router;