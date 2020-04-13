import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import "./CadastroBloc.css";
import {connect} from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; // Import
import * as actionTypes from '../../../actions/actionTypes';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectMulti from '../../DataReceivers/SelectMulti/SelectMulti';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import DateInput from '../../DataReceivers/DateInput/DateInput';
import willContinue from "../../../utilities/confirmAlert";
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

class CadastroBloc extends Component {

    state = {
        inst: null,
        solicitador: null,
        parecerista: null,
        obs: "",
        date: null,
        origin: [],
        destiny: [],
        backToMain: false,
        blockInst: false,
        isProcessingData: false
    }

    componentDidMount(){
        if(this.state.inst == null && this.props.selectedInst && !this.props.selectedProf){
            this.setState({
                inst:  this.props.selectedInst,
                blockInst: true
            });
        }

        if(this.state.inst == null && this.props.selectedInst && this.props.selectedProf){
            this.setState({
                inst:  this.props.selectedInst,
                blockInst: true,
                solicitador: this.props.selectedProf
            });
        }
    }

    fieldHandler = (field, data, callback) => this.setState({[field]: data}, callback);

    instHandler = (data) => {
        this.props.updateSelectedInst({data: data});    
        this.setState({ inst: data, origin: [] });
    }
    checkExistence = () => !!(this.props.blocosData[this.state.inst.value] && this.props.blocosData[this.state.inst.value][this.generateUniqueStrings().value]);
    
    isEmpty = () => this.state.origin.length == 0 || this.state.destiny.length == 0 || !this.state.solicitador;
    

    generateUniqueStrings = ()=>{

        let ordenedOrigin = this.state.origin.sort((a, b)=>{
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
        });

        let ordenedDestiny = this.state.destiny.sort((a, b)=>{
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
        });

        
        let originString = "";
        let originStringReadable = "";

        ordenedOrigin.map((current, index)=>{
            if(index == ordenedOrigin.length-1 ){
                originString += current.value;
                originStringReadable += current.value;
            }
            else{
                originString += current.value + "|";
                originStringReadable += current.value + ", ";
            }
            return ;
        });

        if(originString[originString.length-1] == "|"){
            originString = originString.slice(0, -1);
        }


        let destinyString = "";
        let destinyStringReadable = "";

        ordenedDestiny.map((current, index)=>{
            if(index == ordenedDestiny.length-1 ){
                destinyString += current.value;
                destinyStringReadable += current.value;
            }
            else{
                destinyString += current.value + "|";
                destinyStringReadable += current.value + ", ";
            }
            return
        });

        if(destinyString[destinyString.length-1] == "|"){
            destinyString = destinyString.slice(0, -1);
        }

        let finalvalue = originString+":"+destinyString;
        let finallabel = originStringReadable + " aproveitando "+destinyStringReadable;
        
        return {
            value: finalvalue,
            label: finallabel
        }
    }

    registerBloc = () => {
        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'blocosData',
                type: 'data',
                data: {
                    cursadas: this.state.origin.map((curr)=>curr.value),
                    aproveitadas: this.state.destiny.map((curr)=>curr.value),
                    parecerista: this.state.parecerista?this.state.parecerista.value:null,
                    solicitador: this.state.solicitador.value,
                    data: this.state.date,
                    obs: this.state.obs,
                    label: this.generateUniqueStrings().label
                },
                id: this.generateUniqueStrings().value,
                specifier: this.state.inst.value
            });

            this.props.updateFile({
                name: 'blocosSelect',
                type: 'select',
                data: {...this.generateUniqueStrings()},
                specifier: this.state.inst.value,
                dataType: 'blocos'
            });

            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
    
        });
    }

    askRegisterBloc = () => {
        // Cálculos serão feitos aqui para determinar tudo!
        let somaDeCargasHorariasOrigem = 0;
        let somaDeCargasHorariasDestino = 0;


        this.state.origin.map( curr => {
            somaDeCargasHorariasOrigem += Number(this.props.disciplinasData[this.state.inst.value][curr.value].horas);
            return;
        });

        this.state.destiny.map( curr => {
            somaDeCargasHorariasDestino += Number(this.props.disciplinasData[this.props.configuracoes.instituicaoSelect.value][curr.value].horas);
            return;
        });

        const proporcao = (this.props.configuracoes.percent/100)*somaDeCargasHorariasDestino;

        if(somaDeCargasHorariasOrigem >= proporcao)
            return this.registerBloc();
        
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                  <div className='custom-ui alert-container'>
                    <h2>Aviso de Carga Horária Mínima</h2>
                    <br/>
                    <h3>A soma das cargas horárias das disciplinas de origem é {somaDeCargasHorariasOrigem} e está abaixo de {proporcao} que é {this.props.configuracoes.percent}%</h3> 
                    <h3> da soma das cargas horárias das disciplinas de destino.</h3>
                    <br/>
                    <h3>Você gostaria de cadastrar esse Bloco de Aproveitamento mesmo assim?</h3>
                    <br/>
                    <br/>
                    <button
                     class="btn btn-primary mr-md-5"
                      onClick={() => {
                        onClose();
                        this.registerBloc();
                      }}
                    >
                      Sim, cadastre o Bloco de Aproveitamento.
                    </button>
                    <button class="btn btn-danger mr-md-5" onClick={()=>{
                        onClose();
                    }}>Não, deixe-me editar o Bloco antes de cadastrá-lo.</button>
                  </div>
                );
              }
        });
    }

    render(){
        if(this.state.backToMain) return(<Redirect to="/"/>);

        if(!this.props.configuracoes.instituicaoSelect){
            return(
                <div>
                    <h3 class="spacing_cb">Cadastro de Bloco de Aproveitamento</h3>
                    <br/>
                    <br/>
                    <h4 class="spacing_cb">Não é possível cadastrar um Bloco de Aproveitamento sem antes ter selecionado uma Instituição de Destino nas Configurações!</h4>
                    <h4 class="spacing_cb">Também pode ser conveniente alterar a porcentagem de horas para os blocos~de aproveitamento.</h4>
                    <br/>
                    <Link to={{ pathname: '/editorConfig', state: { inMainWindow: true, redirectRoute: '/cadastroBloc' }}}>
                        <button class="btn btn-primary">Editar Configurações</button>
                    </Link>
                </div>
            );
        }

        let otherFields;

        let observations;

        if(this.state.inst){
            otherFields = [
                        <Slide in={true} direction="left">
                            <div>
                            <DateInput 
                                id="obs"
                                label="Data:"
                                placeholder="DD/MM/AAAA"
                                isAuto
                                desc="Data do cadastro do Bloco de Aproveitamento"
                                value={this.state.date}
                                class="divided3 prof_cb no_margin"
                                updateState={(data, callback)=> this.fieldHandler('date', data, callback)}
                            />
                            </div>
                        </Slide>
                        ,
                        <Slide in={true} direction="right">
                            <SelectInput
                                id="solicitador"
                                type="professores"
                                key="solicitador"
                                selectClass="sel"
                                label="Solicitador do Parecer:"
                                placeholder="SIAPE: Nome"
                                desc="Selecione o Solicitador do Parecer do Bloco de Aproveitamento."
                                value={this.state.solicitador}
                                updateState={(data, callback)=>this.fieldHandler('solicitador', data, callback)}
                                options={this.props.professoresSelect}
                                isCreatable
                                link="/cadastroProfessor"
                                linkText="Cadastrar novo Professor"
                                focus={this.props.stack && this.props.stack.length > 0 && this.props.stack[this.props.stack.length -1].route == '/cadastroBloc' && this.props.stack[this.props.stack.length -1].data}
                            />
                        </Slide>,
                        <Slide in={true} direction="left">
                            <SelectInput
                                id="parecerista"
                                type="professores"
                                key="parecerista"
                                selectClass="sel"
                                label="Parecerista:"
                                placeholder="SIAPE: Nome"
                                desc="Selecione o Parecerista do Bloco de Aproveitamento (opcional)."
                                value={this.state.parecerista}
                                updateState={(data, callback)=>this.fieldHandler('parecerista', data, callback)}
                                options={this.props.professoresSelect}
                                isCreatable
                                link="/cadastroProfessor"
                                linkText="Cadastrar novo Professor"
                            />
                        </Slide>,
                        <Slide in={true} direction="right">
                            <SelectMulti 
                                id="discOrigem"
                                type="disciplinas"
                                isCreatable
                                label="Disciplinas Cursadas:"
                                placeholder="Código: Nome da Disciplina ( Carga Horária )"
                                desc="Selecione uma ou mais Disciplinas que foram cursadas na Instituição de Ensino de Origem"
                                value={this.state.origin}
                                updateState={(data, callback)=>{this.fieldHandler('origin', data, callback)}}
                                link="/cadastroDisc"
                                linkText="Cadastrar nova disciplina"
                                options={this.props.disciplinasSelect[this.state.inst.value]}
                            />
                        </Slide>,
                        <Slide in={true} direction="left">
                            <SelectMulti 
                                id="discDestino"
                                type="disciplinas"
                                isCreatable
                                label="Disciplinas Aproveitadas:"
                                placeholder="Código: Nome da Disciplina ( Carga Horária )"
                                desc="Selecione uma ou mais Disciplinas que serão aproveitadas na Instituição de Destino"
                                value={this.state.destiny}
                                updateState={(data, callback)=>{this.fieldHandler('destiny', data, callback)}}
                                link="/cadastroDiscDestino"
                                linkText="Cadastrar nova disciplina"
                                autoData={this.props.configuracoes.instituicaoSelect}
                                options={this.props.disciplinasSelect[this.props.configuracoes.instituicaoSelect.value]}
                            />
                        </Slide>
            ];
            observations = <Slide in={true} direction="right">
                    <div>
                    <TextInput 
                        id="obs"
                        type="text"
                        label="Observações:"
                        placeholder="..."
                        desc="Observações sobre o Bloco de Aproveitamento"
                        value={this.state.obs}
                        class="divided3 prof_cb no_margin"
                        updateState={(data, callback)=> this.fieldHandler('obs', data, callback)}
                    />
                    </div>
                </Slide>;
        }

        
        
        let isOk = !(!this.isEmpty() && this.checkExistence());
        let warning;
        if(!this.state.isProcessingData && !isOk){
            warning = 
            <Typography>
                <h3 style={{color: 'red'}}>Já existe um Bloco de Aproveitamento cadastrado dessa forma!</h3>
            </Typography>
        }

        return(
            
            <div class="container_cb" style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Cadastrar Blocos de Aproveitamento</h1>
                    </Typography>
                </Grow>
                <br/>
                <div class="wrapper">
                    <Slide in={true} direction="right">
                        <SelectInput
                            id="instituicao"
                            type="instituicoes"
                            label="Instituição de Ensino:"
                            placeholder="Código: Nome da Instituição"
                            desc="Selecione a Instituição de Ensino a qual o Bloco de Aproveitamento a ser cadastrado pertence."
                            value={this.state.inst}
                            updateState={(data, callback)=>this.instHandler(data)}
                            options={this.props.instituicoesSelect}
                            isCreatable
                            disabled={this.state.blockInst}
                            link="/cadastroInst"
                            linkText="Cadastrar nova Instituição de Ensino "
                            focus={!(this.state.inst == null && this.props.stack && this.props.stack.length > 0 && this.props.stack[this.props.stack.length -1].route == '/cadastroBloc' && this.props.stack[this.props.stack.length -1].data)}
                        />
                    </Slide>
                    {otherFields}
                    
                </div>
                {observations}
                <Slide in={this.state.inst} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEmpty() || !isOk}
                            onClick={()=>{this.askRegisterBloc()}} >
                                Cadastrar Bloco de Aproveitamento
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
        disciplinasSelect: state.databaseData.disciplinasSelect,
        disciplinasData: state.databaseData.disciplinasData,
        instituicoesData: state.databaseData.instituicoesData,
        instituicoesSelect: state.databaseData.instituicoesSelect,
        professoresData: state.databaseData.professoresData,
        professoresSelect: state.databaseData.professoresSelect,
        blocosData: state.databaseData.blocosData,
        blocosSelect: state.databaseData.blocosSelect,
        stack: state.stack,
        configuracoes: state.preferences,
        selectedInst: state.selectedInst,
        selectedProf: state.selectedProf
    }
}

const mapDispatchToProps = dispatch => {
    return{
        updateFile: (pyld) => dispatch(
            {
                type: actionTypes.ADD_ON_FILE,
                payload: {...pyld}
            }
		),
        updateSelectedInst: (pyld) => dispatch(
            {
                type: actionTypes.PUSH_SELECTED_INST,
                payload: {...pyld}
            }
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CadastroBloc);