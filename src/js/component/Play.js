import React from "react"

class Play extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <div>{this.props.location.state.mode}</div>
                <div>{this.props.location.state.playerName}</div>
            </div>
        )
    }
}

export default Play