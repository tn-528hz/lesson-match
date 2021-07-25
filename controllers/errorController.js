const httpStatus = require("http-status-codes");

//これまで対処しなかったリクエストに対処

exports.pageNotFoundError = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render("error");
};

//サーバーの内部エラーに対処
exports.internalServerError = (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log('エラーが起きました');
    res.status(errorCode);
    res.send(`${errorCode} | エラーです`);
};