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
            "height": window.innerHeight,
            "width": window.innerWidth,
            "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight,
            "theme": "",
            "effectList": [],
            "themeList": [],
            "effect": ""
        }
        // firebase.database().ref("theme").once("value", (snapshot) => {
        //     this.setState({
        //         "themeList": snapshot.val()
        //     })
        // })

    }


    componentWillMount() {
        var database = firebase.database()
        var effectRef = database.ref("effect")
        effectRef.once("value", (snapshot) => {
            const effectList = snapshot.val()
            this.setState({
                "effectList": effectList
            })
        })
    }

    // 描画完成後に実行
    componentDidMount() {
        var database = firebase.database()
        var playerRef = database.ref("player")
        var roomRef = database.ref("room")
        this.monitorPlayerTheme(playerRef)
        this.monitorRoom(roomRef)
    }

    // プレイヤーのthemeの監視
    monitorPlayerTheme(playerRef) {
        const playerName = "test"
        var playerTheme = playerRef.child(`${playerName}/theme`)
        playerTheme.on("value", (snapshot) => {
            const theme = snapshot.val()
            this.setState({
                "theme": theme
            })
        })
    }

    // ルームのeffectの監視
    monitorRoom(roomRef) {
        var roomId = "roomId"
        var RoomEffect = roomRef.child(`${roomId}`)
        RoomEffect.on("child_changed", (snapshot) => {
            const key = snapshot.key
            switch (key) {
                case "effect": this.changeEffect(snapshot.val()); break;
            }
        })
    }

    changeEffect(value) {
        this.setState({
            "effect": value
        })
    }

    // 画面サイズ変更時実行
    handleResize() {
        this.setState({
            "height": window.innerHeight,
            "width": window.innerWidth,
            "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
        })
    }

    render() {
        // const playerName = this.props.location.state.playerName

        return (
            <div style={{ backgroundImage: `url(../../../../image/background/doukutu.png)`, backgroundSize: "cover", height: `${this.state.height}px` }}>
                <EventListener target="window" onResize={this.handleResize.bind(this)} />
                <Header playerName="koudai" roomName="渕田研究室" />
                {/* <img src={`${window.location.origin}/../../../image/background/doukutu.png`} /> */}
                <div className="row m-3">
                    <div className="col-3">
                        <Term />
                    </div>
                    <div className="col-6 text-center">
                        <h1 className="w-100">ステージ1</h1>
                        <EnemyImage max={this.state.max} effect={this.state.effect} />
                        <Theme theme={this.state.theme} />
                    </div>
                    <div className="col-3">
                        <Log max={this.state.max} />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <HitPoint />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <Form theme={this.state.theme} effectList={this.state.effectList} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Play