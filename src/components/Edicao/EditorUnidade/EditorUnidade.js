import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import willContinue from "../../../utilities/confirmAlert";
import objOpe from "../../../utilities/objOpe";
import denyDeletePopup from "../DenyDeletePopup/DenyDeletePopup";
import confirmDeletePopup from "../ConfirmDeletePopup/ConfirmDeletePopup";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

class EditorUnidade extends Component {

    state = {
		unit: null,
        name: "",
		newName: "",
		initials: "",
		newInitials: "",
        backToMain: false,
        isProcessingData: false
	}

	componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.unit == null && this.props.location&&this.props.location.state&&this.props.location.state.carriedState)
			this.unidadeHandler(this.props.location.state.carriedState);
    }
	
	fieldHandler = (field, data) => this.setState({[field]: data});

	unidadeHandler = (data) => this.setState({
		name: this.props.unidadesData[data.value],
		newName: this.props.unidadesData[data.value],
		initials: data.value,
		newInitials: data.value,
		unit: data
	});

	// checa nos professores retornando um objeto com as labels dos conflitos
	isDeleteOk = () => {
		let conflitos = {
			professores: []
		}

		for(let i in this.props.professoresData){
			if(this.props.professoresData[i].dep == this.state.initials)
				conflitos.professores.push(this.props.professoresData[i].siape + ": "+this.props.professoresData[i].nome)
		}

		return (conflitos.professores.length == 0)?false:conflitos;
	}

	checkIsDeleteOk = () => {
		let conflicts = this.isDeleteOk();
		if (conflicts) denyDeletePopup(()=>{}, "Unidade de Lotação", conflicts);
		else confirmDeletePopup(this.deleteProf);
	}

	deleteProf = () => {
		this.props.deleteOnFile({
			name: 'unidadesData',
			type: 'data',
			id: this.state.initials
		});
		
		this.props.deleteOnFile({
			name: 'unidadesSelect',
			type: 'select',
			id: this.state.initials
		});
		willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
	}
	
	editUnit = ()=>{
			this.setState({isProcessingData: true}, ()=>{
			this.props.updateFile({
				name: 'unidadesData',
				data: this.state.newName,
				type: 'data',
				id: this.state.newInitials,
				prevId: this.state.initials
			});

			this.props.updateFile({
				name: 'unidadesSelect',
				data: {
					value: this.state.newInitials,
					label:`${this.state.newInitials}: ${this.state.newName}`
				},
				type: 'select',
				id: this.state.newInitials,
				prevId: this.state.initials
			});

			// Atualiza os códigos de unidade se eles mudaram. Senão, não faz operações desnecessárias de arquivo
			if(this.state.initials != this.state.newInitials){

				let newProfessoresData = JSON.parse(JSON.stringify(this.props.professoresData));

				for(let i in newProfessoresData)
					if(newProfessoresData[i].dep === this.state.initials)
						newProfessoresData[i].dep = this.state.newInitials;
				

				let newProfessoresSelect = this.props.professoresSelect.map((curr)=>{

					if( this.props.professoresData[curr.value].dep === this.state.initials ){
						return {
							value: curr.value,
							label: `${this.state.newInitials}: ${this.props.professoresData[curr.value].nome}`
						}
					}

					return {...curr}
				});


				this.props.updateFileMultipleData({
					name: 'professoresData',
					type: 'data',
					data: {...newProfessoresData}
				});

				this.props.updateFileMultipleData({
					name: 'professoresSelect',
					type: 'select',
					data: [...newProfessoresSelect].sort(objOpe.comparator)
				});
			}

			willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
		});
	}

	checkExistence = () => !!this.props.unidadesData[this.state.newInitials]
	
	isEmpty = () => !this.state.newName || !this.state.newInitials
	
	isEqual = ()=> this.state.name == this.state.newName && this.state.initials == this.state.newInitials

    render(){
		if(this.state.backToMain) return(<Redirect to="/"/>);

		let renderedComponents;

		let isOk =  !(!this.isEmpty() && !this.isEqual() && this.state.initials != this.state.newInitials && this.checkExistence());

        let warning;

		if(!this.state.isProcessingData && !this.isEmpty() && !this.isEqual() && this.state.initials != this.state.newInitials && this.checkExistence()){
			warning = 
				<Typography>
					<h3 style={{color: 'red'}}>Já existe uma Unidade de Lotação cadastrada com essa sigla!</h3>
				</Typography>
		}
		if(this.state.initials){
			renderedComponents = [
				<Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h3>Os seguintes campos podem ser editados:</h3>
                    </Typography>
				</Grow>,
				<Slide in={true} direction="right">
					<div>
					<TextInput
						id="nomeUnidade"
						key="nomeUnidade"
						type="text"
						label="Nome:"
						placeholder="ex: Departamento de Computação"
						desc="Nome completo da Unidade de Lotação cadastrada."
						value={this.state.newName}
						updateState={(data)=>this.fieldHandler('newName', data)}
					/>
					<TextInput
						id="siglaUnidade"
						key="siglaUnidade"
						type="code"
						label="Sigla:"
						placeholder="ex: DC"
						desc="Sigla da Unidade de Lotação cadastrada, utilizada como identificador da Unidade."
						value={this.state.newInitials}
						updateState={(data)=>this.fieldHandler('newInitials',data)}
					/>
					</div>
				</Slide>
			]
		}

		


        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Edição de Unidades de Lotação</h1>
                    </Typography>
                </Grow>
                <form>
				<br />
					<Slide in={true} direction="right">
                    <div>
						<SelectInput
							id="unidade"
							label="Unidade de Lotação:"
							placeholder="Sigla: Nome da Unidade"
							desc="Selecione a Unidade de Lotação a ser editada"
							value={this.state.unit}
							updateState={this.unidadeHandler}
							options={this.props.unidadesSelect}
							focus
						/>
                    </div>
					</Slide>
					{renderedComponents}
                </form>
				<Slide in={this.state.unit} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEqual() || this.isEmpty() || !isOk}
                            onClick={()=>{this.editUnit()}} >
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
                                Excluir esta Unidade de Lotação
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorUnidade);