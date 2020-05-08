import React from "react"
import Header from "./Header"
import TabContent from "./Ranking/TabContent"
import EventListener from "react-event-listener"
import HomeButton from "./Ranking/HomeButton"
import { withRouter } from "react-router-dom"

class Ranking extends React.Component {
    constructor(props) {
        try {
            super(props)
            this.state = {
                "tabToggle": "tab-1",
                "window": {
                    "height": window.innerHeight,
                    "width": window.innerWidth,
                    "max": (window.innerHeight >= window.innerWidth) ? window.innerWidth : innerHeight
                }
            }
        }
        catch (e) {
            const link = "/"  // 移動先のURL
            this.props.history.push({
                pathname: link,
                state: {
                    "playerName": "",
                    "playerId": "",
                    "roomId": "",
                    "roomName": ""
                }
            })
        }
    }
    handleToggle(target) {
        var oldTarget = this.state.tabToggle
        var newTarget = target
        this.setState({
            "tabToggle": newTarget
        })
        var oldElement = document.getElementById(oldTarget)
        var newElement = document.getElementById(newTarget)
        oldElement.classList.remove("active", "btn-primary")
        newElement.classList.add("active", "btn-primary")
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
                <Header />
                <EventListener target="window" onResize={this.handleResize.bind(this)} />
                <ul className="nav nav-tabs">
                    <li className="nav-item w-25 p-1">
                        <button id="tab-1" className="nav-link btn-primary active w-100" onClick={this.handleToggle.bind(this, "tab-1")}>タブ1</button>
                    </li>
                    <li className="nav-item w-25 p-1">
                        <button id="tab-2" className="nav-link w-100" onClick={this.handleToggle.bind(this, "tab-2")}>タブ1</button>
                    </li>
                    <li className="nav-item w-25 p-1">
                        <button id="tab-3" className="nav-link w-100" onClick={this.handleToggle.bind(this, "tab-3")}>タブ1</button>
                    </li>
                    <li className="nav-item w-25 p-1">
                        <button id="tab-4" className="nav-link w-100" onClick={this.handleToggle.bind(this, "tab-4")}>タブ1</button>
                    </li>
                </ul>
                <div className="tab-content">
                    <TabContent tab="tab-1" target={this.state.tabToggle} window={this.state.window} />
                    <TabContent tab="tab-2" target={this.state.tabToggle} window={this.state.window} />
                    <TabContent tab="tab-3" target={this.state.tabToggle} window={this.state.window} />
                    <TabContent tab="tab-4" target={this.state.tabToggle} window={this.state.window} />
                </div>
                <div className="text-center m-3">
                    <HomeButton />
                </div>
            </div>
        )
    }
}

export default withRouter(Ranking)