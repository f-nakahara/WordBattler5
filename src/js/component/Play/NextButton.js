import React from "react"
import { withRouter } from "react-router-dom"
import firebase from "firebase"

class NextButton extends React.Component {
    constructor(props) {
        super(props)
    }


    handleClick() {
        const roomId = this.props.room.id
        const diffLevel = this.props.room.diffLevel
        var next = this.props.enemy.next

        var database = firebase.database()
        var EnemyRef = database.ref(`enemy/${next}`).once("value", (snapshot) => {
            if (snapshot.val() != null) {
                const enemyHp = snapshot.val().hp[diffLevel]
                const enemyImage = snapshot.val().image
                next = snapshot.val().next
                const term = snapshot.val().term[diffLevel]
                const termNameList = Object.keys(term)
                const termName = termNameList[Math.floor(Math.random() * termNameList.length)]
                const termValue = term[termName]
                database.ref(`room/${roomId}`).update({
                    "term": {
                        "name": termName,
                        "value": termValue
                    },
                    "enemy": {
                        "hp": enemyHp,
                        "image": enemyImage,
                        "next": next
                    }
                })
            }
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