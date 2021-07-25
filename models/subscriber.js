//mongooseのロード
const mongoose = require("mongoose"),
    {Schema} = mongoose;

    subscriberSchema = new mongoose.Schema({
        //スキーマにプロパティを追加
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        //複数のコースを関連づける
        courses: [{type: Schema.Types.ObjectId, ref: "Course"}]
    }, {
        timestamps: true
    });

    //インスタンスメソッドのgetInfoを追加
    subscriberSchema.methods.getInfo = function () {
        return `Name: ${this.name} Email: ${this.email}`;
    };

    //Subscriberモデルをエクスポート
    module.exports = mongoose.model("Subscriber", subscriberSchema);