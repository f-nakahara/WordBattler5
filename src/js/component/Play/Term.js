import React from "react"

class Term extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const termName = (this.props.term.name == "count") ? "回数制限" : "制限時間"
        const termValue = (this.props.term.name == "time") ? `${this.props.term.value}秒` : `${this.props.term.value}回`
        return (
            <div>
                <div className="card">
                    <div className="card-header text-center">
                        <div className="h3">{termName}</div>
                    </div>
                    <div className="card-body text-center">
                        <h5>{termValue}</h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default Term