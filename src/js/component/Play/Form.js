import React from "react"
import axios from "axios"
import firebase from "firebase"
import filter from "filter"

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
        const theme = this.props.theme
        const api = `http://localhost:5000/play/attack?theme=${theme}&keyword=${keyword}`
        axios.get(api)
            .then((res) => {
                const damage = parseInt(res.data.damage * 100)
                this.damageProcess(damage)
                this.effectProcess(damage)
                this.logProcess(keyword, theme, damage)
            })
        this.setState({
            "keyword": ""
        })
    }

    // ログ処理
    logProcess(keyword, theme, damage) {
        var database = firebase.database()
        const playerId = this.props.playerId
        database.ref(`player/${playerId}/log`).push({
            "damage": damage,
            "keyword": keyword,
            "theme": theme
        })
    }

    // 攻撃処理
    damageProcess(damage) {
        var database = firebase.database()
        const playerId = this.props.playerId
        const roomId = this.props.roomId
        var roomRef = database.ref(`room/${roomId}`)
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
        const roomId = this.props.roomId
        var roomRef = database.ref(`room/${roomId}`)
        var effectList = this.props.effectList

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
                    return value.match(/kaihuku/) && oldEffect != value
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

    // お題の変更
    changeTheme() {

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
        return (
            <div>
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
            </div>
        )
    }
}

export default Form