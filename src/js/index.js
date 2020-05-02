import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom"
import Home from "./component/Home"
import Play from "./component/Play"

const root = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/play" component={Play} />
        </div>
    </BrowserRouter>,
    root
);