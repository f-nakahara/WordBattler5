import React from "react"
import { withRouter } from "react-router-dom"
import Modal from "react-modal"
import firebase from "firebase"

Modal.setAppElement("#root")  // モーダルをトップページに設置する

class Button extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,  // モーダルオープン判定
            playerName: "unknown"  // プレイヤー名
        };
    }

    // モーダルを開く
    openModal() {
        this.setState({ modalIsOpen: true });
    }

    // モーダルを閉じる
    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    pushPlayerName(playerName) {
        var database = firebase.database()
        var playerId = database.ref("player").push({
            "name": playerName,
            "roomId": "",
            "score": ""
        })
        console.log(playerId["path"]["pieces_"][1])
    }

    // ページを移動する
    movePage() {
        const link = this.props.link  // 移動先のURL
        const mode = this.props.mode  // solo:1人 muliti:みんな
        const playerName = this.state.playerName
        this.pushPlayerName(playerName)
        this.props.history.push({
            pathname: link,
            state: {
                "mode": mode,
                "playerName": playerName
            }
        })
    }

    // プレイヤー名を変更する
    changePlayerName(e) {
        const playerName = e.target.value

        // 空文字のときは「unknown」に変更
        if (playerName == "")
            this.setState({ "playerName": "unknown" })
        else
            this.setState({ "playerName": playerName })
    }

    render() {
        const text = this.props.text  // ボタンに表示するテキスト
        var color = this.props.color  // ボタンの色（bootstrapの値）
        const handleClick = (this.props.mode == null) ? this.movePage.bind(this) : this.openModal.bind(this)  // クリックイベントの登録
        return (
            <div>
                <button onClick={handleClick} className={`btn btn-lg btn-${color} w-100`}>{text}</button>
                <Modal
                    className="modal-dialog modal-dialog-centered"
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal.bind(this)}
                    contentLabel="Example Modal"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="h4">プレイヤー作成</div>
                        </div>
                        <div className="modal-body">
                            <div className="form">
                                <input className="form-control" onChange={this.changePlayerName.bind(this)} placeholder="プレイヤー名"></input>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={this.movePage.bind(this)}>決定</button>
                            <button className="btn btn-danger" onClick={this.closeModal.bind(this)}>閉じる</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Button)