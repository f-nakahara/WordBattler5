import React from "react"
import firebase from "firebase"

class NextButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "enemy": {
                "next": "2"
            }
        }
    }

    componentWillMount() {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorRoom(roomRef)
        this.getEnemy(roomRef)
    }

    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "enemy") this.getEnemy(roomRef)
        })
    }

    // 敵の取得
    getEnemy(roomRef) {
        roomRef.child("enemy").once("value", (snapshot) => {
            var enemy = this.state.enemy
            enemy.next = snapshot.val().next
            this.setState(enemy)
        })
    }

    // エフェクト処理
    effectProcess() {
        const syoukanEffectList = ["syoukan4.gif", "syoukan5.gif"]
        const syoukanEffect = syoukanEffectList[Math.floor(Math.random() * syoukanEffectList.length)]
        firebase.database().ref(`room/${this.props.room.id}`).update({
            "effect": syoukanEffect
        })
    }


    handleClick() {
        const roomId = this.props.room.id
        const diffLevel = this.props.room.diffLevel
        var next = this.state.enemy.next
        var database = firebase.database()
        database.ref(`enemy/${next}`).once("value", (snapshot) => {
            const enemyHp = snapshot.val().hp[diffLevel]
            const enemyImage = snapshot.val().image
            next = snapshot.val().next
            const term = snapshot.val().term[diffLevel]
            const termNameList = Object.keys(term)
            const termName = termNameList[Math.floor(Math.random() * termNameList.length)]
            const termValue = term[termName]
            this.effectProcess()
            var roomRef = database.ref(`room/${roomId}`)
            roomRef.update({
                "term": {
                    "name": termName,
                    "value": termValue
                },
                "enemy": {
                    "hp": enemyHp,
                    "image": enemyImage,
                    "next": next
                },
                "enemyHp": enemyHp,
                "battle": true
            })
        })

    }

    render() {
        return (
            <div>
                <button className="btn btn-secondary" onClick={this.handleClick.bind(this)}>次に進む</button>
            </div>
        )
    }
}

export default NextButton