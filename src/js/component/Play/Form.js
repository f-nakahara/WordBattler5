import React from "react"

class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "keyword": ""
        }
    }

    componentDidMount() {
        this.focusAttackInput()
    }

    doAttack(e) {
        e.preventDefault()
        const keyword = this.state.keyword
        this.setState({
            "keyword": ""
        })
    }

    changeKeyword(e) {
        const keyword = e.target.value
        this.setState({
            "keyword": keyword
        })
    }

    focusAttackInput() {
        const element = document.getElementById("keywordInput")
        element.focus()
    }

    render() {
        return (
            <div>
                <form className="form-inline">
                    <input
                        id="keywordInput"
                        value={this.state.keyword}
                        className="form-control w-75"
                        onChange={this.changeKeyword.bind(this)}
                    >

                    </input>
                    <input
                        type="submit"
                        value="送信"
                        className="btn btn-danger w-25"
                        onClick={this.doAttack.bind(this)}
                    >
                    </input>
                </form>
            </div>
        )
    }
}

export default Form