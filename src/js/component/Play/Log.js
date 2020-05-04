import React from "react"

class Log extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidUpdate() {
        if (this.props.log.length >= 1) {
            var element = document.getElementById("lastLog")
            element.scrollIntoView({
                behavior: "smooth"
            })
        }
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
                        {this.props.log.map(function (value, index, array) {
                            const logMsg = `●【${value.theme}】<=【${value.keyword}】`
                            const damage =
                                (value.damage >= 60) ? (<span className="text-danger">{value.damage}ダメージ！！</span>) :
                                    (value.damage < 0) ? (<span className="text-primary">{value.damage}回復させてしまった・・・</span>) :
                                        (value.damage == 0) ? (<span>効果はないようだ・・・</span>) :
                                            (<span>{value.damage}ダメージ</span>)
                            if (index == array.length - 1)
                                return (<div key={index} id="lastLog">{logMsg}<br></br>{damage}</div>)
                            else
                                return (<div key={index}>{logMsg}<br></br>{damage}<br></br></div>)
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default Log