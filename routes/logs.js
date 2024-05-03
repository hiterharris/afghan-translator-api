const router = require("express").Router();
const logger = require("../logger");
const db = require('../data/db-config');

router.get("/", async (req, res) => {
    const logs = await db.find();
    res.status(200).json(logs);
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const log = await db.remove(id);
    res.status(200).json({ message: 'Removed log: ', id });
});

module.exports = router;
