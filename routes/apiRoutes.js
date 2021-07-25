//Express.jsのRouterとcoursesControllerをロード
const router = require("express").Router();
const coursesController = require("../controllers/coursesController");

//コースデータのエンドポイントに向かう経路
router.get("/courses", coursesController.index, coursesController.filterUserCourses, coursesController.respondJSON);

//IDの指定によりコースに参加する経路
router.get("/courses/:id/join", coursesController.join, coursesController.respondJSON);

//すべてのAPIエラーを処理する
router.use(coursesController.errorJSON);

module.exports = router;