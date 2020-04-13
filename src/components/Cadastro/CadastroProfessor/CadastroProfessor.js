import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import * as actionTypes from '../../../actions/actionTypes';
import willContinue from '../../../utilities/confirmAlert';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

class CadastroProfessor extends Component {

    state = {
		siape: "",
		name: "",
		unit: null,
        backToMain: false,
        isProcessingData: false
    }

    fieldHandler = (field, data) => this.setState({[field]: data});

    registerProf = () => {
        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'professoresData',
                data: {
                    nome: this.state.name,
                    siape: parseInt(this.state.siape),
                    dep: this.state.unit.value
                },
                id: parseInt(this.state.siape),
                type: 'data'
            });
            
            this.props.updateFile({
                name: 'professoresSelect',
                data: {
                    value: parseInt(this.state.siape),
                    label: `${this.state.unit.value}: ${this.state.name}`
                },
                type: 'select',
                dataType: 'professores'
            });

            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
    });
    }

    isEmpty = () => !this.state.unit || !this.state.siape || !this.state.name || !this.state.unit;

    checkExistence = () => !!this.props.professoresData[this.state.siape];

    render(){
        if(this.state.backToMain) return(<Redirect to="/"/>);

        let isOk =  !(!this.isEmpty() && this.checkExistence());

        let warning;


        if(!this.state.isProcessingData && !isOk){
            warning = <h3 style={{color: 'red'}}>Já um professor cadastrado com esse SIAPE!</h3>
        }

        return(
            
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Cadastro de Professores</h1>
                    </Typography>
                </Grow>
                <form>
                    <br />
                    <Slide in={true} direction="right">
                        <div>
                        <SelectInput
                            id="unidade"
                            type="unidades"
                            label="Unidade de Lotação:"
                            placeholder="DC: Departamento de Computação"
                            desc="Selecione a Unidade de Lotação a qual o Professor a ser cadastrado pertence"
                            value={this.state.unit}
                            updateState={(data)=>this.fieldHandler('unit',data)}
                            options={this.props.unidadesSelect}
                            isCreatable
                            link="/cadastroUnidade"
                            linkText="Cadastrar nova Unidade de Lotação"
                            focus
                        />
                        </div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="nomeProfessor"
                            type="text"
                            label="Nome:"
                            placeholder="ex: Fulano de Cicrano Beltrano"
                            desc="Nome completo do Professor a ser cadastrado"
                            value={this.state.name}
                            updateState={(data)=>this.fieldHandler('name', data)}
                        />
                        </div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="siapeProfessor"
                            type="number"
                            label="SIAPE:"
                            placeholder="ex: 123456"
                            desc="SIAPE do professor a ser cadastrado."
                            value={this.state.siape}
                            updateState={(data)=>this.fieldHandler('siape', data)}
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
                            onClick={()=>{this.registerProf()}} >
                                Cadastrar Professor
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
        unidadesData: state.databaseData.unidadesData,
		unidadesSelect: state.databaseData.unidadesSelect,
		professoresData: state.databaseData.professoresData,
		professoresSelect: state.databaseData.professoresSelect,
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

export default connect(mapStateToProps, mapDispatchToProps)(CadastroProfessor);