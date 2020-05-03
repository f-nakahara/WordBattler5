import React from "react"

class EnemyImage extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <img src={`../../../image/enemy/enemy_1DJTZRy.png`} style={{ height: `${this.props.max / 2.5}px` }} />
                <img src={`../../../image/effect/big1.gif`} style={{ zIndex: 10, position: "absolute", left: 0, right: 0, margin: "auto" }} />
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