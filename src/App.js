import React, { Component } from 'react';
import "./App.css";
import { BrowserRouter as BrowserRouter, Route, Link } from "react-router-dom";
import Router from "./components/Router/Router";
import NavBar from "./components/NavBar/NavBar";
import Listener from "./containers/Listener/Listener";


class App extends Component {
  
  render() {
    const electron = window.require('electron');
    const win = electron.remote.getCurrentWindow();
    win.setMenuBarVisibility(false);
    return (
      <div class="App">
        <Listener>
          <BrowserRouter>
            <Router />
            <NavBar />
          </BrowserRouter>
        </Listener>
      </div>
    );
  }
}

export default App;
