const mong = require("mongoose");
const { Schema } = mong;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    comment_by: {
        type: String,
        default: "Anonymous",
    },
    comment_by_id:{
        type: mong.Schema.Types.ObjectId,
        ref: "User",
    },
    comment_date_time: {
        type: Date,
        default: () => new Date(),
    },
    upvotes: {
        type: Number,
        default: 0,
    },
});
commentSchema.virtual("url").get(() => "posts/comment/_id")
const c = mong.model("Comment", commentSchema);
module.exports = c;