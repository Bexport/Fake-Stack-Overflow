// Tag Document Schema
const mong = require("mongoose");
const { Schema } = mong;
const userSchema = require("./users");

const tagSchema = new Schema({
    name: {
        type: String, required: true,
    },
    asked_by_id:{
        type: mong.Schema.Types.ObjectId,
        ref: "User",
    },
});
tagSchema.virtual("url").get(() => "posts/tag/_id");
const t = mong.model("Tag",tagSchema);
module.exports = t;