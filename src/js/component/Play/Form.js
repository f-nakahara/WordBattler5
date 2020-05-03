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

    // 攻撃処理
    doAttack(e) {
        e.preventDefault()
        const keyword = this.state.keyword
        const theme = "神様"
        const api = `http://localhost:5000/play/attack?theme=${theme}&keyword=${keyword}`
        axios.get(api)
            .then((res) => {
                const damage = parseInt(res.data.damage * 100)
                var database = firebase.database()
                var roomRef = database.ref("room/roomId")

                // 敵のHPを削る
                roomRef.once("value", (snapshot) => {
                    const enemyHp = snapshot.val().enemyHp
                    roomRef.update({
                        "enemyHp": ((enemyHp - damage) > 0) ? enemyHp - damage : 0
                    })
                })
            })
        this.setState({
            "keyword": ""
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
                        onClick={this.doAttack.bind(this)}
                    >
                    </input>
                </form>
            </div>
        )
    }
}

export default Form