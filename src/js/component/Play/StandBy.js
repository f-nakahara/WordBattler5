import React from "react"
import firebase from "firebase"
import HomeButton from "./HomeButton"

class StandBy extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "game": false,
            "currentPlayerNum": 1,
            "theme": {
                "list": [],
                "value": ""
            }
        }
    }

    componentWillMount() {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorRoom(roomRef)
    }

    componentDidMount() {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.getCurrentPlayerNum(roomRef)
        this.getGame(roomRef)
    }

    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "player") this.changeGame(snapshot.val())
        })
    }

    getCurrentPlayerNum(roomRef) {
        roomRef.child("player").once("value", (snapshot) => {
            var currentPlayerNum = Object.keys(snapshot.val()).length
            this.setState({
                "currentPlayerNum": currentPlayerNum
            })
        })
    }

    getGame(roomRef) {
        roomRef.child("game").once("value", (snapshot) => {
            this.setState({
                "game": snapshot.val()
            })
            if (this.props.room.playerNum == 1 || this.props.room.playerNum == this.state.currentPlayerNum) {
                this.initProcess()
                this.setState({
                    "game": true
                })
            }
        })
    }

    changeCurrentPlayerNum(value) {
        var currentPlayerNum = Object.keys(value).length
        this.setState({
            "currentPlayerNum": currentPlayerNum
        })
    }

    changeGame(value) {
        var currentPlayerNum = Object.keys(value).length
        this.setState({
            "currentPlayerNum": currentPlayerNum
        })
        if (currentPlayerNum == this.props.room.playerNum && !this.state.game) {
            this.initProcess()
            this.setState({
                "currentPlayerNum": currentPlayerNum,
                "game": true
            })
        }
    }

    initProcess() {
        var database = firebase.database()
        database.ref("enemy/1").once("value", (snapshot) => {
            const enemyHp = snapshot.val().hp[this.props.room.diffLevel]
            const enemyImage = snapshot.val().image
            const next = snapshot.val().next
            const termList = snapshot.val().term[this.props.room.diffLevel]
            const termNameList = Object.keys(termList)
            const termName = termNameList[Math.floor(Math.random() * termNameList.length)]
            const termValue = termList[termName]
            database.ref(`room/${this.props.room.id}`).update({
                "enemyHp": enemyHp,
                "enemy": {
                    "hp": enemyHp,
                    "image": enemyImage,
                    "next": next
                },
                "effect": "syoukan5.gif",
                "game": true,
                "battle": true,
                "term": {
                    "name": termName,
                    "value": termValue
                }
            })
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.game || this.props.room.playerNum == 1 || this.props.room.playerNum == this.state.currentPlayerNum
                        ? ""
                        : <div>
                            <div className="card" style={{ position: "fixed", top: "5%", bottom: "5%", left: "5%", right: "5%", zIndex: 10 }}>
                                <div className="card-body text-center">
                                    <div className="text-center" style={{ position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)", WebkitTransform: "translateY(-50%) translateX(-50%)" }}>
                                        <div className="h1">人数が集まるまでお待ちください。</div>
                                        <div>現在：{this.state.currentPlayerNum}/{this.props.room.playerNum}人</div>
                                    </div>
                                </div>
                                <div className="card-footer text-center">
                                    <HomeButton />
                                </div>
                                <div className="card-footer"></div>
                            </div>
                        </div>

                }
            </div>
        )
    }
}

export default StandBy