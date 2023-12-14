const router = require("express").Router();
const comment = require("../models/comments");

router.route("/").get((req, res) => {
    comment.find()
        .then((comment) => res.json(comment))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/add").post((req, res) => {
    const c = new comment(req.body);
    c.save()
        .then(() => res.json("new comment added CHECK"))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/update/:id").put((req, res) => {
  console.log(req.body);
  comment.updateOne(
      { _id: req.params.id }, 
      { $set: req.body })
      .then(() => {
          //res.json(res.data);
          res.json("update comment CHECK");
      })
      .catch((err) => res.status(400).json("ERROR: " + err));
});
  
module.exports = router;