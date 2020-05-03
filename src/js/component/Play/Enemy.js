import React from "react"

class EnemyImage extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        var effectImage = (<div></div>)
        if (this.props.effect != "") {
            effectImage = (<img src={`../../../image/effect/${this.props.effect}`} style={{ zIndex: 10, position: "absolute", left: 0, right: 0, margin: "auto" }} />)
        }
        return (
            <div>
                <img src={`../../../image/enemy/enemy1.png`} style={{ height: `${this.props.max / 2.5}px` }} />
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
        return (
            <div>
                <meter min="0" max="" low="" high="" optimum="" value="" className="w-100"></meter>
            </div>
        )
    }
}

export { EnemyImage, HitPoint }