import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Redirect } from "react-router-dom";

export default class Desenvolvedor extends Component {
    componentDidMount(){
        setTimeout(()=>{
            if( ["/", "/dev", "/coord", "/sobre", "/ajuda", "/aprov"].indexOf(window.location.pathname) == -1){
                this.setState({willRedirect: true})
            }
        }, 5000);
    }

    state = {
        willRedirect: false
    }

    render(){
        if(this.state.willRedirect){
            this.setState({willRedirect: false});
            return(<Redirect to="/" />);
        }
        return(
            <div>
                <h3>O_O</h3>
                <h3>Desculpe, ocorreu um erro no sistema.</h3>
                <h3>Você será redirecionado para a página principal automaticamente <br/> em 5 segundos</h3>

            </div>
        );
    }
}