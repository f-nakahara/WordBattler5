import React from "react"
import firebase from "firebase"

class Stage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "enemy": {
                "hp": "",
                "image": "",
                "next": "2"
            }
        }
    }

    componentWillMount() {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorRoom(roomRef)
        this.getEnemyNext(roomRef)
    }

    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "enemy") this.changeEnemyNext(snapshot.val())
        })
    }

    getEnemyNext(roomRef) {
        roomRef.child("enemy").once("value", (snapshot) => {
            this.setState({
                "enemy": {
                    "next": snapshot.val().next
                }
            })
        })
    }

    changeEnemyNext(value) {
        var enemy = this.state.enemy
        enemy.next = value.next
        this.setState(enemy)
    }

    render() {
        return (
            <div>
                <h1 className="w-100 text-danger">ステージ{parseInt(this.state.enemy.next) - 1}</h1>
            </div>
        )
    }
}

export default Stage