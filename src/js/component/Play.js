import React from "react"
import Header from "./Header"
import Log from "./Play/Log"
import Term from "./Play/Term"
import Form from "./Play/Form"

class Play extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        // const playerName = this.props.location.state.playerName

        return (
            <div>
                <Header playerName="koudai" roomName="渕田研究室" />
                <div className="row">
                    <div className="col-4">
                        <Term />
                    </div>
                    <div className="col-4">
                        <h1>ステージ1</h1>
                    </div>
                    <div className="col-4">
                        <Log />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12 form-inline">
                        <input className="form-control"></input>
                    </div>
                </div>
            </div>
        )
    }
}

export default Play