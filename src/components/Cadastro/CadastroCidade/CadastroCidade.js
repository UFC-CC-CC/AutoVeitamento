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


class CadastroCidade extends Component {

    state = {
		name:"",
		initials: "",
		state: "",
        backToMain: false,
        isProcessingData: false
    }

    fieldHandler = (field, data) => this.setState({[field]: data});

    isEmpty = ()=> !this.state.initials || !this.state.name || !this.state.state
	
    checkExistence = () => !!this.props.cidadesData[this.state.initials]

    registerCity = () => {
        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'cidadesSelect',
                data: {
                    value: this.state.initials,
                    label: `${this.state.initials} : ${this.state.name} - ${this.state.state}`
                },
                type: 'select'
            });    
            this.props.updateFile({
                name: 'cidadesData',
                data: {
                    nome: this.state.name,
                    sigla: this.state.initials,
                    estado: this.state.state
                },
                type: 'data',
                id: this.state.initials,
                dataType: 'cidades'
            });  
    
            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
        
        });
    }


    render(){
        if(this.state.backToMain) return(<Redirect to="/"/>);

        let isOk =  !(!this.isEmpty() && this.checkExistence());

        let warning;

        if(!this.state.isProcessingData && !isOk){
            warning = <h3 style={{color: 'red'}}>Já há uma cidade cadastrada com essa sigla!</h3>
        }


        return(
            
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Cadastro de Cidades</h1>
                    </Typography>
                </Grow>

                <form>
                    <br />
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="nomeCidade"
                            type="text"
                            label="Nome:"
                            placeholder="Ex: Fortaleza"
                            desc= "Nome completo da Cidade a ser cadastrada."
                            value={this.state.name}
                            updateState={(data)=>this.fieldHandler('name', data)}
                            focus
                        />
                        </div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
                        <TextInput
                            id="siglaCidade"
                            type="code"
                            label="Sigla:"
                            placeholder="Ex: FOR"
                            desc= "Sigla da Cidade a ser cadastrada, utilizada como identificador da Cidade."
                            value={this.state.initials}
                            updateState={(data)=>this.fieldHandler('initials', data)}
                        />
                        </div>
                    </Slide>
                    <Slide in={true} direction="right">
                        <div>
					<TextInput
                        id="siglaEstado"
                        type="code"
                        label="Estado:"
                        placeholder="Ex: CE"
                        desc= "Sigla do Estado a qual pertence a Cidade a ser cadastrada."
                        value={this.state.state}
                        updateState={(data)=>this.fieldHandler('state', data)}
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
                            onClick={()=>{this.registerCity()}} >
                                Cadastrar Cidade
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
        cidadesSelect: state.databaseData.cidadesSelect,
        cidadesData: state.databaseData.cidadesData
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

export default connect(mapStateToProps, mapDispatchToProps)(CadastroCidade);