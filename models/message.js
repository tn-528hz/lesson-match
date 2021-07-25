const mongoose = require("mongoose"),
    { Schema } = require("mongoose");

const messageSchema = new Schema({
    //各メッセージに内容が必要
    content: {
        type: String,
        required: true
    },
    //各メッセージにユーザー名が必要
    userName: {
        type: String,
        required: true
    },
    user: {
        //各メッセージにユーザーIDが必要
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    //各メッセージにタイムスタンプを保存
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);