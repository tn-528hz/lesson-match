//Express.jsのルータと、usersControllerをロードする
const router = require("express").Router();
const usersController = require("../controllers/usersController.js");

//Usersの経路の処理
//インデックスビューを表示するGET経路
router.get("/", usersController.index, usersController.indexView);

//Createリクエストの処理でフォームを供給する
router.get("/new", usersController.new);

//Createのフォームからデータを送出するリクエストを処理し、ビューを表示する
router.post("/create", usersController.validate,  usersController.create, usersController.redirectView);

//loginアクションへの経路
router.get("/login", usersController.login);

//ポストされたデータをauthenticateアクションに送る経路
router.post("/login", usersController.authenticate);

//ログアウトしてビューのリダイレクトを行う経路
router.get("/logout", usersController.logout, usersController.redirectView);

//編集リクエストを処理する経路
router.get("/:id/edit", usersController.edit);

//Editフォームからのデータを処理して、ユーザーShowページを表示する
router.put("/:id/update", usersController.update, usersController.redirectView);

//Showで表示する経路
router.get("/:id", usersController.show, usersController.showView);

//削除リクエストを処理する経路
router.delete("/:id/delete", usersController.delete, usersController.redirectView);

//routerオブジェクトを、このモジュールからエクスポートする
module.exports = router;
