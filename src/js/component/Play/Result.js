import React from "react"
import firebase from "firebase"
import NextButton from "./NextButton"
import HomeButton from "./HomeButton"

class Result extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var result = (<div></div>)
        if (this.props.player.result && this.props.enemy.next !== "clear") {
            result = (<div className="card" style={{ position: "fixed", top: "20%", bottom: "20%", left: "10%", right: "10%" }}>
                <div className="card-header text-center">
                    <div className="display-3">RESULT</div>
                </div>
                <div className="card-body text-center">
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)", WebkitTransform: "translateY(-50%) translateX(-50%)" }}>
                        <h4>あなたのスコア</h4>
                        <h2>{this.props.player.score}pt</h2>
                        <h4>チームのスコア</h4>
                        <h1>{this.props.room.score}pt</h1>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-6 text-right">
                            <HomeButton />
                        </div>
                        <div className="col-6 text-left">
                            <NextButton enemy={this.props.enemy} room={this.props.room} />
                        </div>
                    </div>
                </div>
            </div>)
        }
        else if (this.props.player.result && this.props.enemy.next === "clear") {
            result = (<div className="card" style={{ position: "fixed", top: "20%", bottom: "20%", left: "10%", right: "10%" }}>
                <div className="card-header text-center">
                    <div className="display-3">RESULT</div>
                </div>
                <div className="card-body text-center">
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)", WebkitTransform: "translateY(-50%) translateX(-50%)" }}>
                        <div className="h1 text-danger">CLEAR!!</div>
                        <br></br>
                        <h4>あなたのスコア</h4>
                        <h2>{this.props.player.score}pt</h2>
                        <h4>チームのスコア</h4>
                        <h1>{this.props.room.score}pt</h1>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-12 text-center">
                            <HomeButton />
                        </div>
                    </div>
                </div>
            </div >)
        }
        return (
            <div>
                {result}
            </div>
        )
    }
}

export default Result