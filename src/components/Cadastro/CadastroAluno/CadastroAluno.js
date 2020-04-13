import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import CPFInput from '../../DataReceivers/CPFInput/CPFInput';
import * as actionTypes from '../../../actions/actionTypes';
import willContinue from '../../../utilities/confirmAlert';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

class CadastroAluno extends Component {

    state = {
        mat: '',
        cpf: "",
        name: "",
        isCPFValid: false,
        backToMain: false,
        isProcessingData: false
    }

    fieldHandler = (field, data) => this.setState({[field]: data});

    checkExistence = () => !!this.props.alunosData[parseInt(this.state.mat)];

    isEmpty = () => (!this.state.mat || !this.state.cpf || !this.state.name || this.state.cpf.length < 11);

    registerStu = () => {
        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'alunosData',
                data: {
                    nome: this.state.name,
                    cpf: this.state.cpf
                },
                type: 'data',
                id: parseInt(this.state.mat)
            });

            this.props.updateFile({
                name: 'alunosSelect',
                data: {
                    value: parseInt(this.state.mat),
                    label: `${parseInt(this.state.mat)}: ${this.state.name}`
                },
                type: 'select',
                dataType: 'alunos'
            });
        });

        willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
    }

    render(){

        if(this.state.backToMain) return(<Redirect to="/"/>);

        let isOk =  !((!this.isEmpty() && this.checkExistence()) || (!this.isEmpty() && !this.state.isCPFValid));

        let warning;

        if(!this.state.isProcessingData && !this.isEmpty() && this.checkExistence()){
            warning = <Typography>
                    <h3 style={{color: 'red'}}>Já um aluno cadastrado com essa matrícula!</h3>
                </Typography>
            }

        if(!this.isEmpty() && !this.state.isCPFValid){
            warning = 
            <Typography>
                <h3 style={{color: 'red'}}>O CPF digitado é inválido!</h3>
            </Typography>
        }

        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Cadastro de Alunos</h1>
                    </Typography>
                </Grow>
                <form>
                    <br />
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="matAluno"
                            type="number"
                            label="Matrícula:"
                            placeholder="ex: 123456"
                            desc="Matrícula do Aluno a ser cadastrado"
                            value={this.state.mat}
                            updateState={(data)=>this.fieldHandler('mat',data)}
                            focus
                        />
                        </div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="nomeAluno"
                            type="text"
                            label="Nome:"
                            placeholder="ex: Fulano de Tal"
                            desc="Nome do Aluno a ser cadastrado"
                            value={this.state.name}
                            updateState={(data)=>this.fieldHandler('name',data)}
                        />
                        </div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
                        <CPFInput
                            id="cpfAluno"
                            label="CPF:"
                            value={this.state.cpf}
                            updateState={(data)=>this.fieldHandler('cpf',data)}
                            updateValidity={(data)=>this.fieldHandler('isCPFValid',data)}
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
                            onClick={()=>{this.registerStu()}} >
                                Cadastrar Aluno
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
        alunosData: state.databaseData.alunosData,
        alunosSelect: state.databaseData.alunosSelect
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

export default connect(mapStateToProps, mapDispatchToProps)(CadastroAluno);