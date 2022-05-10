import React, { Component } from "react";
export default class PaginaProReitoria extends Component {
  componentDidMount() {
    window.require("electron").remote.getCurrentWindow().maximize();
    window.location.assign("https://prograd.ufc.br/pt/");
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
