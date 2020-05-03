import React from "react"

class EnemyImage extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <img src={`../../../../image/enemy/enemy_1DJTZRy.png`} style={{ height: `${this.props.max / 2.5}px` }} />
            </div>
        )
    }
}

class HitPoint extends React.Component {
    render() {
        return (
            <div>
                <meter min="0" max="" low="" high="" optimum="" value="" className="w-100"></meter>
            </div>
        )
    }
}

export { EnemyImage, HitPoint }