"use strict";

module.exports = {
  index: (req, res) => {
    res.render("index");
  },
  chat: (req, res) => {
    //チャットビューのレンダリング
    res.render("chat");
  },
};