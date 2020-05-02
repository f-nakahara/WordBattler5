import React from "react"

class Form extends React.Component {
    render() {
        return (
            <div>
                <div className="form-inline">
                    <input className="form-control"></input>
                    <input type="submit" value="送信"></input>
                </div>
            </div>
        )
    }
}

export default Form