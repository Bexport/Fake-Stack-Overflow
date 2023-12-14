const mong = require("mongoose");
const { Schema } = mong;
const bcrypt = require("bcrypt");

const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    reputation: {
        type: Number,
        default: 0,
    },
    account_created_date_time: {
        type: Date,
        default: () => new Date(),
    },
    admin: {
        type: Boolean,
        default: false,
    },
});

usersSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

usersSchema.virtual("url").get(() => "posts/user/_id");
const u = mong.model("User", usersSchema);
module.exports = u;