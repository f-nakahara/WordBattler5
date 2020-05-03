import React from "react"
import Header from "./Header"
import Log from "./Play/Log"
import Term from "./Play/Term"
import Form from "./Play/Form"
import EventListener from "react-event-listener"
import Theme from "./Play/Theme"
import { HitPoint, EnemyImage } from "./Play/Enemy"


class Play extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "height": window.innerHeight,
            "width": window.innerWidth,
            "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
        }
    }

    handleResize() {
        this.setState({
            "height": window.innerHeight,
            "width": window.innerWidth,
            "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
        })
    }

    render() {
        // const playerName = this.props.location.state.playerName

        return (
            <div style={{ backgroundImage: `url(../../../../image/background/doukutu.png)`, backgroundSize: "cover", height: `${this.state.height}px` }}>
                <EventListener target="window" onResize={this.handleResize.bind(this)} />
                <Header playerName="koudai" roomName="渕田研究室" />
                {/* <img src={`${window.location.origin}/../../../image/background/doukutu.png`} /> */}
                <div className="row m-3">
                    <div className="col-3">
                        <Term />
                    </div>
                    <div className="col-6 text-center">
                        <h1 className="w-100">ステージ1</h1>
                        <EnemyImage max={this.state.max} />
                        <Theme />
                    </div>
                    <div className="col-3">
                        <Log max={this.state.max} />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <HitPoint />
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-12">
                        <Form />
                    </div>
                </div>
            </div>
        )
    }
}

export default Play