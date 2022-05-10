import React, { Component } from "react";
export default class PaginaBolsa extends Component {
  componentDidMount() {
    window.require("electron").remote.getCurrentWindow().maximize();
    window.location.assign("https://prograd.ufc.br/pt/bolsas/bolsas-de-apoio-a-projetos-de-graduacao/");
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
