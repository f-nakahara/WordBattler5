import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom"
import Home from "./component/Home"
import Play from "./component/Play"
import firebase from 'firebase';
import { firebaseConfig } from '../firebase/config.js';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseDb = firebaseApp.database();

const root = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path="/play" component={Home} />
            <Route exact path="/" component={Play} />
        </div>
    </BrowserRouter>,
    root
);