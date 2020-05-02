import React from "react"
import Header from "./Header"
import Introduction from "./Home/Introduction"
import Button from "./Home/Button"

class Home extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <div className="row mt-2">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <Introduction />
                    </div>
                    <div className="col-2"></div>
                </div>
                <div className="row mt-3">
                    <div className="col-3"></div>
                    <div className="col-3 p-1"><Button text="1人で遊ぶ" link="/play" color="primary" mode="solo" /></div>
                    <div className="col-3 p-1"><Button text="みんなで遊ぶ" link="/play" color="danger" mode="multi" /></div>
                    <div className="col-3"></div>

                    <div className="col-3"></div>
                    <div className="col-6 p-1"><Button text="ランキング" link="/ranking" color="warning" /></div>
                    <div className="col-3"></div>
                </div>
            </div>
        )
    }
}

export default Home