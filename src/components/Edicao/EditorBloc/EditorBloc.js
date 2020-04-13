import React, {Component} from "react";
import "./EditorBloc.css"
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; // Import
import * as actionTypes from '../../../actions/actionTypes';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectMulti from '../../DataReceivers/SelectMulti/SelectMulti';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import DateInput from '../../DataReceivers/DateInput/DateInput';
import willContinue from "../../../utilities/confirmAlert";
import objComp from "../../../utilities/objectComparator";
import denyDeletePopup from "../DenyDeletePopup/DenyDeletePopup";
import confirmDeletePopup from "../ConfirmDeletePopup/ConfirmDeletePopup";
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

class EditorBloc extends Component {

    state = {
		inst: "",
		bloc: null,
		origin: [],
		destiny: [],
		newOrigin: [],
		newDestiny: [],
		solicitador: null,
		newSolicitador: null,
		parecerista: null,
		newParecerista: null,
		obs: "",
		newObs: "",
		date: "",
		newDate: "",
		ok: false,
        backToMain: false,
        isProcessingData: false
    }

    componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.bloc == null && this.props.location&&this.props.location.state&&this.props.location.state.carriedState&&this.props.location.state.carriedInst){
            this.instHandler(this.props.location.state.carriedInst, () => 
                this.blocHandler(this.props.location.state.carriedState)
            );
        }
    }
    
    fieldHandler = (field, data, callback) => this.setState({[field]: data}, callback);

    instHandler = (data, callback) => this.setState({
        inst: data,
		bloc: null,
		origin: [],
		destiny: [],
		newOrigin: [],
		newDestiny: [],
		solicitador: null,
		newSolicitador: null,
		parecerista: null,
		newParecerista: null,
		obs: "",
		newObs: "",
		date: "",
		newDate: "",
    }, callback)

    blocHandler = (data) => {
        let origin = [];
        let destiny = [];

        this.props.disciplinasSelect[this.state.inst.value].map((curr)=>{
            if(this.props.blocosData[this.state.inst.value][data.value].cursadas.indexOf(curr.value) != -1 )
                origin.push(curr);
        });

        this.props.disciplinasSelect[this.props.configuracoes.instituicaoSelect.value].map((curr)=>{
            if(this.props.blocosData[this.state.inst.value][data.value].aproveitadas.indexOf(curr.value) != -1)
                destiny.push(curr);
        });

        let solicitador = {
            value: this.props.blocosData[this.state.inst.value][data.value].solicitador,
            label: `${this.props.professoresData[this.props.blocosData[this.state.inst.value][data.value].solicitador].dep}: ${this.props.professoresData[this.props.blocosData[this.state.inst.value][data.value].solicitador].nome}`
        }

        let parecerista = this.props.blocosData[this.state.inst.value][data.value].parecerista ? {
            value: this.props.blocosData[this.state.inst.value][data.value].parecerista,
            label: `${this.props.professoresData[this.props.blocosData[this.state.inst.value][data.value].solicitador].dep}: ${this.props.professoresData[this.props.blocosData[this.state.inst.value][data.value].parecerista].nome}`
        } : null;

        this.setState({
            bloc: data,
            origin: origin,
            newOrigin: origin,
            destiny: destiny,
            newDestiny: destiny,
            solicitador: solicitador,
            newSolicitador: solicitador,
            parecerista: parecerista,
            newParecerista: parecerista,
            obs: this.props.blocosData[this.state.inst.value][data.value].obs,
            newObs: this.props.blocosData[this.state.inst.value][data.value].obs,
            date: this.props.blocosData[this.state.inst.value][data.value].date,
            newDate: null
        });
    }

    // checa nos sessões e aproveitamentos retornando um objeto com as labels dos conflitos
    isDeleteOk = () => {
        let conflitos = {
            sessoes: [],
            aproveitamentos: []
        }

        for(let i in this.props.sessions)
            for(let j in this.props.sessions[i].state.blocks)
                if(this.props.sessions[i].state.blocks == this.state.bloc.value)
                    conflitos.sessoes.push(this.props.sessions[i].label)
        
        for(let i in this.props.aproveitamentosData)
            for(let j in this.props.aproveitamentosData[i].blocos)
                if(this.props.aproveitamentosData[i].blocos[j].codigo == this.state.bloc.value)
                    conflitos.aproveitamentos.push(this.props.aproveitamentosData[i].label)

        return (conflitos.sessoes.length == 0 && conflitos.aproveitamentos.length == 0)?false:conflitos;
    }

    checkIsDeleteOk = () => {
        let conflicts = this.isDeleteOk();
        if (conflicts) denyDeletePopup(()=>{}, "Bloco de Aproveitamento", conflicts);
        else confirmDeletePopup(this.deleteBloc);
    }

    deleteBloc = () => {
        this.props.deleteOnFile({
            name: 'blocosData',
            type: 'data',
            id: this.state.bloc.value,
            specifier: this.state.inst.value
        });
        
        this.props.deleteOnFile({
            name: 'blocosSelect',
            type: 'select',
            id: this.state.bloc.value,
            specifier: this.state.inst.value
        });
        willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
    }


    isEmpty = () => this.state.newOrigin.length == 0 || this.state.newDestiny.length == 0 || !this.state.newSolicitador;

    isEqual = () => objComp.compareArrNonOrdered(this.state.origin.map((c)=>c.value), this.state.newOrigin.map((c)=>c.value)) &&
                    objComp.compareArrNonOrdered(this.state.destiny.map((c)=>c.value), this.state.newDestiny.map((c)=>c.value)) &&
                    this.state.parecerista == this.state.newParecerista && 
                    this.state.solicitador == this.state.newSolicitador &&
                    this.state.obs == this.state.newObs;

    checkExistence = () => {
        
        if(objComp.compareArrNonOrdered(this.state.origin.map((c)=>c.value), this.state.newOrigin.map((c)=>c.value)) &&
            objComp.compareArrNonOrdered(this.state.destiny.map((c)=>c.value), this.state.newDestiny.map((c)=>c.value)))
                return false
                
        return !!(this.props.blocosData[this.state.inst.value][this.generateUniqueStrings('newOrigin', 'newDestiny').value])
    }

    restrictionChecker = () => {

        if(objComp.compareArrNonOrdered(this.state.origin.map((c)=>c.value), this.state.newOrigin.map((c)=>c.value)) && objComp.compareArrNonOrdered(this.state.destiny.map((c)=>c.value), this.state.newDestiny.map((c)=>c.value)))
            return false;

        let conflicts = [];

        for(let i in this.props.aproveitamentosData){
            for(let j in this.props.aproveitamentosData[i].blocos){
                if(this.props.aproveitamentosData[i].blocos[j].codigo == this.state.bloc.value)
                    if(conflicts.indexOf(this.props.aproveitamentosData[i].label) == -1)
                        conflicts.push(this.props.aproveitamentosData[i].label)
            }
        }

        if(conflicts.length == 0)
            return false;

        return conflicts
    }

    sessionConflictChecker = () => {
        if(objComp.compareArrNonOrdered(this.state.origin.map((c)=>c.value), this.state.newOrigin.map((c)=>c.value)) && objComp.compareArrNonOrdered(this.state.destiny.map((c)=>c.value), this.state.newDestiny.map((c)=>c.value)))
            return false;

        let conflicts = [];
        let currentBlock = this.generateUniqueStrings('origin', 'destiny').value;
        for(let i in this.props.sessions){
            if(this.props.sessions[i].state.origin[currentBlock] && conflicts.indexOf(currentBlock) == -1){
                conflicts.push(this.props.sessions[i].label);
            }
        }
        return conflicts.length > 0 ? conflicts : false ;
    }

	editBloc = () => {
        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'blocosData',
                type: 'data',
                data: {
                    cursadas: this.state.newOrigin.map((curr)=>curr.value),
                    aproveitadas: this.state.newDestiny.map((curr)=>curr.value),
                    parecerista: this.state.newParecerista?this.state.newParecerista.value:null,
                    solicitador: this.state.newSolicitador.value,
                    data: this.state.newDate,
                    obs: this.state.newObs,
                    label: this.generateUniqueStrings('newOrigin', 'newDestiny').label
                },
                id: this.generateUniqueStrings('newOrigin', 'newDestiny').value,
                prevId: this.generateUniqueStrings('origin', 'destiny').value,
                specifier: this.state.inst.value,
                prevSpecifier: this.state.inst.value
            });

            this.props.updateFile({
                name: 'blocosSelect',
                type: 'select',
                data: this.generateUniqueStrings("newOrigin","newDestiny"),
                id: this.generateUniqueStrings('newOrigin', 'newDestiny').value,
                prevId: this.generateUniqueStrings('origin', 'destiny').value,
                specifier: this.state.inst.value,
                prevSpecifier: this.state.inst.value
            });

            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
        });
    }

    askEditBloc = () => {
        // Cálculos serão feitos aqui para determinar tudo!
        let somaDeCargasHoráriasOrigem = 0;
        let somaDeCargasHoráriasDestino = 0;


        this.state.newOrigin.map( curr => {
            somaDeCargasHoráriasOrigem += Number(this.props.disciplinasData[this.state.inst.value][curr.value].horas);
            return;
        });

        this.state.newDestiny.map( curr => {
            somaDeCargasHoráriasDestino += Number(this.props.disciplinasData[this.props.configuracoes.instituicaoSelect.value][curr.value].horas);
            return;
        });

        const proporcao = (this.props.configuracoes.percent/100)*somaDeCargasHoráriasDestino;

        if(somaDeCargasHoráriasOrigem >= proporcao)
            return this.editBloc();
        
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                  <div className='custom-ui alert-container'>
                    <h2>Aviso de Carga Horária Mínima</h2>
                    <br/>
                    <h3>A soma das cargas horárias das disciplinas de origem é {somaDeCargasHoráriasOrigem} e está abaixo de {proporcao} que é {this.props.configuracoes.percent}%</h3> 
                    <h3> da soma das cargas horárias das disciplinas de destino.</h3>
                    <br/>
                    <h3>Você gostaria de cadastrar esse Bloco de Aproveitamento mesmo assim?</h3>
                    <br/>
                    <br/>
                    <button
                     class="btn btn-primary mr-md-5"
                      onClick={() => {
                        onClose();
                        this.editBloc();
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
    
	generateUniqueStrings = (origin, destiny)=>{
        let ordenedOrigin = this.state[origin].sort((a, b)=>{
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
        });
        let ordenedDestiny = this.state[destiny].sort((a, b)=>{
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

        let destinyArray = ordenedDestiny.map((current, index)=>{
            if(index == ordenedDestiny.length-1 ){
                destinyString += current.value;
                destinyStringReadable += current.value;
            }
            else{
                destinyString += current.value + "|";
                destinyStringReadable += current.value + ", ";   
            }
            return current.value
        });

        

        if(destinyString[destinyString.length-1] == "|"){
            destinyString = destinyString.slice(0, -1);
        }


        let finalvalue = originString+":"+destinyString;
        let finallabel = originStringReadable+" aproveitando "+destinyStringReadable;
		
        return {
            value: finalvalue,
            label: finallabel
        }
	}
	
	

    render(){
        if(this.state.backToMain) return(<Redirect to="/"/>);
        
		let otherFields;

        let isOk;
        let warning;
        
        if(this.state.inst && this.state.bloc){
            let conflicts = this.restrictionChecker();
            let sessionConclifts = this.sessionConflictChecker();
    
            isOk = !(!this.isEqual() && !this.isEmpty() && (conflicts || sessionConclifts || this.checkExistence()))

            if(this.state.inst && this.state.bloc && !this.state.isProcessingData && !this.isEmpty() && !this.isEqual() && this.checkExistence()){
                warning = <Typography>
                    <h3 style={{color: 'red'}}>Já existe um bloco cadastrado dessa forma!</h3>
                </Typography>
            }

            if(!isOk && sessionConclifts){
                warning = (
                    <Typography>
                        <h3 style={{color: "red"}}>Não é possível editar ou excluir esse bloco, pois ele já está sendo utilizado nas seguintes sessões pendentes: </h3>
                        <ul style={{color: "red"}}>
                            {sessionConclifts.map(curr => <li>{curr}</li>)}
                        </ul>
                        <h3 style={{color: "red"}}>Favor, exclua, edite ou conclua essas sessões, removendo o bloco atual, para então editá-lo ou excluí-lo</h3>
                    </Typography>
                )
            }

            if(!isOk && conflicts){
                warning = (
                    <Typography>
                        <h3 style={{color: "red"}}>Não é possível editar ou excluir  esse bloco, pois ele já está sendo utilizado nos seguintes aproveitamentos: </h3>
                        <ul style={{color: "red"}}>
                            {conflicts.map(curr => <li>{curr}</li>)}
                        </ul>
                        <h3 style={{color: "red"}}>Favor, exclua ou edite esses aproveitamentos, removendo o bloco atual, para então editá-lo ou excluí-lo</h3>
                    </Typography>
                )
            }


        }
		


        if(this.state.bloc){
            otherFields = [
                <Slide in={true} direction="left">
                    <div>
                    <SelectMulti 
                        id="discOrigem"
                        type="disciplinas"
                        isCreatable
                        label="Disciplinas Cursadas: "
                        placeholder="Código: Nome da Disciplina ( Carga Horária )"
                        desc="Selecione uma ou mais Disciplinas cursadas na Instituição de Ensino de origem"
                        value={this.state.newOrigin}
                        updateState={(data, callback)=>{this.fieldHandler('newOrigin', data, callback)}}
                        link="/cadastroDisc"
                        linkText="Cadastrar nova disciplina"
                        options={this.props.disciplinasSelect[this.state.inst.value]}
                    />
                    </div>
                </Slide>,
                <Slide in={true} direction="left">
                    <div>
                    <SelectMulti 
                        id="discDestino"
                        type="disciplinas"
                        isCreatable
                        label="Disciplinas Aproveitadas:"
                        placeholder="Código: Nome da Disciplina ( Carga Horária )"
                        desc="Selecione uma ou mais Disciplinas que serão aproveitadas na Instituição de Destino"
                        value={this.state.newDestiny}
                        updateState={(data, callback)=>{this.fieldHandler('newDestiny', data, callback)}}
                        link="/cadastroDisc"
                        linkText="Cadastrar nova disciplina"
                        options={this.props.disciplinasSelect[this.props.configuracoes.instituicaoSelect.value]}
                    />
                    </div>
                </Slide>,
                
                <Slide in={true} direction="left">
                        <div>
                        <SelectInput
                            id="solicitador"
                            type="professores"
                            key="solicitador"
                            label="Solicitador do Parecer:"
                            placeholder="Unidade: Nome Completo"
                            desc="Selecione o novo Solicitador do Parecer do Bloco editado."
                            value={this.state.newSolicitador}
                            updateState={(data, callback)=>this.fieldHandler('newSolicitador', data, callback)}
                            options={this.props.professoresSelect}
                            link="/cadastroProfessor"
                            linkText="Cadastrar novo Professor"                        
                        />
                        </div>
                    </Slide>,
                    <Slide in={true} direction="left">
                        <div>
                        <SelectInput
                            id="parecerista"
                            type="professores"
                            key="parecerista"
                            label="Parecerista:"
                            placeholder="Unidade: Nome Completo"
                            desc="Selecione o novo Parecerista do Bloco editado."
                            value={this.state.newParecerista}
                            updateState={(data, callback)=>this.fieldHandler('newParecerista', data, callback)}
                            options={this.props.professoresSelect}
                            isCreatable
                            link="/cadastroProfessor"
                            linkText="Cadastrar novo Professor "
                            isClearable 
                        />
                        </div>
                    </Slide>,
                <Slide in={true} direction="left">
                    <div>
                    <TextInput 
                        id="obs"
                        type="text"
                        label="Observações:"
                        placeholder="..."
                        desc="Novas Observações sobre o Bloco editado."
                        value={this.state.newObs}
                        class="divided3 prof_cb no_margin"
                        updateState={(data, callback)=> this.fieldHandler('newObs', data, callback)}
                    />
                    </div>
                </Slide>,
                <Slide in={true} direction="left">
                    <div>
                    <DateInput 
                        id="obs"
                        label="Data:"
                        placeholder="DD/MM/AAAA"
                        isAuto
                        desc="Data de atualização do Bloco"
                        value={this.state.newDate}
                        class="divided3 prof_cb no_margin"
                        updateState={(data, callback)=> this.fieldHandler('newDate', data, callback)}
                    />
                    </div>
                </Slide>
            ];
        }


        return(
			<div class="container_cb" style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Editar Blocos de Aproveitamento</h1>
                    </Typography>
                </Grow>
                <br/>
                <Slide in={true} direction="right">
                    <SelectInput
                        id="inst"
                        key="inst"
                        label="Instituiçao de Origem:"
                        placeholder="Sigla: Nome da Instituição"
                        desc="Selecione a Instituição de Origem a qual o Bloco a ser editado pertence."
                        value={this.state.inst}
                        updateState={(data, callback)=>this.instHandler(data)}
                        options={this.props.instituicoesSelect}
                        focus
                    />	
                </Slide>
                <Slide in={this.state.inst} direction="right">
                    <SelectInput
                        id="bloco"
                        key="bloco"
                        label="Bloco de Aproveitamento:"
                        placeholder="CURSADAS aproveitando APROVEITADAS"
                        desc="Selecione o Bloco de Aproveitamento a ser editado."
                        value={this.state.bloc}
                        updateState={(data, callback)=>this.blocHandler(data)}
                        options={this.props.blocosSelect[this.state.inst.value]}
                    />
                </Slide>
                <Grow in={this.state.inst && this.state.bloc}>
                    <Typography style={{textAlign: "center"}}>
                        <h3>Os seguintes campos podem ser editados:</h3>
                    </Typography>
                </Grow>
                <div class="wrapper">
                    {otherFields}
                </div>
                
                <Slide in={this.state.inst && this.state.bloc} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEqual() || this.isEmpty() || !isOk}
                            onClick={()=>{this.askEditBloc()}} >
                                Salvar Alterações
                        </Button>
                        <Slide in={!isOk} direction="right">
                            <div>
                                {warning}
                            </div>
                        </Slide>
                        <br/>
						<Button
                            component="div"
                            variant="contained"
                            color="secondary"
                            onClick={()=>{this.checkIsDeleteOk()}} >
                                Excluir este Bloco de Aproveitamento
                        </Button>
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
        configuracoes: state.preferences,
        sessions: state.sessions,
        aproveitamentosData: state.databaseData.aproveitamentosData,
        aproveitamentosSelect: state.databaseData.aproveitamentosSelect
    }
}

const mapDispatchToProps = dispatch => {
    return{
        updateFile: (pyld) => dispatch(
            {
                type: actionTypes.EDIT_ON_FILE,
                payload: {...pyld}
            }
        ),
		deleteOnFile: (pyld) => dispatch(
			{
				type: actionTypes.DELETE_ON_FILE,
				payload: {...pyld}
			}
		)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorBloc);