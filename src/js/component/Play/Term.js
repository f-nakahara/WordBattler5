import React from "react"
import firebase from "firebase"

class Term extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "term": {
                "name": "",
                "value": ""
            },
            "battle": true
        }
    }

    componentWillMount() {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorRoom(roomRef)
        this.getTerm(roomRef)
    }

    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "enemy") this.getTerm(roomRef)
            else if (key == "term") {
                this.changeTermValue(snapshot.val())
            }
            else if (key == "battle")
                this.changeBattle(snapshot.val())
        })
    }

    // 条件の取得
    getTerm(roomRef) {
        roomRef.child(`term`).once("value", (snapshot) => {
            var term = this.state.term
            term.name = snapshot.val().name
            term.value = snapshot.val().value
            if (term.value <= 0) {
                term.value = 0
                this.changeBattle(false)
            }
            this.setState({ term })
            if (snapshot.val().name == "time" && term.value > 0) {
                this.timeProcess(roomRef, snapshot.val().value)
            }
        })
    }

    // 制限時間の制御
    timeProcess(roomRef, value) {
        var time = value
        var timer = setInterval(() => {
            time -= 1
            var term = this.state.term
            term.value = time
            this.setState(term)
            if (time <= 0 || !this.state.battle) {
                clearInterval(timer)
                roomRef.child("term").update({
                    "value": time
                })
                term.value = time
                this.setState(term)
                this.battleProcess(false)
            }
        }, 1000)
    }

    // バトル制御
    battleProcess(value) {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        roomRef.update({
            "battle": value
        })
    }

    // 条件の変更
    changeTermValue(value) {
        var term = this.state.term
        var termName = value.name
        var termValue = value.value
        if (termValue <= 0) {
            termValue = 0
            this.battleProcess(false)
        }
        term.name = termName
        term.value = termValue
        this.setState(term)
    }

    // バトルの変更
    changeBattle(value) {
        this.setState({
            "battle": value
        })
    }

    render() {
        const termName = (this.state.term.name == "count") ? "回数制限" : "制限時間"
        const termValue = (this.state.term.name == "time") ? `${this.state.term.value}秒` : `${this.state.term.value}回`
        return (
            <div>
                <div className="card">
                    <div className="card-header text-center">
                        <div className="h3">{termName}</div>
                    </div>
                    <div className="card-body text-center">
                        <h5>{termValue}</h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default Term