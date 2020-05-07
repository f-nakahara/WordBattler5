import React from "react"
import firebase from "firebase"

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
        this.getGame(roomRef)
    }

    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "player") this.changeGame(snapshot.val())
        })
    }

    getGame(roomRef) {
        roomRef.child("game").once("value", (snapshot) => {
            this.setState({
                "game": snapshot.val()
            })
            if (this.props.room.playerNum == 1) {
                this.initProcess()
                this.setState({
                    "game": true
                })
            }
        })
    }

    changeGame(value) {
        var currentPlayerNum = Object.keys(value).length
        if (currentPlayerNum == this.props.room.playerNum || !this.state.game) {
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
            // database.ref(`room/${this.props.room.id}`).update({
            //     "enemyHp": enemyHp,
            //     "enemy": {
            //         "hp": enemyHp,
            //         "image": enemyImage,
            //         "next": next
            //     },
            //     "effect": "syoukan5.gif",
            //     "game": true,
            //     "term": {
            //         "name": termName,
            //         "value": termValue
            //     }
            // })
            var themeRef = firebase.database().ref("theme")
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.game
                        ? ""
                        : <div>
                            <div className="card" style={{ position: "fixed", top: "10%", bottom: "10%", left: "10%", right: "10%", zIndex: 10 }}>
                                <div className="card-body">
                                    <div className="h1">人数が集まるまでお待ちください。</div>
                                    <div>現在：{this.state.currentPlayerNum}/{this.props.room.playerNum}人</div>
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