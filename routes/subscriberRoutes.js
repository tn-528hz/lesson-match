//Express.jsのルータと、usersControllerをロードする
const router = require("express").Router();
const subscribersController = require("../controllers/subscribersController.js");

//Subscribersの経路の処理
//インデックスビューを表示するGET経路
router.get("/", subscribersController.index,
            //index.ejsページのレンダリングは、indexViewでおこなう
            subscribersController.indexView);

router.get("/new", subscribersController.new);

//Createのための、最初のPOST経路
router.post("/create", subscribersController.create, subscribersController.redirectView);

//購読者編集の経路
router.get("/:id/edit", subscribersController.edit);

//購読者更新の経路
router.put("/:id/update", subscribersController.update, subscribersController.redirectView);

//ObjectIDベースで購読者を表示する経路
router.get("/:id", subscribersController.show, subscribersController.showView);

//購読者削除の経路
router.delete("/:id/delete", subscribersController.delete, subscribersController.redirectView);

//routerオブジェクトを、このモジュールからエクスポートする
module.exports = router;
