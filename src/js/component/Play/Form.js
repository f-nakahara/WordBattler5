import React from "react"

class Form extends React.Component {
    render() {
        return (
            <div>
                <form className="form-inline">
                    <input className="form-control w-75"></input>
                    <input type="submit" value="送信" className="btn btn-danger w-25"></input>
                </form>
            </div>
        )
    }
}

export default Form