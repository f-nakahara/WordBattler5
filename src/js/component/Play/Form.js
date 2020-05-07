import React from "react"
import axios from "axios"
import firebase from "firebase"

class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "keyword": "",
            "formState": true,
            "effect": {
                "list": [],
                "value": ""
            },
            "theme": {
                "list": [],
                "value": ""
            },
            "enemy": {
                "hp": "",
                "image": "",
                "next": ""
            },
            "term": {
                "name": "",
                "value": ""
            }
        }
    }

    componentWillMount() {
        var playerRef = firebase.database().ref(`player/${this.props.player.id}`)
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorPlayer(playerRef)
        this.monitorRoom(roomRef)
        this.getEffectList()
        this.getThemeList()
    }

    // 描画完了後に実行
    componentDidMount() {
        this.focusAttackInput()
    }

    // player/<playerId>の監視
    monitorPlayer(playerRef) {
        playerRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "theme") this.changeThemeValue(snapshot.val())
        })
    }

    // room/<roomId>の監視
    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "battle") this.changeFormStatus(snapshot.val())
        })
    }

    // エフェクトリストの取得
    getEffectList() {
        var effectRef = firebase.database().ref("effect")
        effectRef.once("value", (snapshot) => {
            const effectList = snapshot.val()
            var effect = this.state.effect
            effect.list = effectList
            this.setState(effect)
        })
    }

    // お題リストの取得
    getThemeList() {
        var themeRef = firebase.database().ref("theme")
        themeRef.once("value", (snapshot) => {
            const themeList = snapshot.val()
            var theme = this.state.theme
            theme.list = themeList
            this.setState(theme)
        })
    }


    // お題の変更
    changeThemeValue(value) {
        var theme = this.state.theme
        theme.value = value
        this.setState(theme)
    }

    // お題リストの変更
    changeThemeList(value) {
        var theme = this.state.theme
        theme.list = value
        this.setState(theme)
    }

    // フォームの状態チェンジ
    changeFormStatus(value) {
        this.setState({
            "formState": value
        })
    }

    // キーワード変更
    changeKeyword(e) {
        const keyword = e.target.value
        this.setState({
            "keyword": keyword
        })
    }

    // 条件の変更
    changeTermValue(value) {
        var term = this.state.term
        term.value = value
        this.setState(term)
    }

    // 送信ボタン処理
    handleAttackSubmit(e) {
        e.preventDefault()
        const keyword = this.state.keyword
        const theme = this.state.theme.value
        const api = `http://localhost:5000/play/attack?theme=${theme}&keyword=${keyword}`
        axios.get(api)
            .then((res) => {
                const damage = parseInt(res.data.damage * 100)
                this.scoreProcess(damage)
                this.damageProcess(damage)
                this.termProcess()
                this.themeProcess()
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

    // バトル処理
    battleProcess(value) {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        roomRef.update({
            "battle": value
        })
    }

    // 条件処理
    termProcess() {
        if (this.state.term.name == "count") {
            var term = this.state.term
            term.value = term.value - 1
            this.setState(term)
            var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
            roomRef.update({ term })
            if (term.value <= 0)
                this.battleProcess(false)
        }
    }

    // 攻撃処理
    damageProcess(damage) {
        var database = firebase.database()
        const roomId = this.props.room.id
        var roomRef = database.ref(`room/${roomId}`)
        roomRef.once("value", (snapshot) => {
            const enemyHp = snapshot.val().enemyHp
            roomRef.update({
                "enemyHp": ((enemyHp - damage) > 0) ? enemyHp - damage : 0
            })
            if (enemyHp - damage <= 0)
                this.battleProcess(false)
        })

    }

    // スコア処理
    scoreProcess(damage) {
        const playerId = this.props.player.id
        const roomId = this.props.room.id
        var database = firebase.database()
        database.ref(`player/${this.props.player.id}/score`).once("value", (snapshot) => {
            var playerScore = snapshot.val()
            database.ref(`player/${playerId}`).update({
                "score": playerScore + damage
            })
        })
        database.ref(`room/${this.props.room.id}/score`).once("value", (snapshot) => {
            var roomScore = snapshot.val()
            database.ref(`room/${roomId}`).update({
                "score": roomScore + damage
            })
        })
        this.focusAttackInput()
    }

    // お題処理
    themeProcess() {
        var themeList = this.state.theme.list
        if (themeList.length == 0) {
            this.getThemeList()
        }
        else {
            const themeValue = themeList[Math.floor(Math.random() * themeList.length)]
            themeList = themeList.filter(function (value) {
                return value !== themeValue
            })
            var playerRef = firebase.database().ref(`player/${this.props.player.id}`)
            playerRef.update({
                "theme": themeValue
            })
            this.changeThemeList(themeList)
        }
    }

    // エフェクト処理
    effectProcess(damage) {
        this.focusAttackInput()
        var database = firebase.database()
        const roomId = this.props.room.id
        var roomRef = database.ref(`room/${roomId}`)
        var effectList = this.state.effect.list

        roomRef.child("effect").once("value", (snapshot) => {
            const oldEffectValue = snapshot.val()
            const newEffectList = effectList.filter((value) => {
                if (damage >= 60) {
                    return value.match(/big/) && oldEffectValue != value
                }
                else if (damage > 0) {
                    return value.match(/min/) && oldEffectValue != value
                }
                else if (damage < 0) {
                    return value.match(/kaihuku/)
                }
                else {
                    return value.match(/mukou/) && oldEffectValue != value
                }
            })
            const newEffectValue = newEffectList[Math.floor(Math.random() * newEffectList.length)]
            roomRef.update({
                "effect": newEffectValue
            })
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
                {this.state.formState ?
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
                    :
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
                }
            </div>
        )
    }
}

export default Form