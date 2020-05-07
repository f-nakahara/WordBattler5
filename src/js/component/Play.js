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
import Stage from "./Play/Stage"
import StandBy from "./Play/StandBy"

class Play extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "player": {
                "id": "-M6ez2lmxvzFg41Ps9T6",
                "name": this.props.location.state.player.name
            },
            "room": {
                "id": "-M6ez2ltXqvidOECJCMM",
                "name": this.props.location.state.room.name,
                "diffLevel": this.props.location.state.room.diffLevel,
                "playerNum": this.props.location.state.room.playerNum
            },
            "window": {
                "height": window.innerHeight,
                "width": window.innerWidth,
                "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
            }
        }
    }

    // プレイヤーの取得
    getPlayer() {
        var database = firebase.database()
        const playerId = this.state.player.id
        database.ref(`player/${playerId}`).once("value", (snapshot) => {
            var player = this.state.player
            player.score = snapshot.val().score
            this.setState(player)
        })
    }

    // ルームの取得
    getRoom() {
        var database = firebase.database()
        const roomId = this.state.room.id
        database.ref(`room/${roomId}`).once("value", (snapshot) => {
            var room = this.state.room
            room.score = snapshot.val().score
            room.playerNum = snapshot.val().playerNum
            this.setState(room)
        })
    }

    // 描画前に実行
    componentWillMount() {
        this.getPlayer()
        this.getRoom()
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
        return (
            <div style={{ backgroundImage: `url(../../../../image/background/doukutu.png)`, backgroundSize: "cover", height: `${this.state.window.height}px` }}>
                <EventListener target="window" onResize={this.handleResize.bind(this)} />
                <Header playerName={this.state.player.name} roomName={this.state.room.name} />
                <div className="row m-3">
                    <div className="col-3">
                        <Term room={this.state.room} player={this.state.player} />
                    </div>
                    <div className="col-6 text-center">
                        <Stage room={this.state.room} />
                        <EnemyImage window={this.state.window} room={this.state.room} />
                        <Theme player={this.state.player} />
                    </div>
                    <div className="col-3">
                        <Log window={this.state.window} room={this.state.room} player={this.state.player} />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <HitPoint room={this.state.room} />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <Form player={this.state.player} room={this.state.room} />
                    </div>
                </div>
                <div className="row m-0 p-0">
                    <div className="col-12 text-center m-0">
                        <HomeButton />
                    </div>
                </div>
                <StandBy room={this.state.room} player={this.state.player} />
                <Result player={this.state.player} room={this.state.room} />
                <ReactPlayer url="../../audio/Crystal_Battle.mp3" volume={0.1} loop={true} playing style={{ display: "none" }} />
            </div>
        )
    }
}

export default Play