const Subscriber = require("../models/subscriber");
    //カスタム関数を作って、リクエストから購読者のデータを取り出す
    getSubscriberParams = (body) => {
        return {
            name: body.name,
            email: body.email,
        };
    };

module.exports = {
    //すべての購読者ドキュメントを探し出すindexアクション
    index: (req, res, next) => {
        Subscriber.find()
            .then(subscribers => {
                res.locals.subscribers = subscribers;
                next();
            })
            .catch(error => {
                console.log(`エラーです: ${error.message}`);
                next();
            });
    },
    indexView: (req, res) => {
        res.render("subscribers/index");
    },
    new: (req, res) => {
        res.render("subscribers/new");
    },

    //新しい購読者を作るcreateアクション
    create: (req, res, next) => {
        let Subscriberparams = getSubscriberParams(req.body);
        Subscriber.create(subscriberParams)
            .then(subscriber => {
                res.locals.redirect = "/subscribers";
                res.locals.subscriber = subscriber;
                next();
            })
            .catch(error => {
                console.log(`エラー: ${error.message}`);
                next(error);
            });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },

    //購読者のデータを表示するshowアクション
    show: (req, res, next) => {
        var subscriberId = req.params.id;
        Subscriber.findById(subscriberId)
            .then(subscriber => {
                res.locals.subscriber = subscriber;
                next();
            })
            .catch(error => {
                console.log(`エラーです: ${error.message}`)
                next(error);
            });
    },

    showView: (req, res) => {
        res.render("subscribers/show");
    },

    //購読者データの編集をおこなうeditアクション
    edit: (req, res, next) => {
        var subscriberId = req.params.id;
        Subscriber.findById(subscriberId)
            .then(subscriber => {
                res.render("subscribers/edit", {
                    subscriber: subscriber
                });
            })
            .catch(error => {
                console.log(`エラーです: ${error.message}`);
                next(error);
            });
    },

    //既存の購読者ドキュメントに新しい値をセットするupdateアクション
    update: (req, res, next) => {
        let subscriberId = req.params.id,
            subscriberParams = getSubscriberParams(req.body);

        Subscriber.findByIdAndUpdate(subscriberId, {
            $set: subscriberParams
        })
        .then(subscriber => {
            res.locals.redirect = `/subscribers/${subscribersid}`;
            res.locals.subscriber = subscriber;
            next();
        })
        .catch(error => {
            console.log(`エラーです: ${error.message}`);
            next(error);
        });
    },

    //購読者のドキュメントを削除deleteアクション
    delete: (req, res, next) => {
        let subscriberid = req.params.id;
        Subscriber.findByIdRemove(subscriberId)
            .then(() => {
                res.locals.redirect = "/subscribers";
                next();
            })
            .catch(error => {
                console.log(`エラーです: ${error.message}`);
                next();
            });
    }
};