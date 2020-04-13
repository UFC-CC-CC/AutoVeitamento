import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import * as actionTypes from '../../../actions/actionTypes';
import willContinue from '../../../utilities/confirmAlert';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';


class CadastroInst extends Component {

    state = {
        name: "",
        code: "",
        backToMain: false,
        isProcessingData: false
    }

    fieldHandler = (field, data) => this.setState({[field]: data});

    checkExistence = () => !!this.props.instituicoesData[this.state.code];

    isEmpty = () => !this.state.name || !this.state.code

    registerInst = () => {

        this.setState({isProcessingData: true}, ()=>{

            this.props.updateFile({
                name: 'instituicoesData',
                type: 'data',
                data: this.state.name,
                id: this.state.code
            });

            this.props.updateFile({
                name: 'instituicoesSelect',
                type: 'select',
                data: {
                    value: this.state.code,
                    label: `${this.state.code}: ${this.state.name}`
                },
                dataType: 'instituicoes'
            });

            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
        });
    }

    render(){
        if(this.state.backToMain) return(<Redirect to="/"/>);

        let isOk =  !(!this.isEmpty() && this.checkExistence());

        let warning;

        if(!this.state.isProcessingData && !isOk){
            warning = <h3 style={{color: 'red'}}> Já existe uma Instituição de Ensino cadastrada com essa sigla!</h3>
        }
        
        return(
            
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Cadastro de Instituições</h1>
                    </Typography>
                </Grow>
                <form>
                    <br />
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="nomeInstituicao"
                            type="text"
                            label="Nome:"
                            placeholder="ex: Universidade Federal do Ceará"
                            desc="Nome completo da Instituição de Ensino a ser cadastrada."
                            value={this.state.name}
                            updateState={(data)=>this.fieldHandler('name', data)}
                            focus
                        />
                        </div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="codInstituicao"
                            type="code"
                            label="Sigla:"
                            placeholder="ex: UFC"
                            desc="Sigla identificadora da Instituição de Ensino a ser cadastrada."
                            value={this.state.code}
                            updateState={(data)=>this.fieldHandler('code', data)}
                        />
                        </div>
                    </Slide>
                </form>
                <Slide in={true} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEmpty() || !isOk}
                            onClick={()=>{this.registerInst()}} >
                                Cadastrar Instituição de Ensino
                        </Button>
                        <Slide in={!isOk} direction="right">
                            <div>
                                {warning}
                            </div>
                        </Slide>
                    </div>
                </Slide>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        instituicoesData: state.databaseData.instituicoesData,
		instituicoesSelect: state.databaseData.instituicoesSelect
    }
}

const mapDispatchToProps = dispatch => {
    return{
        updateFile: (pyld) => dispatch(
            {
                type: actionTypes.ADD_ON_FILE,
                payload: {...pyld}
            }
		)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CadastroInst);