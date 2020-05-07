import React from "react"
import firebase from "firebase"

class Theme extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "theme": {
                "list": [],
                "value": ""
            }
        }
    }

    // 描画前に実行
    componentWillMount() {
        var playerRef = firebase.database().ref(`player/${this.props.player.id}`)
        this.monitorPlayer(playerRef)
        this.getTheme(playerRef)
    }

    monitorPlayer(playerRef) {
        playerRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "theme") this.changeThemeValue(snapshot.val())
        })
    }

    // お題の取得
    getTheme(playerRef) {
        playerRef.child("theme").once("value", (snapshot) => {
            var theme = this.state.theme
            theme.value = snapshot.val()
            this.setState(theme)
        })
    }

    // お題の変更
    changeThemeValue(value) {
        var theme = this.state.theme
        theme.value = value
        this.setState(theme)
    }

    render() {
        return (
            <div>
                <div className="card card-body bg-success">
                    <h2 className="text-light">{this.state.theme.value}</h2>
                </div>
            </div>
        )
    }
}

export default Theme