import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom"
import Home from "./component/Home"
import Play from "./component/Play"
import firebase from 'firebase';
import { firebaseConfig } from '../firebase/config.js';
import Ranking from "./component/Ranking"

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseDb = firebaseApp.database();

const root = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/play" component={Play} />
            <Route exact path="/ranking" component={Ranking} />
        </div>
    </BrowserRouter>,
    root
);