import React from "react"
import firebase from "firebase"

class Log extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "log": []
        }
    }

    // 描画前
    componentWillMount() {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorRoom(roomRef)
        this.getLogList()
    }

    // 描画後
    componentDidUpdate() {
        this.runLogAnimation()
    }

    // room/<roomId>を監視する
    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "log") {
                Promise.resolve()
                    .then(() => this.changeLog(snapshot.val()))
                    .then(() => this.runLogAnimation())
            }
        })
    }

    // ログを一番下までアニメーションさせる
    runLogAnimation() {
        if (this.state.log.length >= 1) {
            var element = document.getElementById("lastLog")
            element.scrollIntoView({
                behavior: "smooth"
            })
        }
    }

    // ログの取得
    getLogList() {
        firebase.database().ref(`room/${this.props.room.id}/log`).once("value", (snapshot) => {
            this.changeLog(snapshot.val())
        })
    }

    // ログ変更
    changeLog(value) {
        var log = []
        for (var key in value) {
            if (value[key]["player"]["id"] == this.props.player.id)
                log.push(value[key])
        }
        this.setState({
            "log": log
        })
    }

    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-header text-center">
                        <div className="h3">ログ</div>
                    </div>
                    <div
                        className="card-body"
                        style={{
                            height: `${this.props.window.max / 5}px`,
                            overflow: "scroll"
                        }}
                    >
                        {this.state.log.map(function (value, index, array) {
                            const logMsg = `●【${value.theme}】<=【${value.keyword}】`
                            const damage =
                                (value.damage >= 60) ? (<span className="text-danger">{value.damage}の大ダメージを与えた！！</span>) :
                                    (value.damage < 0) ? (<span className="text-primary">{value.damage}回復させてしまった・・・</span>) :
                                        (value.damage == 0) ? (<span>効果はないようだ・・・</span>) :
                                            (<span>{value.damage}ダメージ</span>)
                            if (index == array.length - 1)
                                return (<div key={index} id="lastLog">{logMsg}<br></br>{damage}</div>)
                            else
                                return (<div key={index}>{logMsg}<br></br>{damage}<br></br></div>)
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default Log