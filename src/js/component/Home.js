import React from "react"
import Header from "./Header"
import Introduction from "./Home/Introduction"
import CreateRoomButton from "./Home/CreateRoomButton"
import JoinRoomButton from "./Home/JoinRoomButton"
import EventListener from "react-event-listener"
import RankingButton from "./Home/RankingButton"

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "window": {
                "height": window.innerHeight,
                "width": window.innerWidth,
                "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
            }
        }
    }

    // 画面サイズ変更時実行
    handleResize() {
        this.setState({
            "window": {
                "height": window.innerHeight,
                "width": window.innerWidth,
                "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
            }
        })
    }
    render() {
        return (
            <div>
                <EventListener target="window" onResize={this.handleResize.bind(this)} />
                <Header />
                <div className="row mt-2">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <Introduction />
                    </div>
                    <div className="col-2"></div>
                </div>
                <div className="row mt-3">
                    <div className="col-3"></div>
                    <div className="col-3 p-1"><CreateRoomButton /></div>
                    <div className="col-3 p-1"><JoinRoomButton window={this.state.window} /></div>
                    <div className="col-3"></div>

                    <div className="col-3"></div>
                    <div className="col-6 p-1"><RankingButton /></div>
                    <div className="col-3"></div>
                </div>
            </div>
        )
    }
}

export default Home