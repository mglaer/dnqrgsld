var express = require('express');
const { pdb } = require('../lib/postgress');
const cors = require('cors');
const j = express.json();



const stages_router = express.Router();


const set_session_id = "SET SESSION my.vars.CurrentSID = '71';";

//! Setting session id
stages_router.use(async(_, __, next) => {
    await pdb.query(set_session_id);
    next();
});



stages_router.get("/:project_id", (req, res) => {
    if (req.params.project_id === undefined) {
        return res.status(422).send("Project id missing");
    }

    let query =
        'SELECT "ID", "ShortTitle", "StartDate", "EndDate", "EntityStructure", "Entities" FROM "Booking"."VStage" WHERE "Project" = $1';
    pdb
        .query(query, [req.params.project_id])
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error.toString()));
});

stages_router.delete("/", j, (req, res) => {
    let values = [req.body.ID];
    if (req.body.ID === undefined) {
        return res.status(422).send("ID missing");
    }
    let query = `DELETE FROM "Booking"."Stage" WHERE "ID" = $1`;
    pdb
        .query(query, values)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error.toString()));
});

stages_router.put("/", j, (req, res) => {
    let values = [
        req.body.ShortTitle,
        req.body.ProjectId,
        req.body.StartDate,
        req.body.EndDate,
        req.body.EntityStructureID,
        req.body.EntityID,
    ];

    let query = `INSERT INTO "Booking"."Stage"("ShortTitle", "Project", "StartDate", "EndDate", "EntityStructure", "Entities") VALUES ($1, $2, $3, $4, $5, $6)`;

    pdb
        .query(query, values)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error.toString()));
});

stages_router.patch("/:ID", j, (req, res) => {
    let values = [
        req.body.ShortTitle,
        req.body.ProjectId,
        req.body.StartDate,
        req.body.EndDate,
        req.body.EntityStructureID,
        req.body.EntityID,
        req.params.ID,
    ];

    let query = `UPDATE "Booking"."Stage" set "ShortTitle" = $1, "Project" = $2, "StartDate" = $3, "EndDate" = $4, "EntityStructure" = $5, "Entities" = $6 where "ID" = $7`;
    pdb
        .query(query, values)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).send(error.toString()));
});

module.exports = stages_router;