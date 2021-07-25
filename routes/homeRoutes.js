//Express.jsのルータと、usersControllerをロードする
const router = require("express").Router();
const homeController = require("../controllers/homeController");

//チャットの経路
router.get("/chat", homeController.chat);
//ホームの経路
router.get("/", homeController.index);

//routerオブジェクトを、このモジュールからエクスポートする
module.exports = router;
