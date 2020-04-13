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

class CadastroUnidade extends Component {

    state = {
		name:"",
		initials: "",
        backToMain: false,
        isProcessingData: false
    }


    fieldHandler = (field, data) => this.setState({[field]: data});

    isEmpty = ()=> !this.state.initials || !this.state.name
	
    checkExistence = () => !!this.props.unidadesData[this.state.initials]


    registerUnit = () => {
        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'unidadesSelect',
                data: {
                    value: this.state.initials,
                    label: this.state.initials + ": "+this.state.name
                },
                type: 'select',
                dataType: 'unidades'
            });        
            this.props.updateFile({
                name: 'unidadesData',
                data: this.state.name,
                id: this.state.initials,
                type: 'data'
            });  

            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
    });
    }


    render(){
        if(this.state.backToMain) return(<Redirect to="/"/>);

        let isOk =  !(!this.isEmpty() && this.checkExistence());

        let warning;

        if(!this.state.isProcessingData && !isOk){
            warning = <h3 style={{color: 'red'}}>Já há uma unidade de lotação cadastrada com essa sigla!</h3>
        }


        return(
            
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Cadastro de Unidades de Lotação</h1>
                    </Typography>
                </Grow>

                <form>
                    <br />
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="nomeUnidade"
                            type="text"
                            label="Nome:"
                            placeholder="Ex: Departamento de Computação"
                            desc= "Nome completo da Unidade de Lotação a ser cadastrada."
                            value={this.state.name}
                            updateState={(data)=>this.fieldHandler('name', data)}
                            focus
                        />
                        </div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="siglaUnidade"
                            type="code"
                            label="Sigla:"
                            placeholder="Ex: DC"
                            desc= "Sigla da Unidade de Lotação a ser cadastrada."
                            value={this.state.initials}
                            updateState={(data)=>this.fieldHandler('initials', data)}
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
                            onClick={()=>{this.registerUnit()}} >
                                Cadastrar Unidade de Lotação
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
        unidadesSelect: state.databaseData.unidadesSelect,
        unidadesData: state.databaseData.unidadesData
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

export default connect(mapStateToProps, mapDispatchToProps)(CadastroUnidade);