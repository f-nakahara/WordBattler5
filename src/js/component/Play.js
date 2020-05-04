import React from "react"
import Header from "./Header"
import Log from "./Play/Log"
import Term from "./Play/Term"
import Form from "./Play/Form"
import EventListener from "react-event-listener"
import Theme from "./Play/Theme"
import { HitPoint, EnemyImage } from "./Play/Enemy"
import firebase from "firebase"
import HomeButton from "./Play/HomeButton"
import Result from "./Play/Result"
import ReactPlayer from "react-player"


class Play extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "player": {
                "id": "test",
                "name": "koudai",
                "form": true,
                "result": false,
                "score": 0
            },
            "room": {
                "id": "roomId",
                "name": "渕田研究室",
                "diffLevel": "easy",
                "score": 0,
                "playerNum": 1
            },
            "window": {
                "height": window.innerHeight,
                "width": window.innerWidth,
                "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
            },
            "theme": {
                "list": [],
                "value": ""
            },
            "effect": {
                "list": [],
                "value": ""
            },
            "log": [],
            "enemy": {
                "image": "",
                "hp": "",
                "maxHp": "",
                "next": "2"
            },
            "term": {
                "name": "",
                "value": ""
            }
        }
    }

    // プレイヤーの取得
    getPlayer() {
        var database = firebase.database()
        const playerId = "test"
        database.ref(`player/${playerId}`).once("value", (snapshot) => {
            var player = this.state.player
            player.score = snapshot.val().score
            this.setState(player)
        })
    }

    // ルームの取得
    getRoom() {
        var database = firebase.database()
        const roomId = "roomId"
        database.ref(`room/${roomId}`).once("value", (snapshot) => {
            var room = this.state.room
            room.score = snapshot.val().score
            room.playerNum = snapshot.val().playerNum
            this.setState(room)
        })
    }

    // エフェクトリストの取得
    getEffectList() {
        var database = firebase.database()
        var effectRef = database.ref("effect")
        effectRef.once("value", (snapshot) => {
            const effectList = snapshot.val()
            this.setState({
                "effect": {
                    "list": effectList,
                    "value": ""
                }
            })
        })
    }

    // お題リストの取得
    getThemeList() {
        firebase.database().ref("theme").once("value", (snapshot) => {
            const themeList = snapshot.val()
            this.setState({
                "theme": {
                    "list": themeList,
                    "value": ""
                }
            })
            this.changeTheme()
        })
    }

    // ログの取得
    getLogList() {
        firebase.database().ref(`room/${this.state.room.id}/log`).once("value", (snapshot) => {
            this.changeLog(snapshot.val())
        })
    }

    // 的情報の取得
    getEnemy() {
        firebase.database().ref(`room/${this.state.room.id}/enemy`).once("value", (snapshot) => {
            this.setState({
                "enemy": {
                    "image": snapshot.val().image,
                    "hp": snapshot.val().hp,
                    "maxHp": snapshot.val().hp,
                    "next": snapshot.val().next
                }
            })
        })
    }

    // 条件の取得
    getTerm() {
        firebase.database().ref(`room/${this.state.room.id}/term`).once("value", (snapshot) => {
            this.setState({
                "term": {
                    "name": snapshot.val().name,
                    "value": snapshot.val().value
                }
            })
            if (snapshot.val().name == "time")
                this.timeProcess(snapshot.val().value)
        })
    }

    // タイマー処理
    timeProcess(value) {
        var time = value
        var timer = setInterval(() => {
            time -= 1
            var term = this.state.term
            term.value = time
            this.setState(term)
            if (time <= 0) {
                term.value = 0
                this.setState(term)
                clearInterval(timer)
                this.changePlayerForm(false)
                this.changeResult(true)
                this.rankingProcess()
            }
        }, 1000)
    }

    // 描画前に実行
    componentWillMount() {
        this.getPlayer()
        this.getRoom()
        this.getEffectList()
        this.getThemeList()
        this.getLogList()
        this.getEnemy()
        this.getTerm()
    }

    // 描画完成後に実行
    componentDidMount() {
        var database = firebase.database()
        const playerId = "test"
        const roomId = "roomId"
        var playerRef = database.ref(`player/${playerId}`)
        var roomRef = database.ref(`room/${roomId}`)
        this.monitorPlayer(playerRef)
        this.monitorRoom(roomRef)
    }

    // プレイヤーのthemeの監視
    monitorPlayer(playerRef) {
        playerRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            switch (key) {
                case "log": this.changeTheme(); break;
            }
        })
    }

    // ルームの監視
    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            switch (key) {
                case "effect": this.changeEffect(snapshot.val()); break;
                case "enemyHp": this.changeEnemyHp(snapshot.val()); break;
                case "log": this.changeLog(snapshot.val()); break;
                case "term": this.changeTermValue(snapshot.val()); break;
                case "enemy": this.changeEnemy(snapshot.val()); break;
            }
        })
    }

    // ランキング処理
    rankingProcess() {
        const playerId = this.state.player.id
        const playerName = this.state.player.name
        const playerNum = this.state.room.playerNum
        const playerScore = this.state.player.score
        const roomId = this.state.room.id
        const roomScore = this.state.room.score
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

    // 条件値の変更
    changeTermValue(value) {
        var term = this.state.term
        const termValue = value.value
        term.value = termValue
        if (termValue <= 0) {
            this.changePlayerForm(false)
            this.changeResult(true)
            this.rankingProcess()
        }
        this.setState(term)
    }

    // HPの変更
    changeEnemyHp(value) {
        var enemy = this.state.enemy
        enemy.hp = value
        this.setState(enemy)
        if (value <= 0) {
            this.changePlayerForm(false)
            this.getPlayer()
            this.getRoom()
            this.changeResult(true)
            this.rankingProcess()
        }
    }

    // 結果画面の変更
    changeResult(value) {
        var player = this.state.player
        player.result = value
        this.setState(
            player
        )
    }

    // プレイヤーフォームの変更
    changePlayerForm(value) {
        var player = this.state.player
        player.form = value
        this.setState(player)
    }

    // 敵の変更
    changeEnemy(value) {
        var enemy = this.state.enemy
        enemy.hp = value.hp
        enemy.maxHp = value.hp
        enemy.image = value.image
        enemy.next = value.next
        var syoukanEffect = ["syoukan4.gif", "syoukan5.gif"]
        var effectValue = syoukanEffect[Math.floor(Math.random() * syoukanEffect.length)]
        this.changeResult(false)
        this.setState(enemy)
        this.setState({
            "effect": {
                "value": effectValue
            }
        })
    }

    // お題の変更
    changeTheme() {
        var themeList = this.state.theme.list
        if (themeList.length == 0) {
            this.getThemeList()
        }
        else {
            const theme = themeList[Math.floor(Math.random() * themeList.length)]
            themeList = themeList.filter(function (value) {
                return value !== theme
            })
            this.setState({
                "theme": {
                    "list": themeList,
                    "value": theme
                }
            })
        }
    }

    // ログ変更
    changeLog(value) {
        var log = []
        for (var key in value) {
            if (value[key]["player"]["id"] == this.state.player.id)
                log.push(value[key])
        }
        this.setState({
            "log": log
        })
    }

    // エフェクト変更
    changeEffect(value) {
        var effect = this.state.effect
        effect.value = value
        this.setState(
            effect
        )
    }

    // 画面サイズ変更時実行
    handleResize() {
        this.setState({
            "window": {
                "height": window.innerHeight,
                "width": window.innerWidth,
                "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
            }
        })
    }

    render() {
        // const playerName = this.props.location.state.playerName
        // const playerId = this.props.location.state.playerId
        // const roomId = this.props.location.state.roomId
        return (
            <div style={{ backgroundImage: `url(../../../../image/background/doukutu.png)`, backgroundSize: "cover", height: `${this.state.window.height}px` }}>
                <EventListener target="window" onResize={this.handleResize.bind(this)} />
                <Header playerName={this.state.player.name} roomName={this.state.room.name} />
                <div className="row m-3">
                    <div className="col-3">
                        <Term term={this.state.term} />
                    </div>
                    <div className="col-6 text-center">
                        <h1 className="w-100">ステージ{parseInt(this.state.enemy.next) - 1}</h1>
                        <EnemyImage window={this.state.window} effect={this.state.effect} enemy={this.state.enemy} />
                        <Theme theme={this.state.theme} />
                    </div>
                    <div className="col-3">
                        <Log window={this.state.window} log={this.state.log} />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <HitPoint enemy={this.state.enemy} />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <Form theme={this.state.theme} effect={this.state.effect} player={this.state.player} room={this.state.room} term={this.state.term} />
                    </div>
                </div>
                <div className="row m-0 p-0">
                    <div className="col-12 text-center m-0">
                        <HomeButton />
                    </div>
                </div>
                <Result player={this.state.player} room={this.state.room} enemy={this.state.enemy} />
                <ReactPlayer url="../../audio/Crystal_Battle.mp3" volume={0.2} loop playing style={{ display: "none" }} />
            </div>
        )
    }
}

export default Play