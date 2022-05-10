import React, { Component } from "react";
import {
  BrowserRouter as BrowserRouter,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import "./Sobre.css";

export default class Sobre extends Component {
  render() {
    return (
      <div className="sobre_body">
        <h3>AutoVeitamento UFC</h3>
        <br />
        <br />
        <h3>Créditos</h3> <br />
        <b>Pablo Mayckon Silva Farias</b> <br />
        <i>Concepção, Orientação e Testes</i>
        <br />
        <br />
        <b>
          João Batista de Freitas Filho{" "}
          <Link to="/paginaCriador" target="_blank">
            <i>(JsBatista)</i>
          </Link>
        </b>
        <br />
        <i>Desenvolvimento</i>
        <br />
        <br />
        <h3>Agradecimentos</h3>
        <p className="sobre_main_text">
          Este software foi desenvolvido no âmbito do{" "}
          <Link to="/webview/paip" target="_blank">
            <i>Projeto PAIP2019.204</i>
          </Link>
          , em conformidade com o{" "}
          <Link to="/webview/edital" target="_blank">
            <i>Edital Nº 50/2018/PROGRAD/UFC</i>
          </Link>
          . Nós agradecemos à{" "}
          <Link to="/webview/proReitoria" target="_blank">
            <i>Pró-Reitoria de Graduação</i>
          </Link>{" "}
          da{" "}
          <Link to="/webview/ufc" target="_blank">
            <i>Universidade Federal do Ceará</i>
          </Link>{" "}
          pelo apoio institucional, na forma de bolsa recebida através do
          <Link to="/webview/bolsa" target="_blank">
            <i>Programa de Acolhimento e Incentivo à Permanência</i>
          </Link>{" "}
          , a qual viabilizou
          este projeto.
        </p>
      </div>
    );
  }
}
