import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import * as actionTypes from '../../../actions/actionTypes';
import willContinue from '../../../utilities/confirmAlert';
import denyDeletePopup from "../DenyDeletePopup/DenyDeletePopup";
import confirmDeletePopup from "../ConfirmDeletePopup/ConfirmDeletePopup";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import dateUtils from '../../../utilities/dateUtilities.js';

class EditorInst extends Component {

    state = {
        inst: null,
        name: "",
        newName: "",
        code: "",
        newCode: "",
        backToMain: false,
        isProcessingData: false
    }

    componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.inst == null && this.props.location&&this.props.location.state&&this.props.location.state.carriedState)
			this.instituicaoHandler(this.props.location.state.carriedState);
    }

    fieldHandler = (field, data) => this.setState({[field]: data});

    instituicaoHandler = (data)=>{
        this.setState({
            inst: data,
            name: this.props.instituicoesData[data.value],
            newName: this.props.instituicoesData[data.value],
            code: data.value,
            newCode: data.value
        });
    }

    isEmpty = () => !this.state.newName || !this.state.newCode;

    isEqual = () => this.state.name == this.state.newName && this.state.code == this.state.newCode;

    checkExistence = () => !!this.props.instituicoesData[this.state.newName];

    // checa nos blocos, disciplinas, sessões, configurações e apriveitamentos retornando um objeto com as labels dos conflitos
	isDeleteOk = () => {
		let conflitos = {
            blocos: [],
            disciplinas: [],
            sessoes: [],
            configuracoes: [],
            aproveitamentos: []
		}

        if(this.props.configuracoes.instituicaoSelect.value == this.state.inst.value){
            conflitos.configuracoes.push("Instituição de Origem")
        }

        for(let i in this.props.blocosData[this.state.inst.value])
            conflitos.blocos.push(this.props.blocosData[this.state.inst.value][i].label)
        
        for(let i in this.props.disciplinasData[this.state.inst.value])
            conflitos.disciplinas.push(this.props.disciplinasData[this.state.inst.value][i].nome)
        
        for(let i in this.props.sessions)
            if(this.props.sessions[i].state.inst == this.state.inst.value)
                conflitos.sessoes.push(this.props.sessions[i].label)
         
        for(let i in this.props.aproveitamentosData)
            if(this.props.aproveitamentosData[i].inst == this.state.inst.value)
                conflitos.aproveitamentos.push(this.props.aproveitamentosData[i].label)

		return (conflitos.blocos.length == 0 && conflitos.disciplinas.length == 0 && conflitos.sessoes.length == 0 && conflitos.configuracoes.length == 0 && conflitos.aproveitamentos.length == 0)?false:conflitos;
	}

	checkIsDeleteOk = () => {
		let conflicts = this.isDeleteOk();
		if (conflicts) denyDeletePopup(()=>{}, "Instituicao", conflicts);
		else confirmDeletePopup(this.deleteInst);
	}

	deleteInst = () => {
		this.props.deleteOnFile({
			name: 'instituicoesData',
			type: 'data',
            id: this.state.inst.value
        });
        
		this.props.deleteOnFile({
			name: 'instituicoesSelect',
			type: 'select',
			id: this.state.inst.value
		});
		willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
	}


    editInst = () => {  
        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'instituicoesData',
                type: 'data',
                data: this.state.newName,
                id: this.state.newCode,
                prevId: this.state.code
            });

            this.props.updateFile({
                name: 'instituicoesSelect',
                type: 'select',
                data: {
                    value: this.state.newCode,
                    label: `${this.state.newCode}: ${this.state.newName}`
                },
                id: this.state.newCode,
                prevId: this.state.code
            });

            if(this.props.configuracoes.instituicaoSelect && this.props.configuracoes.instituicaoSelect.value == this.state.code){
                let newConfigs = JSON.parse(JSON.stringify(this.props.configuracoes));

                newConfigs.instituicaoData = this.state.newName;
                newConfigs.instituicaoSelect = {
                    value: this.state.newCode,
                    label: `${this.state.newCode}: ${this.state.newName}`
                };

                this.props.updateFileMultipleData({
                    name: 'configuracoes',
                    data: newConfigs,
                    type: 'config'
                });

            }
            
            let newDiscObj = {...this.props.disciplinasData}
            
            let newDiscSel = {...this.props.disciplinasSelect}

            // Impede que faça operações de disco desnecerrárias caso não hajam disciplinas na instituição
            if(newDiscObj[this.state.code] && this.state.code != this.state.newCode){

                newDiscObj[this.state.newCode] = {...newDiscObj[this.state.code]}
                delete newDiscObj[this.state.code];

                newDiscSel[this.state.newCode] = [...this.props.disciplinasSelect[this.state.code]];
                delete newDiscSel[this.state.code];

                this.props.updateFileMultipleData({
                    name: 'disciplinasData',
                    data: newDiscObj,
                    type: 'data'
                });
        
                this.props.updateFileMultipleData({
                    name: 'disciplinasSelect',
                    data: newDiscSel,
                    type: 'data'
                });

                let newSessions = {...this.props.sessions}
                for(let i in newSessions){
                    if(newSessions[i].state.inst == this.state.code){
                        newSessions[i].state.inst = this.state.newCode;
                        newSessions[i].label = `${newSessions[i].state.aluno?newSessions[i].state.aluno:'Aluno não definido'} - ${this.state.newCode} - ${dateUtils.getRawStringWithHours(newSessions[i].id)}`;
                    }
                }

                this.props.updateFileMultipleData({
                    data: newSessions,
                    type: 'session'
                });
            }

            let newBlocObj = {...this.props.blocosSelect}
            let newBlocData = {...this.props.blocosData}
            // Impede que faça operações de disco desnecerrárias caso não hajam blocos da instituição
            if(newBlocObj[this.state.code] && this.state.code != this.state.newCode){

                newBlocObj[this.state.newCode] = [...newBlocObj[this.state.code]]
                newBlocData[this.state.newCode] = {...newBlocData[this.state.code]}
                
                delete newBlocObj[this.state.code];
                delete newBlocData[this.state.code];
                
                this.props.updateFileMultipleData({
                    name: 'blocosSelect',
                    type: 'data',
                    data: newBlocObj
                });

                this.props.updateFileMultipleData({
                    name: 'blocosData',
                    type: 'data',
                    data: newBlocData
                });

            }

            

            if(this.state.code != this.state.newCode){
                let newAprData = JSON.parse(JSON.stringify(this.props.aproveitamentosData));

                for(let i in newAprData){
                    if(newAprData[i].inst == this.state.code){
                        newAprData[i].inst = this.state.newCode;
                        newAprData[i].label = `${newAprData[i].aluno}: ${this.props.alunosData[newAprData[i].aluno].nome} (${this.state.newCode}) em ${dateUtils.getStringWithHours(newAprData[i].initialDate)}`;
                    }
                    
                    if(newAprData[i].instDestino == this.state.code)
                        newAprData[i].instDestino = this.state.newCode

                }

                let newAprSelect = this.props.aproveitamentosSelect.map(curr => {

                    if( this.props.aproveitamentosData[curr.value].inst === this.state.code ){
                        let currApr = this.props.aproveitamentosData[curr.value];
                        return {
                            label: `${currApr.aluno}: ${this.props.alunosData[currApr.aluno].nome} (${this.state.newCode}) em ${dateUtils.getStringWithHours(currApr.initialDate)}`,
                            value: curr.value
                        }
                    }

                    return curr;
                });
                
                this.props.updateFileMultipleData({
                    name: 'aproveitamentosData',
                    data: newAprData,
                    type: 'data'
                });
                
                this.props.updateFileMultipleData({
                    name: 'aproveitamentosSelect',
                    data: newAprSelect,
                    type: 'select'
                });
            }

            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
        });
    }
    

    render(){
        if(this.state.backToMain) return(<Redirect to="/"/>);

        let renderedComponents = [];

        let isOk =  !(!this.isEmpty() && !this.isEqual() && this.checkExistence());

        let warning;



        if(!this.state.isProcessingData && !isOk){
            warning = <Typography>
                        <h3 style={{color: "red"}}>Já existe uma instituição cadastrada com essa sigla!</h3>
                    </Typography>
        }
        

        if(this.state.name){
            renderedComponents = [
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h3>Os seguintes campos podem ser editados:</h3>
                    </Typography>
                </Grow>,
                <Slide in={true} direction="right">
                    <div>
                    <TextInput
                        id="nomeInstituicao"
                        key="nomeInstituicao"
                        type="text"
                        label="Nome:"
                        placeholder="ex: Universidade Federal do Ceará"
                        desc="Novo nome completo da Instituição de Ensino a ser editada."
                        value={this.state.newName}
                        updateState={(data)=>this.fieldHandler('newName', data)}
                    />
                    <TextInput
                        id="codigoInstituicao"
                        key="codigoInstituicao"
                        type="code"
                        label="Sigla:"
                        placeholder="ex: UFC"
                        desc="Sigla identificadora da Instituição de Ensino a ser editada."
                        value={this.state.newCode}
                        updateState={(data)=>this.fieldHandler('newCode', data)}
                    />
                    </div>
                </Slide>
            ]
        }

        

        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Edição de Instituições de Ensino</h1>
                    </Typography>
                </Grow>
                <form>
                    <br/>
                    <Slide in={true} direction="right">
                        <div>
                        <SelectInput
                            id="instituicao"
                            label="Instituição:"
                            placeholder="Sigla: Nome da instituição de Ensino"
                            desc="Selecione a Instituição de Ensino a ser editada."
                            value={this.state.inst}
                            updateState={this.instituicaoHandler}
                            options={this.props.instituicoesSelect}
                            focus
                        />
                        </div>
                    </Slide>
                    {renderedComponents}
                </form>
                <Slide in={this.state.inst} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEqual() || this.isEmpty() || !isOk}
                            onClick={()=>{this.editInst()}} >
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
                                Excluir esta Instituição de Ensino
                        </Button>
                    </div>
                </Slide>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        instituicoesData: state.databaseData.instituicoesData,
        instituicoesSelect: state.databaseData.instituicoesSelect,
        disciplinasData: state.databaseData.disciplinasData,
        disciplinasSelect: state.databaseData.disciplinasSelect,
        blocosSelect: state.databaseData.blocosSelect,
        blocosData: state.databaseData.blocosData,
        configuracoes: state.preferences,
        sessions: state.sessions,
        aproveitamentosData: state.databaseData.aproveitamentosData,
        aproveitamentosSelect: state.databaseData.aproveitamentosSelect,
        alunosData: state.databaseData.alunosData
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
		updateFileMultipleData: (pyld) => dispatch(
			{
				type: actionTypes.REPLACE_FILE,
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorInst);