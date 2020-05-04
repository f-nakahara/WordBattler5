import React from "react"
import { withRouter } from "react-router-dom"

class HomeButton extends React.Component {
    constructor(props) {
        super(props)
    }

    handleClick() {
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

    render() {
        return (
            <div>
                <button className="btn btn-secondary" onClick={this.handleClick.bind(this)}>ホームに戻る</button>
            </div>
        )
    }
}

export default withRouter(HomeButton)