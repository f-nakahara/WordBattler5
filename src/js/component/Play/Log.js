import React from "react"

class Log extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var element = document.getElementById("lastLog")
        element.scrollIntoView({
            behavior: "smooth"
        })
    }

    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-header text-center">
                        <div className="h3">ログ</div>
                    </div>
                    <div
                        className="card-body"
                        style={{
                            height: `${this.props.max / 5}px`,
                            overflow: "scroll"
                        }}
                    >
                        <h1>aaaaaaaaaaaaaaaaaa</h1><h1>a</h1><h1>a</h1><h1>a</h1><h1 id="lastLog">a</h1>
                    </div>
                </div>
            </div>
        )
    }
}

export default Log