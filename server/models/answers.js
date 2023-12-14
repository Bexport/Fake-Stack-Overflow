// Answer Document Schema
const mong = require("mongoose");
const { Schema } = mong;
const commentSchema = require("./comments")

const ansSchema = new Schema({
    text: {
        type: String, 
        required: true,
    },
    ans_by: {
        type: String, 
        default: "Anonymous", 
        required: true,
    },
    ans_by_id:{
        type: mong.Schema.Types.ObjectId,
        ref: "User",
    },
    ans_date_time: {
        type: Date, 
        default: () => new Date(),
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    comments:{
        type:[commentSchema.schema],
        default:[],
    },
});
ansSchema.virtual("url").get(() => "posts/answer/_id");
const a = mong.model("Answer", ansSchema);
module.exports = a;