import React from "react"
import firebase from "firebase"
import Sound from "react-sound"
soundManager.setup({
    "debugMode": false,
    "ignoreMobileRestrictions": true
})

class EnemyImage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "playStatus": Sound.status.PAUSED,
            "enemy": {
                "hp": "",
                "image": "enemy1.png",
                "next": "2"
            },
            "effect": {
                "list": [],
                "value": "syoukan4.gif",
            }
        }
    }

    // 描画前に実行
    componentWillMount() {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorRoom(roomRef)
        this.getEnemyImage(roomRef)
        this.getEffectValue(roomRef)
    }

    // room/<roomId>の監視
    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "effect") {
                this.changeEffectImage(snapshot.val())
            }
            else if (key == "enemy") this.changeEnemyImage(snapshot.val())
        })
    }

    // エフェクトの取得
    getEffectValue(roomRef) {
        roomRef.child("effect").once("value", (snapshot) => {
            var effect = this.state.effect
            effect.value = snapshot.val()
            this.setState(effect)
        })
    }

    // 敵画像の取得
    getEnemyImage(roomRef) {
        roomRef.child("enemy").once("value", (snapshot) => {
            var enemy = this.state.enemy
            enemy.image = snapshot.val().image
            this.setState(enemy)
        })
    }

    // 敵画像の変更
    changeEnemyImage(value) {
        var enemy = this.state.enemy
        enemy.image = value.image
        this.setState(enemy)
    }

    // エフェクトの変更
    changeEffectImage(value) {
        var effect = this.state.effect
        effect.value = value
        this.setState({ effect })
        this.runEffectSound()
    }

    // 効果音の実行
    runEffectSound() {
        var effectValue = this.state.effect.value
        // 召喚エフェクト時は無視
        if (!effectValue.match(/syoukan/) && effectValue != null) {
            this.setState({
                "playStatus": Sound.status.PLAYING
            })
        }
        else {
            this.setState({
                "playStatus": Sound.status.PAUSED
            })
        }
    }

    render() {
        return (
            <div>
                <img src={`../../../image/enemy/${this.state.enemy.image}`} style={{ height: `${this.props.window.max / 2.5}px` }} />
                <img src={`../../../image/effect/${this.state.effect.value}`} style={{ zIndex: 10, position: "absolute", left: 0, right: 0, margin: "auto" }} />
                <Sound
                    url="../../../audio/gun1.mp3"
                    playStatus={this.state.playStatus}
                    style={{ display: "none" }}
                />
            </div>
        )
    }
}

class HitPoint extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "enemy": {
                "hp": "",
                "maxHp": ""
            }
        }
    }

    // 描画前
    componentWillMount() {
        var roomRef = firebase.database().ref(`room/${this.props.room.id}`)
        this.monitorRoom(roomRef)
        this.getEnemyHp(roomRef)
    }

    // room/<roomId>の監視
    monitorRoom(roomRef) {
        roomRef.on("child_changed", (snapshot) => {
            const key = snapshot.key
            if (key == "enemyHp") this.changeEnemyHp(snapshot.val())
            else if (key == "enemy") this.changeEnemyMaxHp(snapshot.val())
        })
    }

    // 敵取得
    getEnemyHp(roomRef) {
        roomRef.once("value", (snapshot) => {
            var enemy = this.state.enemy
            enemy.hp = snapshot.val().enemyHp
            enemy.maxHp = snapshot.val().enemy.hp
            this.setState(enemy)
        })
    }

    // 敵体力の変更
    changeEnemyHp(value) {
        var enemy = this.state.enemy
        enemy.hp = value
        this.setState(enemy)
    }

    // 敵の最大体力の変更
    changeEnemyMaxHp(value) {
        var enemy = this.state.enemy
        enemy.maxHp = value.hp
        enemy.hp = value.hp
        this.setState(enemy)
    }

    render() {
        return (
            <div>
                <meter
                    min="0" max={this.state.enemy.maxHp}
                    low={this.state.enemy.maxHp / 4}
                    high={this.state.enemy.maxHp / 4 * 3}
                    optimum={this.state.enemy.maxHp}
                    value={this.state.enemy.hp}
                    className="w-100"
                >
                </meter>
            </div>
        )
    }
}

export { EnemyImage, HitPoint }