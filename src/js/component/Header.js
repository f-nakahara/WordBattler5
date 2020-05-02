import React from "react"

class Header extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const roomName = this.props.roomName
        const playerName = this.props.playerName
        return (
            <div className="bg-dark p-3">
                <div className="row">
                    <div className="col-12">
                        <div className="display-3 text-light text-center">WordBattler5</div>
                    </div>
                    <div className="col-6">
                        <div className="text-center text-danger h3">{roomName}</div>
                    </div>
                    <div className="col-6">
                        <div className="text-center text-danger h3">{playerName}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header