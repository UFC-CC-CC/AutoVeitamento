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

class CadastroCurso extends Component {

    state = {
		name:"",
		initials: "",
		code: "",
        backToMain: false,
        isProcessingData: false
    }

    fieldHandler = (field, data) => this.setState({[field]: data});

    isEmpty = ()=> !this.state.initials || !this.state.name || !this.state.code
	
    checkExistence = () => !!this.props.cursosData[this.state.code]

    registerCourse = () => {
        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'cursosSelect',
                data: {
                    value: this.state.code,
                    label: `${this.state.code} : ${this.state.initials} - ${this.state.name}`
                },
                type: 'select',
                dataType: 'cursos'
            });
            this.props.updateFile({
                name: 'cursosData',
                data: {
                    nome: this.state.name,
                    codigo: this.state.code,
                    sigla: this.state.initials
                },
                type: 'data',
                id: this.state.code
            });  
    
            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
        });
    }


    render(){
        if(this.state.backToMain) return(<Redirect to="/"/>);


        let isOk =  !(!this.isEmpty() && this.checkExistence());

        let warning;

        if(!this.state.isProcessingData && !isOk){
            warning = <h3 style={{color: 'red'}}>Já há um curso cadastrado com esse código!</h3>
        }


        return(
            
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Cadastro de Cursos</h1>
                    </Typography>
                </Grow>

                <form>
                    <br />
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="nomeCurso"
                            type="text"
                            label="Nome:"
                            placeholder="Ex: Ciências da Computação"
                            desc= "Nome completo do Curso a ser cadastrado."
                            value={this.state.name}
                            updateState={(data)=>this.fieldHandler('name', data)}
                            focus
                        /></div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="siglaCurso"
                            type="code"
                            label="Sigla:"
                            placeholder="Ex: CC"
                            desc= "Sigla do Curso a ser cadastrado."
                            value={this.state.initials}
                            updateState={(data)=>this.fieldHandler('initials', data)}
                        />
                        </div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="siglaCurso"
                            type="number"
                            label="Código:"
                            placeholder="Ex: 65"
                            desc= "Código do Curso a ser cadastrado."
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
                            onClick={()=>{this.registerCourse()}} >
                                Cadastrar Curso
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
    return {
        cursosSelect: state.databaseData.cursosSelect,
        cursosData: state.databaseData.cursosData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateFile: (pyld) => dispatch(
            {
                type: actionTypes.ADD_ON_FILE,
                payload: {...pyld}
            }
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CadastroCurso);