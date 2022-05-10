import React, { Component } from "react";
export default class PaginaEdital extends Component {
  componentDidMount() {
    window.require("electron").remote.getCurrentWindow().maximize();
    window.location.assign("https://prograd.ufc.br/pt/edital-50-selecao-de-projetos-de-apoio-a-graduacao-para-2019/");
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
