import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import CPFInput from '../../DataReceivers/CPFInput/CPFInput';
import willContinue from "../../../utilities/confirmAlert";
import denyDeletePopup from "../DenyDeletePopup/DenyDeletePopup";
import confirmDeletePopup from "../ConfirmDeletePopup/ConfirmDeletePopup";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import dateUtils from '../../../utilities/dateUtilities.js';

class EditorAluno extends Component {

    state = {
		aluno: null,
        name: "",
        newName: "",
        mat: "",
		newMat: "",
		cpf: "",
		newCpf: "",
		isCPFValid: true,
        backToMain: false,
        isProcessingData: false
	}

	componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.aluno == null && this.props.location&&this.props.location.state&&this.props.location.state.carriedState)
			this.alunoHandler(this.props.location.state.carriedState);
    }


	fieldHandler = (field, data) => this.setState({[field]: data});

	alunoHandler = (data) => this.setState({
			name: this.props.alunosData[data.value].nome,
			newName: this.props.alunosData[data.value].nome,
			mat: data.value,
			newMat: data.value,
			cpf: this.props.alunosData[data.value].cpf,
			newCpf: this.props.alunosData[data.value].cpf,
			aluno: data
	});
	
	// checa nas sessões e aproveitamentos retornando um objeto com as labels dos conflitos
	isDeleteOk = () => {
		let conflitos = {
			sessoes: [],
			aproveitamentos: []
		}
		for(let i in this.props.aproveitamentosData)
			if(this.props.aproveitamentosData[i].aluno == this.state.mat)
				conflitos.aproveitamentos.push(this.props.aproveitamentosData[i].label)
		
		for(let i in this.props.session)
			if(this.props.session[i].state.aluno == this.state.mat)
				conflitos.sessoes.push(this.props.session[i].label)
		
		return (conflitos.sessoes.length == 0 && conflitos.aproveitamentos.length == 0)?false:conflitos;
	}

	checkIsDeleteOk = () => {
		let conflicts = this.isDeleteOk();
		if (conflicts) denyDeletePopup(()=>null, "Aluno", conflicts);
		else confirmDeletePopup(this.deleteStu);
	}

	deleteStu = () => {
		this.props.deleteOnFile({
			name: 'alunosData',
			type: 'data',
			id: parseInt(this.state.mat)
		});
		this.props.deleteOnFile({
			name: 'alunosSelect',
			type: 'select',
			id: parseInt(this.state.mat)
		});
		willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
	}

	editStu = ()=>{

		this.setState({isProcessingData: true}, ()=>{
			this.props.updateFile({
				name: 'alunosData',
				data: {
					nome: this.state.newName,
					cpf: this.state.newCpf
				},
				type: 'data',
				id: parseInt(this.state.newMat),
				prevId: parseInt(this.state.mat)
			});
			this.props.updateFile({
				name: 'alunosSelect',
				data: {
					value: parseInt(this.state.newMat),
					label: `${parseInt(this.state.newMat)}: ${this.state.newName}`
				},
				type: 'select',
				id: parseInt(this.state.newMat),
				prevId: parseInt(this.state.mat)
			});

			if(this.state.mat != this.state.newMat || this.state.name || this.state.newName){
				let newAprData = JSON.parse(JSON.stringify(this.props.aproveitamentosData, null, 4));

				for(let i in newAprData){
					if(newAprData[i].aluno == this.state.mat){
						newAprData[i].aluno = this.state.newMat;
						newAprData[i].label = `${this.state.newMat}: ${this.state.newName} (${newAprData[i].inst}) em ${dateUtils.getStringWithHours(newAprData[i].initialDate)}`;	
					}
				}

				this.props.updateFileMultipleData({
					name: 'aproveitamentosData',
					data: newAprData,
					type: 'data'
				});
			
				let newAprSelect = this.props.aproveitamentosSelect.map(curr => {
					if( this.props.aproveitamentosData[curr.value].aluno == this.state.mat ){
						return {
							label: `${this.state.newMat}: ${this.state.newName} (${this.props.aproveitamentosData[curr.value].inst}) em ${dateUtils.getStringWithHours(this.props.aproveitamentosData[curr.value].initialDate)}`,
							value: curr.value
						}
					}
					return curr
				});
		
				this.props.updateFileMultipleData({
					name: 'aproveitamentosSelect',
					data: newAprSelect,
					type: 'select'
				});

				let newSessions = {...this.props.session}
				
				for(let i in newSessions){
					if(newSessions[i].state.aluno == this.state.mat){
						newSessions[i].state.aluno = this.state.newMat
						newSessions[i].label = `${this.state.newMat}: ${this.state.newName} - ${newSessions[i].state.inst?newSessions[i].state.inst:'Instituição não definida'} - ${dateUtils.getRawStringWithHours(newSessions[i].id)}`
					}
				}

				this.props.updateFileMultipleData({
					data: newSessions,
					type: 'session'
				});

			}
			
			willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
		});	
	}
	
	checkExistence = () => !!this.props.alunosData[parseInt(this.state.newMat)];
	
	isEmpty = () => !this.state.newMat || !this.state.newCpf || !this.state.newName || this.state.newCpf.length < 11;
	
	isEqual = () => this.state.name == this.state.newName && this.state.mat == parseInt(this.state.newMat) && this.state.cpf == this.state.newCpf;
	

    render(){
		if(this.state.backToMain) return(<Redirect to="/"/>);

		let renderedComponents;

		let isOk =  !(!this.isEmpty() && !this.isEqual() && ((this.state.mat != this.state.newMat && this.checkExistence()) ||  !this.state.isCPFValid));

        let warning;

		if(!this.state.isProcessingData && !isOk && this.state.isCPFValid){
			warning = <h3 style={{color: 'red'}}>Já um aluno cadastrado com essa matrícula!</h3>
		}

		if(!isOk && !this.state.isCPFValid){
			warning = <h3 style={{color: 'red'}}>O CPF digitado é inválido!</h3>
		}

		if(this.state.mat){
			renderedComponents = [
				<Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h3>Os seguintes campos podem ser editados:</h3>
                    </Typography>
                </Grow>,
				<Slide in={true} direction="right">
                    <div>
					<TextInput
							id="nomeAluno"
							key="nomeAluno"
							type="text"
							label="Nome:"
							placeholder="ex: Fulano de Tal"
							desc="Nome do aluno cadastrado"
							value={this.state.newName}
							updateState={(data)=>this.fieldHandler('newName',data)}
						/>
					</div>
				</Slide>,
				<Slide in={true} direction="right">
					<div>
					<TextInput
						id="matAluno"
						key="matAluno"
						type="number"
						label="Matrícula:"
						placeholder="ex: 123456"
						desc="Matrícula do aluno cadastrado"
						value={this.state.newMat}
						updateState={(data)=>this.fieldHandler('newMat',data)}
					/>
					</div>
				</Slide>,
				<Slide in={true} direction="right">
					<div>
					<CPFInput
						id="cpfAluno"
						key="cpfAluno"
						label="CPF:"
						value={this.state.newCpf}
						updateState={(data)=>this.fieldHandler('newCpf',data)}
						updateValidity={(data)=>this.fieldHandler('isCPFValid',data)}
					/>
					</div>
				</Slide>
			]
		}

		

        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Edição de Alunos</h1>
                    </Typography>
                </Grow>
                <form>
					<br />
					<Slide in={true} direction="right">
                    <div>
                    <SelectInput
						id="selAluno"
						label="Aluno:"
						desc="Selecione o aluno a ser editado:"
						placeholder="Matrícula: Nome"
						value={this.state.aluno}
						updateState={this.alunoHandler}
						options={this.props.alunosSelect}
						focus
					/>
					</div>
					</Slide>
					{renderedComponents}
                </form>
				<Slide in={this.state.aluno} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEqual() || this.isEmpty() || !isOk}
                            onClick={()=>{this.editStu()}} >
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
                                Excluir este Aluno
                        </Button>
                    </div>
                </Slide>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        alunosData: state.databaseData.alunosData,
		alunosSelect: state.databaseData.alunosSelect,
		aproveitamentosData: state.databaseData.aproveitamentosData,
		aproveitamentosSelect: state.databaseData.aproveitamentosSelect,
		session: state.sessions
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorAluno);