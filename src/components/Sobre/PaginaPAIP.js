import React, { Component } from "react";
export default class PaginaPAIP extends Component {
  componentDidMount() {
    window.require("electron").remote.getCurrentWindow().maximize();
    window.location.assign("https://prograd.ufc.br/wp-content/uploads/2019/01/resultado-recursos-edital-50-bolsa-de-apoio-a-projetos-de-graduacao-2019.pdf");
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
