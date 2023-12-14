const router = require("express").Router();
const tag = require("../models/tags");

router.route("/").get((req, res) => {
    tag.find()
        .then((tags) => res.json(tags))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/add").post((req, res) => {
    const t = new tag(req.body);
    t.save()
        .then(() => res.json("tag add CHECK"))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/update/:id").put((req, res) => {
    tag.updateOne(
        { _id: req.params.id }, 
        { $set: req.body })
        .then(() => {
            res.json("update tag CHECK");
        })
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/delete/:id").delete((req, res) => {
    tag.findByIdAndDelete(req.params.id)
        .then(() => res.json("tag delete CHECK"))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

module.exports = router;