import React from "react"
import { withRouter } from "react-router-dom"
import Modal from "react-modal"
import firebase from "firebase"

Modal.setAppElement("#root")  // モーダルをトップページに設置する

class CreateRoomButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "room": {
                "id": "",
                "name": "unknown",
                "playerNum": 1,
                "diffLevel": "easy"
            },
            "player": {
                "id": "",
                "name": "unknown"
            },
            "modalIsOpen": false
        }
    }

    // モーダルを開く
    openModal() {
        this.setState({ "modalIsOpen": true });
    }

    // モーダルを閉じる
    closeModal() {
        this.setState({ "modalIsOpen": false });
    }
    // プレイヤー情報をデータベースに登録する
    pushPlayerName() {
        var playerRef = firebase.database().ref("player")
        var player = this.state.player
        const playerName = player.name
        var themeRef = firebase.database().ref("theme")
        themeRef.once("value", (snapshot) => {
            const themeList = snapshot.val()
            const themeValue = themeList[Math.floor(Math.random() * themeList.length)]
            var playerId = playerRef.push({
                "name": playerName,
                "score": 0,
                "theme": themeValue,
                "log": []
            })["path"]["pieces_"][1]
            player.id = playerId
            this.setState(player)
            this.pushRoomName()
        })
    }

    // ルーム情報をデータベースに登録する
    pushRoomName() {
        var roomRef = firebase.database().ref("room")
        var room = this.state.room
        var roomName = room.name
        var playerNum = room.playerNum
        var diffLevel = room.diffLevel
        var playerId = this.state.player.id
        var roomId = roomRef.push({
            "battle": true,
            "game": false,
            "diffLevel": diffLevel,
            "effect": "",
            "enemy": {
                "hp": 0,
                "image": "",
                "next": ""
            },
            "enemyHp": 0,
            "log": [],
            "name": roomName,
            "score": 0,
            "term": {
                "name": "",
                "value": ""
            },
            "player": [playerId],
            "playerNum": playerNum
        })["path"]["pieces_"][1]
        room.id = roomId
        this.setState(room)
        this.movePage()
    }

    // ページを移動する
    movePage() {
        const link = "/play"  // 移動先のURL
        this.props.history.push({
            pathname: link,
            state: {
                "player": {
                    "id": this.state.player.id,
                    "name": this.state.player.name
                },
                "room": {
                    "id": this.state.room.id,
                    "name": this.state.room.name,
                    "playerNum": this.state.room.playerNum,
                    "diffLevel": this.state.room.diffLevel
                }
            }
        })
    }

    // プレイヤー名を変更する
    changePlayerName(e) {
        const playerName = e.target.value
        var player = this.state.player
        // 空文字のときは「unknown」に変更
        if (playerName == "")
            player.name = "unknown"
        else
            player.name = playerName
        this.setState(player)
    }

    // ルーム名を変更する
    changeRoomName(e) {
        const roomName = e.target.value
        var room = this.state.room

        // 空文字のときは「unknown」に変更
        if (roomName == "")
            room.name = "unknown"
        else
            room.name = roomName
        this.setState(room)
    }

    // プレイヤー人数の変更
    changePlayerNum(e) {
        const playerNum = e.target.value
        var room = this.state.room
        room.playerNum = playerNum
        this.setState(room)
    }

    // 難易度の変更
    changeDiffLevel(e) {
        const diffLevel = e.target.value
        var room = this.state.room
        room.diffLevel = diffLevel
        this.setState(room)
    }

    handleClick() {
        this.pushPlayerName()

    }

    render() {
        return (
            <div>
                <button onClick={this.openModal.bind(this)} className={`btn btn-lg btn-primary w-100`}>ルーム作成</button>
                <Modal
                    className="modal-dialog modal-dialog-centered"
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal.bind(this)}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="h4">ルーム作成</div>
                        </div>
                        <div className="modal-body">
                            <div className="form">
                                <label>●プレイヤー名</label>
                                <input className="form-control" onChange={this.changePlayerName.bind(this)} ></input>
                                <br></br>
                                <label>●ルーム名</label>
                                <input className="form-control" onChange={this.changeRoomName.bind(this)} ></input>
                                <br></br>
                                <label>●難易度</label>
                                <select className="form-control" onChange={this.changeDiffLevel.bind(this)}>
                                    <option value="easy">かんたん</option>
                                    <option value="normal">ふつう</option>
                                    <option value="hard">むずかしい</option>
                                </select>
                                <label>●人数</label>
                                <select className="form-control" onChange={this.changePlayerNum.bind(this)}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={this.handleClick.bind(this)}>決定</button>
                            <button className="btn btn-danger" onClick={this.closeModal.bind(this)}>閉じる</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(CreateRoomButton)