import React from "react"
import firebase from "firebase"

class TabContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "rankingList": []
        }
    }

    componentDidMount() {
        var rankingRef = firebase.database().ref("ranking")
        this.getRanking(rankingRef)
    }

    getRanking(rankingRef) {
        var playerNum = this.props.tab.split("-")[1]
        rankingRef.child(playerNum).on("value", (snapshot) => {
            if (snapshot.val() != null) {
                this.sortRankingList(snapshot.val())
            }
        })
    }

    sortRankingList(value) {
        var sortRankingList = []
        for (var key in value) {
            sortRankingList.push(value[key])
        }
        sortRankingList.sort((a, b) => {
            if (a.score <= b.score)
                return 1
            else
                return -1
        })
        this.setState({
            "rankingList": sortRankingList
        })
    }

    render() {
        return (
            <div>
                {this.props.tab == this.props.target ?
                    <div className="tab-pane active">
                        <div className="card" style={{ height: `${this.props.window.height - 250}px`, overflow: "scroll" }}>
                            <table className="table table-bordered">
                                <thead>
                                    <tr className="text-center">
                                        <th>順位</th>
                                        <th>ルーム名</th>
                                        <th>ルームスコア</th>
                                        <th>プレイヤー名</th>
                                        <th>プレイヤースコア</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.rankingList.map((value, i) => {
                                        return (
                                            <tr key={i} className="text-center">
                                                <th>{i + 1}</th>
                                                <td style={{ maxWidth: `${this.props.window.width / 4}px` }}>{value.roomName}</td>
                                                <td>{value.score}</td>
                                                <td>
                                                    {Object.keys(value.player).map((key, j) => {
                                                        return (
                                                            <div key={`player-${j}`} style={{ maxWidth: `${this.props.window.width / 4}px` }}>
                                                                {value.player[key].name}
                                                            </div>
                                                        )
                                                    })}
                                                </td>
                                                <td>
                                                    {Object.keys(value.player).map((key, j) => {
                                                        return (
                                                            <div key={`player-${j}`}>
                                                                {value.player[key].score}
                                                            </div>
                                                        )
                                                    })}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    <div></div>
                }
            </div>
        )
    }
}

export default TabContent