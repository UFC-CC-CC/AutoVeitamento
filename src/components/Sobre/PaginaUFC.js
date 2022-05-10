import React, { Component } from "react";
export default class PaginaUFC extends Component {
  componentDidMount() {
    window.require("electron").remote.getCurrentWindow().maximize();
    window.location.assign("https://www.ufc.br/");
  }
  render() {
    return (
      <div>
        <br />
        <br />
        <h3>Carregando...</h3>
      </div>
    );
  }
}
