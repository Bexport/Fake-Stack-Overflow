const router = require("express").Router();
const quest = require("../models/questions");

router.route("/").get((req, res) => {
    quest.find()
        .then((questions) => res.json(questions))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/add").post((req, res) => {
    const q = new quest(req.body);
    q.save()
        .then(() => res.json("new question added"))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/:id").get((req, res) => {
    quest.findById(req.params.id)
        .then((question) => res.json(question))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/update/:id").put((req, res) => {
    quest.updateOne(
        { _id: req.params.id }, 
        { $set: req.body })
        .then(() => {
            res.json("update question CHECK");
        })
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/delete/:id").delete((req, res) => {
    quest.findByIdAndDelete(req.params.id)
        .then(() => res.json("question delete CHECK"))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/deleteByUser").delete((req, res) => {
    const askedById = req.query.asked_by_id;
  
    // Use findOneAndDelete to find a document based on the query and delete it
    quest.findOneAndDelete({ asked_by_id: askedById })
      .then((deletedQuestion) => {
        if (deletedQuestion) {
          res.json(`Question with asked_by_id ${askedById} deleted successfully`);
        } else {
          res.json(`No question found with asked_by_id ${askedById}`);
        }
      })
      .catch((err) => res.status(400).json("ERROR: " + err));
  });
  

module.exports = router;