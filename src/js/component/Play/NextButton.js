import React from "react"
import { withRouter } from "react-router-dom"

class NextButton extends React.Component {
    render() {
        return (
            <div>
                <button className="btn btn-secondary">次に進む</button>
            </div>
        )
    }
}

export default NextButton