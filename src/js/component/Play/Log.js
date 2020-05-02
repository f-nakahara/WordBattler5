import React from "react"
import EventListener from "react-event-listener"

class Log extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "height": window.innerHeight,
            "width": window.innerWidth
        }
    }

    componentDidMount() {
        var element = document.getElementById("lastLog")
        element.scrollIntoView({
            behavior: "smooth"
        })
    }

    handleResize() {
        this.setState({
            "height": window.innerHeight,
            "width": window.innerWidth
        })
    }

    render() {
        return (
            <div>
                <EventListener target="window" onResize={this.handleResize.bind(this)} />
                <div className="card">
                    <div className="card-header text-center">
                        <div className="h3">ログ</div>
                    </div>
                    <div
                        className="card-body"
                        style={{
                            height: `${this.state.height / 4}px`,
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