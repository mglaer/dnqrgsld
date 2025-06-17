var express = require('express');
const cors = require('cors');

const { pdb } = require('../lib/postgress');
const j = express.json();


const project_router = express.Router();

const set_session_id = "SET SESSION my.vars.CurrentSID = '71';";

//! Setting session id
project_router.use(async(_, __, next) => {
    await pdb.query(set_session_id);
    next();
});


project_router.get("/security_levels", async(req, res) => {

    let query = 'SELECT "ID", "ShortTitle" FROM "Security"."VSecurityLevel";';
  
    pdb
        .query(query)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error.toString()));
  });
  
  project_router.get("/entity_structures", async(req, res) => {
    await pdb.query(set_session_id);
  
    let query = `
          SELECT "ID", "Parent", "ShortTitle"
          FROM "Ontologies".
          "VEntityStructure"
          WHERE "TypeElement" = 'Structure'
          `;
  
    pdb
        .query(query)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error.toString()));
  });
  
  project_router.get("/stands/:id", async(req, res) => {
  
    if (req.params.id === undefined) {
        return res.status(422).send("Entity id missing");
    }
    await pdb.query(set_session_id);
  
  
    let query = `
          SELECT * FROM "Ontologies".
          "VEntities"
          WHERE "EntityStructure" = $1 AND NOT "TemplateSign";
          `;
  
    let query2 = `SELECT * FROM "Booking"."VStage"`;
  
    pdb
        .query(query, [req.params.id])
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error.toString()));
  });
  
  project_router.post("/gant", j, async(req, res) => {
    let values = [Number(req.body.ID)];
    console.log(values);
    await pdb.query(set_session_id);
  
    let query = `SELECT
    "Potential"."Entities_ID",
    "Potential"."Entities",
    "Potential"."StartDate",
    "Potential"."EndDate"
    FROM "Booking"."VStage" AS "Potential"
    WHERE "EntityStructure_ID" = $1
      `;
  
  
    pdb
        .query(query, values)
        .then((data) => {
            data.map((s) => new Date(s.StartDate)).forEach((d) => console.log(d.toDateString()));
            data.map((s) => new Date(s.EndDate)).forEach((d) => console.log(d.toDateString()));
            console.log(data);
            res.status(200).json(data);
        })
        .catch((error) => {
            res.status(500).send(error.toString())
        });
  });


project_router.get("/", j, (req, res) => {
    let query =
        'SELECT "ID", "ShortTitle", "Description", "StartDate", "EndDate", "Customer", "Executor", "SecurityLevel", "ArchiveSign" FROM "Booking"."VProject"';
    pdb
        .query(query)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => { res.status(500).send(error); throw error; });
});

project_router.post("/", j, (req, res) => {
    let values = [
        req.body.ShortTitle,
        req.body.Description,
        req.body.StartDate,
        req.body.EndDate,
        req.body.Customer,
        req.body.Executor,
        req.body.SecurityLevelID,
    ];
    let query = `INSERT INTO "Booking"."Project"("ShortTitle", "Description", "StartDate", "EndDate", "Customer", "Executor", "SecurityLevel") VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    pdb
        .query(query, values)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error));
});

project_router.patch("/", j, (req, res) => {
    let values = [
        req.body.ShortTitle,
        req.body.Description,
        req.body.StartDate,
        req.body.EndDate,
        req.body.Customer,
        req.body.Executor,
        req.body.SecurityLevelID,
        req.body.ID,
    ];
    let query = `UPDATE "Booking"."Project" set "ShortTitle" = $1, "Description" = $2, "StartDate" = $3, "EndDate" = $4, "Customer" = $5, "Executor" = $6, "SecurityLevel" = $7 where "ID" = $8;`;
    pdb
        .query(query, values)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error));
});

project_router.patch("/reverse_archivation", j, (req, res) => {
    let values = [req.body.ID];
    let query = `UPDATE "Booking"."Project" set "ArchiveSign" = not "ArchiveSign" where "ID" = $1;`;
    pdb
        .query(query, values)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error));
});

module.exports = project_router;


