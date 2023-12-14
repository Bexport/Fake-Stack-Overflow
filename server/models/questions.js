// Question Document Schema
const mong = require("mongoose");
const { Schema } = mong;
const ansSchema = require("./answers");
const tagSchema = require("./tags");
const commentSchema = require("./comments");
const userSchema = require("./users");

const questSchema = new Schema({
    title: {
        type: String, 
        required: true,
    },
    text: {
        type: String, 
        required: true,
    },
    tags: {
        type: [tagSchema.schema], 
        required: true,
    },
    answers: {
        type: [ansSchema.schema],
    },
    asked_by: {
        type: String || userSchema.schema, 
        default: "Anonymous",
    },
    asked_by_id:{
        type: mong.Schema.Types.ObjectId,
        ref: "User",
    },
    ask_date_time: {
        type: Date, 
        default: () => new Date(),
    },
    views: {
        type: Number, 
        default: 0,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: [commentSchema.schema],
        default: [],
    },
});
questSchema.virtual("url").get(() => "posts/question/_id");
const q = mong.model("Question", questSchema);
module.exports = q;