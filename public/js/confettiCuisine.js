//DOMがロードされるのを待つ
$(document).ready(() => {
    //クライアントにsocket.ioを加える
    //クライアントでsocket.ioを初期化
    const socket = io();

    //チャットフォームのsubmitイベントを監視
    $("#chatForm").submit(() => {
        let text = $("#chat-input").val(),
            userName = $("#chat-user-name").val(),
            userId = $("#chat-user-id").val();
        //フォームが送出されるときにイベントを送出
        socket.emit("message", {
            content: text,
            userName: userName,
            userId: userId
        });
        $("#chat-input").val("");
        return false;
    });

    //messageイベントを処理して、チャットボックスに記入
    socket.on("message", message => {
        displayMessage(message);
    });

    //load all messagesのイベント処理で、届いたデータを解析
    socket.on("load all messages", data => {
        //書くメッセージをdisplayMessageでチャットボックスに表示
        data.forEach(message => {
            displayMessage(message);
        });
    });

    //メッセージが送られたときにチャットアイコンを点滅させる
    socket.on("message", (message) => {
        //メッセージ表示後に
        displayMessage(message);
        //アイコン点滅のアニメーションを行う
        for (let i = 0; i < 2; i++) {
            $(".chat-icon").fadeOut(200).fadeIn(200);
        }
    });

    //チャットボックスのメッセージを表示する
    let displayMessage = message => {
        $("#chat").prepend( 
        $("<li>").html(`
        <div class='message ${getCurrentUserClass(message.user)}'>
        <span class="user-name">
        ${message.userName}:
        </span>
        ${message.content}
        </div>
        `)
        );
    };

    let getCurrentUserClass = id => {
        let userId = $("#chat-user-id").val();
        //メッセージが現在のユーザーに属するがどうかをチェック
        if (userId === id) return "current-user";
        else return "";
    };

    //モーダルボタンのクリックイベントを処理する
    $("#modal-button").click(() => {
        //モーダル本体の内容を空の文字列でリセットする
        $(".modal-body").html("");
        //AjaxのGETリクエストを介してコースデータを取得する
        $.get(`/api/courses`, (results = {}) =>{
            let data = results.data;
            if (!data || !data.courses) return;
            //コースの行をループ処理でモーダル本体に追加する
            data.courses.forEach(course => {
                $(".modal-body").append(
                    `<div>
                            <span class="course-title">
                                ${course.title}
                            </span>
                            <span class="course-cost">$${course.cost}</span>
                            <button class= "${course.joined ? "joined-button" : "join-button"}  btn btn-info btn-sm" data-id="${
                            course._id}">
                            ${course.joined ? "Joined" : "Join"}
                            </button>
                            <div class="course-description">
                                ${course.description}
                            </div>
                        </div>`
                );
            });
        }).then(() => {
            //addJoinButtonListenerを呼び出して、リスナをコースのリストに追加
            addJoinButtonListener();
        });
    });
});

let addJoinButtonListener = () => {
    $(".join-button").click(event => {
        let $button = $(event.target),
            courseId = $button.data("id");
            console.log(`/api/courses/${courseId}/join`);
            //選択したコースに現在のユーザーを登録するAPIコール
            $.get(`/api/courses/${courseId}/join`, (results = {}) => {
                let data = results.data;
                if (data && data.success) {
                    $button
                            .text("Joined")
                            .addClass("joined-button")
                            .removeClass("join-button");
                } else {
                    $button.text("ログインしてください");
                }
            });
    });
};