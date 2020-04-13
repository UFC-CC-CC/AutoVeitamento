import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import willContinue from "../../../utilities/confirmAlert";
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

class CadastroDiscDestino extends Component {

    state = {
        inst: null,
        name: "",
        code: "",
        hours: "",
        backToMain: false,
        isProcessingData: false
    }

    componentDidMount(){

        if(this.state.inst == null){
            this.setState({
                inst:  this.props.configuracoes.instituicaoSelect
            });
        }
    }

    fieldHandler = (field, data, callback) => this.setState({[field]: data}, callback);

    checkExistence = () => this.props.disciplinasData[this.state.inst.value]&&this.props.disciplinasData[this.state.inst.value][this.state.code];

    isEmpty = () => !this.state.inst || !this.state.name || !this.state.code || !this.state.hours

    registerDisc = () => {
        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'disciplinasData',
                type: 'data',
                data: {
                    nome: this.state.name,
                    codigo: this.state.code,
                    horas: this.state.hours
                },
                id: this.state.code,
                specifier: this.state.inst.value
            });
    
            this.props.updateFile({
                name: 'disciplinasSelect',
                type: 'select',
                data: {
                    value: this.state.code,
                    label: `${this.state.code}: ${this.state.name} (${this.state.hours}h)`
                },
                specifier: this.state.inst.value,
                dataType: 'disciplinas'
            });
    
            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);            
        });
    }

    render(){

        if(this.state.backToMain) return(<Redirect to="/"/>);


        let isOk =  !(!this.isEmpty() && this.checkExistence());

        let warning;

        if(!this.state.isProcessingData && !isOk){
            warning = <h3 style={{color: 'red'}}>Já existe uma disciplina cadastrada com esse código!</h3>
        }

        if(this.state.hours < 0 || this.state.hours % 1 != 0){
            warning = <h3 style={{color: 'red'}}>A carga horária deve ser um valor inteiro e positivo!</h3>
        }
        
        let renderedComponents;

        if(this.state.inst){
            renderedComponents = [
                <Slide in={true} direction="right">
                    <div>
                    <TextInput
                        id="codigoDisciplina"
                        key="codigoDisciplina"
                        type="code"
                        label="Código:"
                        placeholder="ex: CB0534"
                        desc="Código identificador da Disciplina a ser cadastrada de acordo com sua Instituição de Ensino."
                        value={this.state.code}
                        updateState={(data)=>this.fieldHandler('code', data)}
                        focus={this.props.selectedInst}
                    />
                    </div>
                </Slide>,
                <Slide in={true} direction="right">
                    <div>
                    <TextInput
                        id="nomeDisciplina"
                        key="nomeDisciplina"
                        type="text"
                        label="Nome:"
                        placeholder="ex: Cálculo Integral e Diferencial I"
                        desc="Nome completo da Disciplina a ser cadastrada."
                        value={this.state.name}
                        updateState={(data)=>this.fieldHandler('name', data)}
                    />
                    </div>
                </Slide>,
                <Slide in={true} direction="right">
                    <div>
                    <TextInput
                        id="horasDisciplina"
                        key="horasDisciplina"
                        type="number"
                        label="Carga Horária:"
                        placeholder="ex: 96"
                        desc="Carga Horária da Disciplina a ser cadastrada de acordo com sua Instituição de Ensino."
                        value={this.state.hours}
                        updateState={(data)=>this.fieldHandler('hours', data)}
                    />
                    </div>
                </Slide>
            ]
        }

        return(
            <div style={{textAlign: "left", margin: "100px"}}>
                <h3>Cadastro de Disciplina</h3>

                <form>
                    <br />
                    <Slide in={true} direction="right">
                        <div>
                        <SelectInput
                            id="instituicao"
                            type="instituicoes"
                            label="Instituição de Ensino:"
                            placeholder="Código: Nome da Instituição"
                            desc="Selecione a Instituição de Ensino a qual a Disciplina a ser cadastrada pertence."
                            value={this.state.inst}
                            updateState={(data)=>this.fieldHandler('inst', data)}
                            options={this.props.instituicoesSelect}
                            isCreatable
                            link="/cadastroInst"
                            linkText="Cadastrar nova Instituição de Ensino "
                            disabled={true}
                            focus={!(this.state.inst == null && this.props.stack && this.props.stack.length > 0 && this.props.stack[this.props.stack.length -1].route == '/cadastroDisc' && this.props.stack[this.props.stack.length -1].data)}
                        />
                        </div>
                    </Slide>
                    <br />
                    {renderedComponents}    
                    
                </form>
                <Slide in={this.state.inst} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={(this.isEmpty() || !isOk) || this.state.hours < 0 || this.state.hours % 1 != 0}
                            onClick={()=>{this.registerDisc()}} >
                                Cadastrar Disciplina
                        </Button>
                        <Slide in={!isOk || this.state.hours < 0 || this.state.hours % 1 != 0} direction="right">
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
        disciplinasSelect: state.databaseData.disciplinasSelect,
        disciplinasData: state.databaseData.disciplinasData,
        instituicoesData: state.databaseData.instituicoesData,
        instituicoesSelect: state.databaseData.instituicoesSelect,
        stack: state.stack,
        selectedInst: state.selectedInst,
        configuracoes: state.preferences
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

export default connect(mapStateToProps, mapDispatchToProps)(CadastroDiscDestino);