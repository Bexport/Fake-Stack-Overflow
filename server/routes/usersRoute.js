const router = require("express").Router();
const bcrypt = require("bcrypt");
const user = require("../models/users");
const quest = require("../models/questions");
const tagModel = require("../models/tags");
const ansModel = require("../models/answers");

router.route("/").get((req, res) => {
    user.find()
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/registerUser").post((req, res) => {
    const newUser = new user(req.body);
    newUser.save()
    .then(() => res.json(newUser))
    .catch((err) => res.json({}));
});

router.route("/delUser/:id").delete((req, res) => {
    user.findByIdAndDelete(req.params.id)
        .then(() => res.json("user deleted CHECK"))
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/login").post(async (req, res) => {
    const { email, password } = new user(req.body);
    const u = await user.findOne({ email });

    console.log(u);
    if (u) {
        bcrypt.compare(password, u.password, (err, result) => {
            if (err) {
                res.status(400).json("ERROR: " + err);
            } else if (result) {
                req.session.u = { 
                    id: u._id, 
                    email: u.email 
                };
                res.json(u);
            } else {
                res.json(undefined);
            }
        });
    } else {
        res.status(400).json("ERROR: Email doesn't exist");
    }
});

router.route("/logout").get((req, res) =>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send('Error logging out');
        }
    })
});

router.route("/update/:id").put((req, res) => {
    user.updateOne(
        { _id: req.params.id }, 
        { $set: req.body })
        .then(() => {
            res.json("user update CHECK");
            next();
        })
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/userUsername/:id").get((req, res) => {
    user.find({ _id: req.params.id })
        .then((u) => {
            u.forEach((name) => {
                res.json(name.username);
            });
        })
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/userQuestions/:id").get((req, res) => {
    console.log(req.params.id);
    let userQuest = [];
    quest.find()
        .then((q) => {
            for (let i = 0; i < q.length; i++) {
                if (q[i].asked_by_id == req.params.id) {
                    userQuest.push(q[i]);
                }
            }
            res.json(userQuest);
        })
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/userAnswers/:id").get((req, res) => {
    console.log(req.params.id);
    let userA = [];
    ansModel.find()
        .then((a) => {
            for (let i = 0; i < a.length; i++) {
                if (a[i].ans_by_id == req.params.id) {
                    userA.push(a[i]);
                }
            }
            res.json(userA);
        })
        .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/userTags/:id").get((req, res) => {
    console.log(req.params.id);
    let userT = [];
    tagModel.find()
        .then((t) => {
            for (let i = 0; i < t.length; i++) {
                if (t[i].asked_by_id == req.params.id) {
                    userT.push(t[i]);
                }
            }
            res.json(userT);
        })
        .catch((err) => res.status(400).json("ERROR: " + err));
});




module.exports = router;