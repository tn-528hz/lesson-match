const Message = require("../models/message");

//チャットコントローラーの内容をエクスポート
module.exports = io => {
    //新しいユーザーの接続を監視
    io.on("connection", client => {
        Message.find({})
            .sort({
                createdAt: -1
            })
            //最も新しい10個のメッセージを問い合わせる
            .limit(10)
            .then(messages => {
                //10個のメッセージとともに、カスタムイベントを、新しいソケットだけに送出
                client.emit("load all messages", messages.reverse());
            });
            
        console.log("接続しました");

        //そのユーザーの接続断を監視
        client.on("disconnect", () => {
            console.log("接続が断たれました");
        });

        //カスタムのメッセージイベントを監視
        client.on("message", data => {
            let messageAttributes = {
                content: data.content,
                userName: data.userName,
                user: data.userId
            },
            //新しいメッセージオブジェクトを、messageAttributesで作る
            m = new Message(messageAttributes);
            m.save()
                .then(() => {
                    io.emit("message", messageAttributes);
                })
                .catch(error => console.log(`error: ${error.message}`));
        });
    });
};