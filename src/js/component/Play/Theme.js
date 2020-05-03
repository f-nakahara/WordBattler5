import React from "react"

class Theme extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <div className="card card-body bg-success">
                    <h2 className="text-light">{this.props.theme}</h2>
                </div>
            </div>
        )
    }
}

export default Theme