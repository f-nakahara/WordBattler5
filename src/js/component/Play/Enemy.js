import React from "react"

class EnemyImage extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        var effectImage = (<div></div>)
        var enemyImage = (<div></div>)
        if (this.props.effect.value != null && this.props.effect.value != "") {
            effectImage = (<img src={`../../../image/effect/${this.props.effect.value}`} style={{ zIndex: 10, position: "absolute", left: 0, right: 0, margin: "auto" }} />)
        }
        if (this.props.enemy.image != null && this.props.enemy.image != "") {
            enemyImage = (<img src={`../../../image/enemy/${this.props.enemy.image}`} style={{ height: `${this.props.window.max / 2.5}px` }} />)
        }
        return (
            <div>
                {enemyImage}
                {effectImage}
            </div>
        )
    }
}

class HitPoint extends React.Component {
    constructor(props) {
        super(props)
    }


    render() {
        console.log(this.props.enemy)
        return (
            <div>
                <meter min="0" max={this.props.enemy.maxHp} low={this.props.enemy.maxHp / 4} high={this.props.enemy.maxHp / 4 * 3} optimum={this.props.enemy.maxHp} value={this.props.enemy.hp} className="w-100"></meter>
            </div>
        )
    }
}

export { EnemyImage, HitPoint }