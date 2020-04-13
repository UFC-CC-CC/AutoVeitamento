import React, {Component} from "react";
import "./Coordenador.css";
import { BrowserRouter as BrowserRouter, Route, Link } from "react-router-dom";

export default class Coordenador extends Component {
    render(){
        return(
            <div>
                <h3>\ (•◡•) /</h3>
                <h3>Bem vindo Pablo!</h3>
                <Link to="/consultaAproveitamento">
                    <button type="button" class="btn btn-outline-primary">Consultar Aproveitamentos</button>
                </Link>
                <Link to="/consulta">
                    <button type="button" class="btn btn-outline-primary">Consultar Dados</button>
                </Link>
                <Link to={{ pathname: '/aprov', state: { inMainWindow: true }}}>
                    <button type="button" class="btn btn-outline-primary">Realizar Aproveitamento</button>
                </Link>
                <Link to={{ pathname: '/sessoes', state: { inMainWindow: true }}}>
                    <button type="button" class="btn btn-outline-primary">Sessões</button>
                </Link>
                
            </div>
        );
    }
}