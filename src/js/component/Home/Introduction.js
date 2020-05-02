import React from "react"

class Introduction extends React.Component {
    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="text-center">遊び方</h3>
                </div>
                <div className="card-body">
                    <ul>
                        <li><span className="h5 font-weight-bold">1人で遊ぶ</span>または<span className="h5 font-weight-bold">みんなで遊ぶ</span>をクリック</li>
                        <li><span className="h5 font-weight-bold">みんなで遊ぶ</span>をクリックした人は一緒に遊ぶ人と同じ部屋に入室しよう</li>
                        <li>ゲームが始まったらお題に近い意味の言葉を入力して攻撃しよう</li>
                    </ul>
                    <p>

                    </p>
                </div>
            </div>
        )
    }
}

export default Introduction