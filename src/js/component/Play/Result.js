import React from "react"
import firebase from "firebase"
import NextButton from "./NextButton"
import HomeButton from "./HomeButton"

class Result extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "battle": true,
            "enemy": {
                "hp": "",
                "image": "",
                "next": "2"
            },
            "player": {
                "score": 0
            },
            "room": {
                "score": 0
            }
        }
    }

    // 描画前
    componentWillMount() {
        var playerRef = firebase.database().ref(`player/${this.props.player.id}`)
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorPlayer(playerRef)
        this.monitorRoom(roomRef)
        this.getPlayerScore(playerRef)
        this.getRoomScore(roomRef)
        this.getBattle(roomRef)
        this.getEnemyHp(roomRef)
    }

    // player/<playerId>の監視
    monitorPlayer(playerRef) {
        playerRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "score") this.changePlayerScore(snapshot.val())
        })
    }

    // room/<roomid>の監視
    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "battle") this.changeResult(snapshot.val())
            else if (key == "enemy") this.changeEnemyNext(snapshot.val())
            else if (key == "score") this.changeRoomScore(snapshot.val())
            else if (key == "enemyHp") this.changeEnemyHp(snapshot.val())
        })
    }

    getEnemyHp(roomRef) {
        roomRef.child("enemyHp").once("value", (snapshot) => {
            var enemy = this.state.enemy
            enemy.hp = snapshot.val()
            this.setState(enemy)
        })
    }

    // バトル処理
    getBattle(roomRef) {
        roomRef.child("battle").once("value", (snapshot) => {
            this.setState({
                "battle": snapshot.val()
            })
        })
    }

    // プレイヤースコアの取得
    getPlayerScore(playerRef) {
        playerRef.child("score").once("value", (snapshot) => {
            var player = this.state.player
            player.score = snapshot.val()
            this.setState(player)
        })
    }

    // ルームスコアの取得
    getRoomScore(roomRef) {
        roomRef.child("score").once("value", (snapshot) => {
            var room = this.state.room
            room.score = snapshot.val()
            this.setState(room)
        })
    }

    // ランキング処理
    rankingProcess() {
        const playerId = this.props.player.id
        const playerName = this.props.player.name
        const playerScore = this.state.player.score

        const roomId = this.props.room.id
        const roomScore = this.state.room.score
        const playerNum = this.props.room.playerNum

        var database = firebase.database()
        var rankingRef = database.ref(`ranking/${playerNum}/${roomId}`)
        rankingRef.child("player").update({
            [playerId]: {
                "name": playerName,
                "score": playerScore
            }
        })
        rankingRef.update({
            "score": roomScore
        })
    }

    // プレイヤースコアの変更
    changePlayerScore(value) {
        var player = this.state.player
        player.score = value
        this.setState(player)
    }

    // ルームスコアの変更
    changeRoomScore(value) {
        var room = this.state.room
        room.score = value
        this.setState(room)
    }

    // 結果画面の変更
    changeResult(value) {
        this.setState({
            "battle": value
        })
    }

    // 次の敵の変更
    changeEnemyNext(value) {
        var enemy = this.state.enemy
        const next = value.next
        enemy.next = next
        this.setState(enemy)
    }

    // 敵体力の変更
    changeEnemyHp(value) {
        var enemy = this.state.enemy
        enemy.hp = value
        this.setState(enemy)
    }

    render() {
        var result = (<div></div>)
        if (!this.state.battle) {
            this.rankingProcess()
            result = (<div className="card" style={{ position: "fixed", top: "20%", bottom: "20%", left: "10%", right: "10%", zIndex: 9 }}>
                <div className="card-header text-center">
                    <div className="display-3">RESULT</div>
                </div>
                <div className="card-body text-center">
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)", WebkitTransform: "translateY(-50%) translateX(-50%)" }}>
                        {this.state.enemy.next == "clear"
                            ? <div>
                                <div className="h1 text-danger">CLEAR!!</div>
                                <br></br>
                            </div>
                            : ""
                        }
                        <h4>あなたのスコア</h4>
                        <h2>{this.state.player.score}pt</h2>
                        <h4>チームのスコア</h4>
                        <h1>{this.state.room.score}pt</h1>
                    </div>
                </div>
                <div className="card-footer">
                    {this.state.enemy.next == "clear" || (this.state.enemy.hp > 0 && this.state.enemy.hp !== "")
                        ? <div className="row">
                            <div className="col-12 text-center">
                                <HomeButton />
                            </div>
                        </div>
                        : <div className="row">
                            <div className="col-6 text-right">
                                <HomeButton />
                            </div>
                            <div className="col-6 text-left">
                                <NextButton enemy={this.props.enemy} room={this.props.room} />
                            </div>
                        </div>
                    }
                </div>
            </div>)
        }
        return (
            <div>
                {result}
            </div>
        )
    }
}

export default Result