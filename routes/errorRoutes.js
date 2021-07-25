//Express.jsのルータと、usersControllerをロードする
const router = require("express").Router();
const errorController = require("../controllers/errorController");

//エラー処理の経路を追加
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

//routerオブジェクトを、このモジュールからエクスポートする
module.exports = router;