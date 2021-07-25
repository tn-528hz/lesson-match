const User = require("../models/user"),
  passport = require("passport"),
  getUserParams = body => {
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password,
    };
  };

module.exports = {
    index: (req, res, next) => {
        //インデックスアクション内でクエリを実行
        User.find()
            .then(users => {
                //ユーザーデータをレスポンスに格納し、次のミドルウェア関数を呼び出す
                res.locals.users = users;
                    next();
            })
            .catch(error => {
                //エラーをキャッチしたら次のミドルウェア関数に渡す
                console.log(`エラーです: ${error.message}`);
                next(error);
            });
    },
    //別のアクションでビューのレンダリングをおこなう
    indexView: (req, res) => {
        res.render("users/index");
    },

    //フォームをレンダリングするnewアクションを追加
    new: (req, res) => {
        res.render("users/new");
    },
    //ユーザーをデータベースに保存するcreateアクションを追加
    create: (req, res, next) => {
        if (req.skip) next();
        let newUser = new User(getUserParams(req.body));

        //createアクションでユーザーを登録
        User.register(newUser, req.body.password, (e, user) => {
            if (user) {
                //フラッシュメッセージとともにレスポンスを返す
                req.flash("success", 
                            `${user.fullName}'のアカウントが作成されました!`);
                res.locals.redirect = "/users";
            } else {
                req.flash("error",
                        `アカウントの作成に失敗しました: ${e.message}`);
                res.locals.redirect = "/users/new";
                next();
            }
        });
    },

    //ビューのレンダリングは、redirectViewアクションで別に行う
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },

    //特定ユーザーを表示するshowアクション
    show: (req, res, next) => {
        //リクエストのパラメーターからユーザーIDを取り出す
        let userId = req.params.id;
        //そのIDを持つユーザーを探す
        User.findById(userId)
            .then(user => {
                //レスポンスオブジェクト経由でユーザーを次のミドルウェア関数に渡す
                res.locals.user = user;
                next();
            })
            .catch(error => {
                //エラーはロギングして次の関数に渡す
                console.log(`エラーです: ${error.message}`);
            });
    },

    showView: (req, res) => {
        //showのビューをレンダリングする
        res.render("users/show");
    },

    //編集のアクション
    edit: (req, res, next) => {
        let userId = req.params.id;
        //findByIdを使って、データベース内のユーザーをIDで探す
        User.findById(userId)
            .then(user => {
                //特定のユーザーのためにユーザー編集ページをレンダリングする
                res.render("users/edit", {
                    user: user
                });
            })
            .catch(error => {
                console.log(`エラーです: ${error.message}`);
                next(error);
            });
    },
    //更新のアクション
    update: (req, res, next) => {
        let userid = req.params.id,
        //ユーザーのパラメータをリクエストから収集する
        userParams = {
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email,
            password: req.body.password
        };

        //findByIdAndUpdateを使って、ユーザーをIDで見つけた後、
        //そのドキュメントレコードの更新もおこなう
        User.findByIdAndUpdate(userId, {
            $set: userParams
        })
        .then(user => {
            //ユーザーをローカル変数としてレスポンスに追加し
            res.locals.redirect = `/users/${usersId}`;
            res.locals.user = user;
            //次のミドルウェア関数に渡す
            next();
        })
        .catch(error => {
            console.log(`エラーです: ${error.message}`);
            next(error);
        });
    },

    //削除のアクション
    delete: (req, res, next) => {
        let userId = req.params.id;
        //ユーザーをfindByIdAndRemoveで削除
        User.findByIdAndRemove(userId)
            .then(() => {
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`エラーです: ${error.message}`);
                next();
            });
    },
    //ログインアクション
    login: (req, res) => {
        res.render("users/login");
    },

    //バリデーションチェック
    validate: (req, res, next) => {
        //入力フィールドのデータをチェック
        req
            .sanitizeBody("email")
            .normalizeEmail({
                all_lowercase: true
            })
            .trim();
        req.check("email", "Email is invalid").isEmail();
        req.check("password", "Password cannot be empty").notEmpty();
        req.getValidationResult().then((error) => {
            //エラーを収集してフラッシュメッセージとして応答
            if (!error.isEmpty()) {
                let messages  = error.array().map(e => e.msg);
                req.skip = true;
                req.flash("error", messages.join(" and "));
                res.locals.redirect = '/users/new';
                next();
            } else {
                next();
            }
        });
    },

    //認証のミドルウェアを追加し、リダイレクトとフラッシュメッセージのオプションを指定する
    authenticate: passport.authenticate("local", {
        failureRedirect: "users/login",
        failureFlash: "ログインに失敗しました",
        successRedirect: "/",
        successFlash: "ログインしました"
    }),
    //ユーザーがログアウトするためのアクション
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "ログアウトしました");
        res.locals.redirect = "/";
        next();
    }
};