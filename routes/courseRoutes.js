//Express.jsのルータと、usersControllerをロードする
const router = require("express").Router();
const coursesController = require("../controllers/coursesController");

//Coursesの経路の処理
//インデックスビューを表示するGET経路
router.get("/", coursesController.index, coursesController.indexView);
router.get("/new", coursesController.new);

//Createのための最初のPOST経路
router.post("/create", coursesController.create, coursesController.redirectView);

//Course編集の経路
router.get("/:id/edit", coursesController.edit);

//編集リクエストを処理しUpdateする
router.put("/:id/update", coursesController.update, coursesController.redirectView);

//UpdateしたデータをShowページで表示する
router.get("/:id", coursesController.show, coursesController.showView);

//コース削除の経路
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

//routerオブジェクトを、このモジュールからエクスポートする
module.exports = router;