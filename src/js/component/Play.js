import React from "react"
import Header from "./Header"
import Log from "./Play/Log"
import Term from "./Play/Term"
import Form from "./Play/Form"
import EventListener from "react-event-listener"
import Theme from "./Play/Theme"
import { HitPoint, EnemyImage } from "./Play/Enemy"
import firebase from "firebase"


class Play extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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
                "img": "",
                "hp": ""
            }
        }
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

    // 描画前に実行
    componentWillMount() {
        this.getEffectList()
        this.getThemeList()
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
                case "log": this.changeLog(snapshot.val()); break;
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
            }
        })
    }

    // HPの変更
    changeEnemyHp(value) {

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
        this.changeTheme()
        var log = []
        for (var key in value) {
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
                <Header playerName="koudai" roomName="渕田研究室" />
                <div className="row m-3">
                    <div className="col-3">
                        <Term />
                    </div>
                    <div className="col-6 text-center">
                        <h1 className="w-100">ステージ1</h1>
                        <EnemyImage window={this.state.window} effect={this.state.effect} />
                        <Theme theme={this.state.theme} />
                    </div>
                    <div className="col-3">
                        <Log window={this.state.window} log={this.state.log} />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <HitPoint />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <Form theme={this.state.theme} effect={this.state.effect} playerId={"test"} roomId={"roomId"} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Play