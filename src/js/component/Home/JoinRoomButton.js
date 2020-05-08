import React from "react"
import firebase from "firebase"
import { withRouter } from "react-router-dom"
import Modal from "react-modal"

Modal.setAppElement("#root")  // モーダルをトップページに設置する

class JoinRoomButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "modalIsOpen": false,
            "playerModalIsOpen": false,
            "room": {
                "id": "",
                "name": "",
                "playerNum": "",
                "diffLevel": ""
            },
            "player": {
                "id": "",
                "name": "unknown",
                "theme": ""
            },
            "roomList": []
        }
    }

    componentDidMount() {
        var roomRef = firebase.database().ref("room")
        this.monitorRoom(roomRef)
        Promise.all([
            this.getAllRoom(roomRef)
        ])
    }

    changeRoomList(value) {
        var roomList = value
        if (roomList != null) {
            for (var key in roomList) {
                var room = roomList[key]
                if (Object.keys(room).length < 10) {
                    delete roomList[key]
                }
            }
            this.setState({
                "roomList": roomList
            })
        }
    }

    monitorRoom(roomRef) {
        roomRef.on("child_added", (snapshot) => {
            this.getAllRoom(roomRef)
        })
        roomRef.on("child_removed", (snapshot) => {
            this.getAllRoom(roomRef)
        })
    }

    getAllRoom(roomRef) {
        roomRef.once("value", (snapshot) => {
            this.changeRoomList(snapshot.val())
        })
    }

    // モーダルを開く
    openModal() {
        this.setState({ "modalIsOpen": true });
    }

    // プレイヤーモーダルを開く
    openPlayerModal() {
        this.setState({
            "modalIsOpen": false,
            "playerModalIsOpen": true
        })
    }

    // モーダルを閉じる
    closeModal() {
        this.setState({
            "modalIsOpen": false,
            "playerModalIsOpen": false
        });
        var player = this.state.player
        var room = this.state.room
        player.id = ""
        player.name = "unknown"
        player.theme = ""
        room.diffLevel = ""
        room.id = ""
        room.name = ""
        room.playerNum = ""
        this.setState(player)
        this.setState(room)
    }

    backModal() {
        this.setState({
            "modalIsOpen": true,
            "playerModalIsOpen": false
        })
    }

    // クリックイベント
    handleClick(roomId) {
        Promise.resolve()
            .then(() => {
                return firebase.database().ref(`room/${roomId}`).once("value")
            })
            .then((snapshot) => {
                var value = snapshot.val()
                var room = this.state.room
                room.id = roomId
                room.name = value.name
                room.diffLevel = value.diffLevel
                room.playerNum = value.playerNum
            })
            .then(() => this.openPlayerModal())
    }

    pushPlayerName() {
        var playerRef = firebase.database().ref("player")
        var player = this.state.player
        const playerName = player.name
        var themeRef = firebase.database().ref("theme")

        var resolve = themeRef.once("value", (snapshot) => {
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
        })
        return resolve
    }

    pushPlayerToRoom() {
        var result = firebase.database().ref(`room/${this.state.room.id}`).child("player").push(
            this.state.player.id
        )
        return result
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

    handlePlayerClick() {
        Promise.resolve()
            .then(() => this.pushPlayerName())
            .then(() => this.pushPlayerToRoom())
            .then(() => this.movePage())
    }

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

    diffLevelStatus(value) {
        if (value == "easy")
            return "かんたん"
        else if (value == "normal")
            return "ふつう"
        else
            return "むずかしい"
    }

    gameStatus(value) {
        if (value) {
            return (
                "ゲーム中"
            )
        }
        else {
            return "待機中"
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.openModal.bind(this)} className={`btn btn-lg btn-primary w-100`}>ルーム参加</button>
                {this.state.modalIsOpen ?
                    <div>
                        <Modal
                            className="modal-dialog modal-dialog-centered"
                            isOpen={this.state.modalIsOpen}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="h4">ルーム参加</div>
                                </div>
                                <div className="modal-body" style={{
                                    height: `${this.props.window.height / 3 * 2}px`,
                                    overflow: "scroll"
                                }}>
                                    {Object.keys(this.state.roomList).map((key, i) => {
                                        return (
                                            <div key={i}>
                                                <div className="card m-1">
                                                    <div className="card-header">
                                                        <div className="h4">{this.state.roomList[key].name}</div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div><span className="font-weight-bold">難易度：</span>{this.diffLevelStatus(this.state.roomList[key].diffLevel)}</div>
                                                        <div><span className="font-weight-bold">プレイヤー：</span>{Object.keys(this.state.roomList[key].player).length}/{this.state.roomList[key].playerNum}</div>
                                                        <div><span className="font-weight-bold">ゲーム：</span>{this.gameStatus(this.state.roomList[key].game)}</div>
                                                    </div>
                                                    <div className="card-footer text-right">
                                                        {Object.keys(this.state.roomList[key].player).length != this.state.roomList[key].playerNum ?
                                                            <button className="btn btn-primary" onClick={this.handleClick.bind(this, key)}>参加</button>
                                                            :
                                                            <button className="btn btn-primary" onClick={this.handleClick.bind(this, key)} disabled >参加</button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-danger" onClick={this.closeModal.bind(this)}>閉じる</button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                    :
                    <div>
                        <Modal
                            className="modal-dialog modal-dialog-centered"
                            isOpen={this.state.playerModalIsOpen}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="h4">プレイヤー作成</div>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <label>●プレイヤー名</label>
                                        <input className="form-control" onChange={this.changePlayerName.bind(this)}></input>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={this.backModal.bind(this)}>戻る</button>
                                    <button className="btn btn-primary" onClick={this.handlePlayerClick.bind(this)}>決定</button>
                                    <button className="btn btn-danger" onClick={this.closeModal.bind(this)}>閉じる</button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(JoinRoomButton)