import React from "react"
import axios from "axios"
import firebase from "firebase"

class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "keyword": ""
        }
    }

    // 描画完了後に実行
    componentDidMount() {
        this.focusAttackInput()
    }

    handleAttackSubmit(e) {
        e.preventDefault()
        const keyword = this.state.keyword
        const theme = this.props.theme.value
        const api = `http://localhost:5000/play/attack?theme=${theme}&keyword=${keyword}`
        axios.get(api)
            .then((res) => {
                const damage = parseInt(res.data.damage * 100)
                this.termProcess()
                this.damageProcess(damage)
                this.effectProcess(damage)
                this.logProcess(keyword, theme, damage)
            })
        this.setState({
            "keyword": ""
        })
    }

    // 条件処理
    termProcess() {
        var termName = this.props.term.name
        var termValue = this.props.term.value
        if (termName == "count") {
            var database = firebase.database()
            const roomId = this.props.room.id
            var roomRef = database.ref(`room/${roomId}`)
            roomRef.child(`term`).update({
                "value": termValue - 1
            })
        }
    }

    // ログ処理
    logProcess(keyword, theme, damage) {
        var database = firebase.database()
        const roomId = this.props.room.id
        var roomRef = database.ref(`room/${roomId}`)
        const playerId = this.props.player.id
        const playerName = this.props.player.name
        database.ref(`player/${playerId}/log`).push({
            "damage": damage,
            "keyword": keyword,
            "theme": theme
        })
        roomRef.child(`log`).push({
            "damage": damage,
            "keyword": keyword,
            "theme": theme,
            "player": {
                "id": playerId,
                "name": playerName
            }
        })
    }

    // 攻撃処理
    damageProcess(damage) {
        var database = firebase.database()
        const roomId = this.props.room.id
        var roomRef = database.ref(`room/${roomId}`)
        const playerId = this.props.player.id
        var playerRef = database.ref(`player/${playerId}`)
        playerRef.update({
            "damage": damage
        })

        // 敵のHPを削る
        roomRef.once("value", (snapshot) => {
            const enemyHp = snapshot.val().enemyHp
            roomRef.update({
                "enemyHp": ((enemyHp - damage) > 0) ? enemyHp - damage : 0
            })
        })

    }

    // エフェクト処理
    effectProcess(damage) {
        var database = firebase.database()
        const roomId = this.props.room.id
        var roomRef = database.ref(`room/${roomId}`)
        var effectList = (this.props.effect.list != null) ? this.props.effect.list : []

        roomRef.once("value", (snapshot) => {
            const oldEffect = snapshot.val().effect
            const newEffectList = effectList.filter((value) => {
                if (damage >= 60) {
                    return value.match(/big/) && oldEffect != value
                }
                else if (damage > 0) {
                    return value.match(/min/) && oldEffect != value
                }
                else if (damage < 0) {
                    return value.match(/kaihuku/)
                }
                else {
                    return value.match(/mukou/) && oldEffect != value
                }
            })
            const newEffect = newEffectList[Math.floor(Math.random() * newEffectList.length)]

            roomRef.update({
                "effect": newEffect
            })
        })
    }

    // キーワード変更
    changeKeyword(e) {
        const keyword = e.target.value
        this.setState({
            "keyword": keyword
        })
    }

    // インプットフォームにフォーカスをあてる
    focusAttackInput() {
        const element = document.getElementById("keywordInput")
        element.focus()
    }

    render() {
        var playerForm
        if (this.props.player.form) {
            playerForm = (
                <form className="form-inline">
                    <input
                        id="keywordInput"
                        value={this.state.keyword}
                        className="form-control w-75"
                        onChange={this.changeKeyword.bind(this)}
                    >

                    </input>
                    <input
                        type="submit"
                        value="送信"
                        className="btn btn-danger w-25"
                        onClick={this.handleAttackSubmit.bind(this)}
                    >
                    </input>
                </form>
            )
        }
        else {
            playerForm = (
                <form className="form-inline">
                    <input
                        id="keywordInput"
                        value={this.state.keyword}
                        className="form-control w-75"
                        onChange={this.changeKeyword.bind(this)}
                        disabled
                    >

                    </input>
                    <input
                        type="submit"
                        value="送信"
                        className="btn btn-danger w-25"
                        onClick={this.handleAttackSubmit.bind(this)}
                        disabled
                    >
                    </input>
                </form>
            )
        }
        return (
            <div>
                {playerForm}
            </div>
        )
    }
}

export default Form