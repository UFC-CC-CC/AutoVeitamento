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

class EditorProfessor extends Component {

    state = {
		prof: null,
        name: "",
		newName: "",
		siape: "",
		newSiape: "",
		unit: null,
		newUnit: null,
        backToMain: false,
        isProcessingData: false
	}
	
	componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.prof == null && this.props.location&&this.props.location.state&&this.props.location.state.carriedState)
			this.professorHandler(this.props.location.state.carriedState);
    }

	fieldHandler = (field, data) => this.setState({[field]: data});

	professorHandler = (data) => this.setState({
		prof: data,
		name: this.props.professoresData[data.value].nome,
		newName: this.props.professoresData[data.value].nome,
		siape: this.props.professoresData[data.value].siape,
		newSiape: this.props.professoresData[data.value].siape,
		unit: {
			value: this.props.professoresData[data.value].dep,
			label: `${this.props.professoresData[data.value].dep}: ${this.props.unidadesData[this.props.professoresData[data.value].dep]}`
		},
		newUnit:{
			value: this.props.professoresData[data.value].dep,
			label: `${this.props.professoresData[data.value].dep}: ${this.props.unidadesData[this.props.professoresData[data.value].dep]}`
		}
	});

	// checa nos blocos, sessões, configurações e apriveitamentos retornando um objeto com as labels dos conflitos
	isDeleteOk = () => {
		let conflitos = {
			blocos: [],
			sessoes: [],
			configuracoes: [],
			aproveitamentos: []
		}

		if(this.props.configuracoes.coordenadorSelect.value == this.state.siape)
			conflitos.configuracoes.push("Coordenador(a) do Curso")

		for(let i in this.props.blocosData){
			for(let j in this.props.blocosData[i]){
				if(this.props.blocosData[i][j].solicitador == this.state.siape && this.props.blocosData[i][j].parecerista == this.state.siape)
					conflitos.blocos.push("Solicitador(a) e Parecerista em " + this.props.blocosData[i][j].label)
				else if(this.props.blocosData[i][j].solicitador == this.state.siape)
					conflitos.blocos.push("Solicitador(a) em " + this.props.blocosData[i][j].label)
				else if(this.props.blocosData[i][j].parecerista == this.state.siape)
					conflitos.blocos.push("Paracerista em " + this.props.blocosData[i][j].label)
			}
		}

		for(let i in this.props.sessions)
			if(this.props.sessions[i].state.professor == this.state.siape)
				conflitos.sessoes.push("Responsável em "+this.props.sessions[i].label)
		
		for(let i in this.props.aproveitamentosData){
			if(this.props.aproveitamentosData[i].responsavel == this.state.siape && this.props.aproveitamentosData[i].coordenador == this.state.siape)
				conflitos.aproveitamentos.push("Responsável e Coordenador(a) em " +this.props.aproveitamentosData[i].label)
			else if(this.props.aproveitamentosData[i].responsavel == this.state.siape)
				conflitos.aproveitamentos.push("Responsável em " +this.props.aproveitamentosData[i].label)
			else if(this.props.aproveitamentosData[i].coordenador == this.state.siape)
				conflitos.aproveitamentos.push("Coordenador(a) em " +this.props.aproveitamentosData[i].label)
		}

		return (conflitos.blocos.length == 0 && conflitos.sessoes.length == 0 && conflitos.configuracoes.length == 0 && conflitos.aproveitamentos.length == 0)?false:conflitos;
	}

	checkIsDeleteOk = () => {
		let conflicts = this.isDeleteOk();
		if (conflicts) denyDeletePopup(()=>{}, "Professor", conflicts);
		else confirmDeletePopup(this.deleteProf);
	}

	deleteProf = () => {
		this.props.deleteOnFile({
			name: 'professoresData',
			type: 'data',
			id: this.state.siape
		});
		
		this.props.deleteOnFile({
			name: 'professoresSelect',
			type: 'select',
			id: this.state.siape
		});
		willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
	}



	checkExistence = () => !!this.props.professoresData[this.state.newSiape];
	
	isEmpty = () => !this.state.newSiape || !this.state.newName || !this.state.newUnit;
	
	isEqual = ()=> this.state.name == this.state.newName && this.state.siape == parseInt(this.state.newSiape) && this.state.unit.value == this.state.newUnit.value;

	editProf = ()=>{

        this.setState({isProcessingData: true}, ()=>{
			this.props.updateFile({
				name: 'professoresData',
				data: {
					nome: this.state.newName,
					siape: parseInt(this.state.newSiape),
					dep: this.state.newUnit.value
				},
				id: parseInt(this.state.newSiape),
				type: 'data',
				prevId: parseInt(this.state.siape)
			});
			
			this.props.updateFile({
				name: 'professoresSelect',
				data: {
					value: parseInt(this.state.newSiape),
					label: `${this.state.newUnit.value}: ${this.state.newName}`
				},
				id: parseInt(this.state.newSiape),
				type: 'select',
				prevId: parseInt(this.state.siape)
			});

			if(this.props.configuracoes.coordenadorSelect.value == this.state.siape){
				let newConfigs = JSON.parse(JSON.stringify(this.props.configuracoes));

				newConfigs.coordenadorData = {
					nome: this.state.newName,
					siape: parseInt(this.state.newSiape),
					dep: this.state.newUnit.value
				};
				newConfigs.coordenadorSelect = {
					value: parseInt(this.state.newSiape),
					label: `${this.state.newUnit.value}: ${this.state.newName}`
				};

				this.props.updateFileMultipleData({
					name: 'configuracoes',
					data: newConfigs,
					type: 'config'
				});
			}
			
			if(this.state.siape != this.state.newSiape){
				let newAprData = JSON.parse(JSON.stringify(this.props.aproveitamentosData));

				for(let i in newAprData){
					if(newAprData[i].responsavel == this.state.siape)
						newAprData[i].responsavel = this.state.newSiape
					if(newAprData[i].coordenador == this.state.siape)
						newAprData[i].coordenador = this.state.newSiape
				}
				this.props.updateFileMultipleData({
					name: 'aproveitamentosData',
					data: newAprData,
					type: 'data'
				});
				
				let newBlocsData = JSON.parse(JSON.stringify(this.props.blocosData));
				for(let i in newBlocsData){
					for(let j in newBlocsData[i]){
						if(newBlocsData[i][j].solicitador == this.state.siape){
							newBlocsData[i][j].solicitador = this.state.newSiape
						}
						if(newBlocsData[i][j].parecerista == this.state.siape){
							newBlocsData[i][j].parecerista = this.state.newSiape
						}
					}
				}

				this.props.updateFileMultipleData({
					name: 'blocosData',
					data: newBlocsData,
					type: 'data'
				});

				let newSessions = {...this.props.sessions}
				for(let i in newSessions)
					if(newSessions[i].state.professor == this.state.siape)
						newSessions[i].state.professor = this.state.newSiape
				
				this.props.updateFileMultipleData({
					data: newSessions,
					type: 'session'
				});
				
			}

			willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
		});
	}

    render(){
		if(this.state.backToMain) return(<Redirect to="/"/>);

		let renderedComponents;

		let isOk =  !(!this.isEmpty() && !this.isEqual() && this.state.siape != this.state.newSiape && this.checkExistence());

        let warning;

		if(!this.state.isProcessingData && !this.isEmpty() && !this.isEqual() && this.state.siape != this.state.newSiape && this.checkExistence()){
			warning = 
			<Typography>
				<h3 style={{color: 'red'}}>Já um professor cadastrado com esse SIAPE!</h3>
			</Typography>
		}


		if(this.state.siape){
			renderedComponents = [
				<Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h3>Os seguintes campos podem ser editados:</h3>
                    </Typography>
				</Grow>,
				<Slide in={true} direction="right">
					<div>
					<TextInput
						id="nomeProfessor"
						type="text"
						label="Nome:"
						placeholder="ex: Fulano de Cicrano Beltrano"
						desc="Novo nome completo do Professor"
						value={this.state.newName}
						updateState={(data)=>this.fieldHandler('newName', data)}
					/>
					<TextInput
						id="siapeProfessor"
						type="number"
						label="SIAPE:"
						placeholder="ex: 123456"
						desc="Novo SIAPE do professor."
						value={this.state.newSiape}
						updateState={(data)=>this.fieldHandler('newSiape', data)}
					/>
					<SelectInput
						id="unidadeProfessor"
						type="unidades"
						key="unidadeProfessor"
						label="Unidade de Lotação:"
						placeholder="DC: Departamento de Computação"
						desc="Selecione a Unidade de Lotação a qual o Professor a ser editado pertencerá"
						value={this.state.newUnit}
						updateState={(data)=>this.fieldHandler('newUnit',data)}
						options={this.props.unidadesSelect}
						isCreatable
						link="/cadastroUnidade"
						linkText="Cadastrar nova Unidade de Lotação"
					/>
					</div>
				</Slide>
			]
		}

		
        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Edição de Professores</h1>
                    </Typography>
                </Grow>
                <form>
				<br />
					<Slide in={true} direction="right">
						<div>
						<SelectInput
							id="professor"
							label="Professor:"
							placeholder="SIAPE: Nome do Professor"
							desc="Selecione o Professor a ser editado"
							value={this.state.prof}
							updateState={this.professorHandler}
							options={this.props.professoresSelect}
							focus
						/>
						</div>
					</Slide>
					{renderedComponents}
                </form>
				<Slide in={this.state.prof} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEqual() || this.isEmpty() || !isOk}
                            onClick={()=>{this.editProf()}} >
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
                                Excluir este Professor
                        </Button>
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
		configuracoes: state.preferences,
		sessions: state.sessions,
		aproveitamentosData: state.databaseData.aproveitamentosData,
		blocosData: state.databaseData.blocosData
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorProfessor);