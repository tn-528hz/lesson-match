const mongoose = require("mongoose"), 
    { Schema } = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Subscriber = require("./subscriber");

    userSchema = new Schema({
        name: {
            first: {
                type: String,
                trim: true
            },
            last: {
                type: String,
                trim: true
            }
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        //ユーザーは複数のコースに関連づける
        courses: [{
            type: Schema.Types.ObjectId,
            ref: "Course"
        }],
        //ユーザーと購読者の関連づけ
        subscribedAccount: {
            type: Schema.Types.ObjectId,
            ref: "Subscriber"
        }
    }, {
        //タイムスタンプのプロパティを追加
        timestamps: true
    });

    //仮想属性のfullNameを追加
    userSchema.virtual("fullName").get(function() {
        return `${this.name.first} ${this.name.last}`;
    })

    //購読者にリンクするpre(`save`)フックを追加
    userSchema.pre("save", function (next) {
        let user = this;
        //subscribedAccountへのリンクをチェック
        if (user.subscribedAccount === undefined) {
            //このユーザーのメールアドレスを含むドキュメントを購読者モデルで探す
            Subscriber.findOne({
                email: user.email
            })
                .then(subscriber => {
                    user.subscribedAccount = subscriber;
                    //次のミドルウェア関数へ
                    next();
                })
                //エラー処理
                .catch(error => {
                    console.log(`Error in connecting subscriber: ${error.message}`);
                next(error);
                });
        } else {
            next();
        }
    });

    //passport-local-mongooseモジュールをユーザースキーマのプラグインとして追加
    userSchema.plugin(passportLocalMongoose, {
        usernameField: "email"
    });

module.exports = mongoose.model("User", userSchema);

