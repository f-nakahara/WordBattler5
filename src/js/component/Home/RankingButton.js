import React from "react"
import { withRouter } from "react-router-dom"

class RankingButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    handleClick() {
        const link = "/ranking"  // 移動先のURL
        this.props.history.push({
            pathname: link
        })
    }

    render() {
        return (
            <div>
                <button className="btn btn-lg btn-warning w-100" onClick={this.handleClick.bind(this)}>ランキング</button>
            </div>
        )
    }
}

export default withRouter(RankingButton)