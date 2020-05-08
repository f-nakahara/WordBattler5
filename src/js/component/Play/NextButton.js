import React from "react"
import firebase from "firebase"

class NextButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "enemy": {
                "hp": "",
                "image": "",
                "next": ""
            },
            "enemyHp": "",
            "term": {
                "name": "",
                "value": ""
            }
        }
    }

    componentWillMount() {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorRoom(roomRef)
        this.getEnemy(roomRef)
        this.getEnemyHp(roomRef)
        this.getTerm(roomRef)
    }

    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "enemy") this.changeEnemy(snapshot.val())
        })
    }

    // 敵の取得
    getEnemy(roomRef) {
        roomRef.child("enemy").once("value", (snapshot) => {
            var enemy = this.state.enemy
            enemy.next = snapshot.val().next
            enemy.hp = snapshot.val().hp
            enemy.image = snapshot.val().image
            this.setState(enemy)
            this.changeEnemy(snapshot.val())
        })
    }

    // 条件の取得
    getTerm(roomRef) {
        roomRef.child("term").once("value", (snapshot) => {
            var term = this.state.term
            term.name = snapshot.val().name
            term.value = snapshot.val().value
            this.setState(term)
        })
    }

    // 敵体力の取得
    getEnemyHp(roomRef) {
        roomRef.child("enemyHp").once("value", (snapshot) => {
            this.setState({
                "enemyHp": snapshot.val()
            })
        })
    }

    // 敵処理
    enemyProcess() {
        const syoukanEffectList = ["syoukan4.gif", "syoukan5.gif"]
        const syoukanEffect = syoukanEffectList[Math.floor(Math.random() * syoukanEffectList.length)]
        const roomId = this.props.room.id
        var database = firebase.database()
        var roomRef = database.ref(`room/${roomId}`)
        roomRef.update({
            "effect": syoukanEffect,
            "term": {
                "name": this.state.term.name,
                "value": this.state.term.value
            },
            "enemy": {
                "hp": this.state.enemy.hp,
                "image": this.state.enemy.image,
                "next": this.state.enemy.next
            },
            "enemyHp": this.state.enemy.hp,
            "battle": true
        })
    }

    // 的情報の変更
    changeEnemy(value) {
        const next = value.next
        const diffLevel = this.props.room.diffLevel
        var enemyRef = firebase.database().ref("enemy")
        enemyRef.child(`${next}`).once("value", (snapshot) => {
            var enemy = this.state.enemy
            enemy.next = snapshot.val().next
            enemy.hp = snapshot.val().hp[diffLevel]
            enemy.image = snapshot.val().image
            this.setState(enemy)

            this.setState({
                "enemyHp": snapshot.val().hp[diffLevel]
            })

            const termList = snapshot.val().term[diffLevel]
            const termNameList = Object.keys(termList)
            const termName = termNameList[Math.floor(Math.random() * termNameList.length)]
            const termValue = termList[termName]
            var term = this.state.term
            term.name = termName
            term.value = termValue
            this.setState(term)
        })
    }


    handleClick() {
        this.enemyProcess()
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