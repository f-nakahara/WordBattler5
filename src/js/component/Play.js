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
import { Prompt } from "react-router-dom"

class Play extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "player": {
                "id": this.props.location.state.player.id,
                "name": this.props.location.state.player.name
            },
            "room": {
                "id": this.props.location.state.room.id,
                "name": this.props.location.state.room.name,
                "diffLevel": this.props.location.state.room.diffLevel,
                "playerNum": this.props.location.state.room.playerNum
            },
            "window": {
                "height": window.innerHeight,
                "width": window.innerWidth,
                "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
            },
            "deletePlayer": false
        }
    }

    componentWillUnmount() {
        var result = Promise.all([
            this.deletePlayer(),
            this.deleteRoom()
        ])
        return result
    }

    componentDidUpdate() {
        if (this.shouldBlockNavigation) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }
    }

    deletePlayer() {
        var playerRef = firebase.database().ref("player")
        playerRef.update({
            [this.state.player.id]: null
        })
        var roomRef = firebase.database().ref(`room/${this.state.room.id}`)
        var result = roomRef.child("player").once("value", (snapshot) => {
            for (var key in snapshot.val()) {
                if (snapshot.val()[key] == this.state.player.id) {
                    roomRef.child("player").update({
                        [key]: null
                    })
                }
            }
        })
        return result
    }

    deleteRoom() {
        var roomRef = firebase.database().ref("room")
        var result = roomRef.child(this.state.room.id).once("value", (snapshot) => {
            if (snapshot.val().player != null) {
                var currentPlayerNum = Object.keys(snapshot.val().player).length
                console.log(currentPlayerNum)
                if (currentPlayerNum <= 0) {
                    roomRef.update({
                        [this.state.room.id]: null
                    })
                }
            } else {
                roomRef.update({
                    [this.state.room.id]: null
                })
            }
        })
        return result
    }

    shouldBlockNavigation() {
        Promise.all([
            this.deletePlayer(),
            this.deleteRoom()
        ])
            .then(() => {
                return true
            })
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
                <Prompt when={this.shouldBlockNavigation} message="ページを離れますか？" />
            </div>
        )
    }
}

export default Play