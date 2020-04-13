import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";

export default class Sobre extends Component {
    render(){
        return(
            <div>
                <h3>(⌐□◡□)</h3>
                <h3>Sobre</h3>
                Aproveitamento de Cadeiras <br/> Desenvolvido por João Batista <br/> 
                Github: <Link to="/paginaCriador" target="_blank">github.com/JsBatista</Link>
            </div>
        );
    }
}