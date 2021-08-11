const express = require("express");
const layouts = require("express-ejs-layouts");
const app = express();
const router = require("./routes/index");
const homeController = require("./controllers/homeController.js");
const errorController = require("./controllers/errorController.js");
const subscribersController = require("./controllers/subscribersController.js");
const usersController = require("./controllers/usersController.js");
const coursesController = require("./controllers/coursesController.js");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const expressValidator = require("express-validator");
const connectFlash = require("connect-flash");
const User = require("./models/user");

const { MongoClient } = require('mongodb');

const DB_NAME = `user_db`;
const USER_NAME = `TakatoNoguchi`;
const USER_PASSWD = `hthmm0528T`;
const HOST_NAME = `cluster0.ognka.mongodb.net/test`;

const uri = `mongodb+srv://${USER_NAME}:${USER_PASSWD}@${HOST_NAME}/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("Connected successfully to server");
  client.close();
});

if (process.env.NODE_ENV !== 'production') {
    const MONGODB_URI = 'mongodb+srv://NoguchiTakato:hthmm0528T@cluster0.ognka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'todo-app',
    })
      .catch((err) => {
        console.error(err);
      });
  } else {
    mongoose.connect(process.env.MONGODB_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'user_db',
    })
      .catch((err) => {
        console.error(err);
      });
  }
  
//ejsの使用をアプリに設定
app.set("view engine", "ejs");

//環境変数
app.set("port", process.env.PORT || 3000);

app.use(methodOverride("_method", 
    {methods: ["POST", "GET"]
}));

//レイアウトをアプリケーションに設定
app.use(layouts);
//静的アセット
app.use(express.static("public"));

//バリデーションを設定
app.use(expressValidator());

//リクエスト本体を解析するミドルウェア関数
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());

//cookieParserを秘密鍵を使って設定
app.use(cookieParser("secretCuisine123"));
//セッションを使うようにExpress.jsを設定
app.use(expressSession({
    secret: "secretCuisine123",
    cookie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
}));

app.use(connectFlash());

//passportを初期化して使うようにExpress.jsを設定
app.use(passport.initialize());
//passportに対してセッションを使うように指示
app.use(passport.session());
//デフォルトのログインストラテジーを設定
passport.use(User.createStrategy());
//passportを、ユーザーデータの圧縮・暗号化/複合をするように設定
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//フラッシュメッセージを使うためのカスタムミドルウェア
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
});

//routerオブジェクトの使用を指示
app.use("/", router);

const server = app.listen(app.get("port"), () => {
    console.log(`server running http://localhost:${app.get("port")}`);
});

const io = require("socket.io")(server);
const chatController = require("./controllers/chatController")(io);
