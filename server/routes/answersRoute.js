const router = require("express").Router();
const ans = require("../models/answers");
const quest = require("../models/questions");

router.route("/").get((req, res) => {
    ans.find().then((answers) => res.json(answers))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/add").post((req, res) => {
    const a = new ans(req.body);
    // a.save().then(() => res.json("new answer added CHECK"))
    //     .catch((err) => res.status(400).json("ERROR: " + err));
    a.save().then(()=>res.json('new answer added'))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/delete/:id").delete((req, res) => {
    //console.log("Deleting answer", req.params.id)
    ans.findByIdAndDelete(req.params.id)
        .then(() => res.json("answer delete CHECK"))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/update/:id").put((req, res) => {
    console.log(req.body);
    ans.updateOne(
        { _id: req.params.id },
        { $set: req.body })
        .then(() => {
            res.json("answer updated CHECK");
        })
        .catch((err) => res.status(400).json("ERROR: " + err));
});

module.exports = router;