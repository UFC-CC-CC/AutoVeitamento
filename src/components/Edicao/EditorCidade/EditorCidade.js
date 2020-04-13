import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import willContinue from "../../../utilities/confirmAlert";
import denyDeletePopup from "../DenyDeletePopup/DenyDeletePopup";
import confirmDeletePopup from "../ConfirmDeletePopup/ConfirmDeletePopup";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

class EditorCidade extends Component {

    state = {
		city: null,
        name:"",
		initials: "",
		state: "",
		newName: "",
		newInitials: "",
		newState: "",
		backToMain: false,
        isProcessingData: false
	}
	
	componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.city == null && this.props.location&&this.props.location.state&&this.props.location.state.carriedState)
			this.cityHandler(this.props.location.state.carriedState);
    }

	fieldHandler = (field, data) => this.setState({[field]: data});

	cityHandler = (data) => this.setState({
		city: data,
		name: this.props.cidadesData[data.value].nome,
		newName: this.props.cidadesData[data.value].nome,
		initials: data.value,
		newInitials: data.value,
		state: this.props.cidadesData[data.value].estado,
		newState: this.props.cidadesData[data.value].estado
	});


	// checa nas configurações retornando um objeto com as labels dos conflitos
	isDeleteOk = () => {
		let conflitos = {
			configuracoes: [],
			aproveitamentos: []
		}

        if(this.props.configuracoes.cidadeSelect.value == this.state.city.value)
            conflitos.configuracoes.push("Cidade")
		
		for(let i in this.props.aproveitamentosData){
			if(this.props.aproveitamentosData[i].cidade == this.state.city.value)
				conflitos.aproveitamentos.push(this.props.aproveitamentosData[i].label)
		}	

		return (conflitos.configuracoes.length == 0 && conflitos.aproveitamentos.length == 0)?false:conflitos;
	}

	checkIsDeleteOk = () => {
		let conflicts = this.isDeleteOk();
		if (conflicts) denyDeletePopup(()=>{}, "Cidade", conflicts);
		else confirmDeletePopup(this.deleteCity);
	}

	deleteCity = () => {
		this.props.deleteOnFile({
			name: 'cidadesData',
			type: 'data',
            id: this.state.city.value
        });
        
		this.props.deleteOnFile({
			name: 'cidadesSelect',
			type: 'select',
			id: this.state.city.value
		});
		willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
	}

	editCity = ()=>{	
        this.setState({isProcessingData: true}, ()=>{
			this.props.updateFile({
				name: 'cidadesSelect',
				data: {
					value: this.state.newInitials,
					label: `${this.state.newInitials} : ${this.state.newName} - ${this.state.newState}`
				},
				type: 'select',
				id: this.state.newInitials,
				prevId: this.state.initials
			});    
			
			this.props.updateFile({
				name: 'cidadesData',
				data: {
					nome: this.state.newName,
					sigla: this.state.newInitials,
					estado: this.state.newState
				},
				type: 'data',
				id: this.state.newInitials,
				prevId: this.state.initials
			});  
			
	
			if(this.props.configuracoes.cidadeSelect.value == this.state.initials){
	
				let newConfigs = JSON.parse(JSON.stringify(this.props.configuracoes));
	
				newConfigs.cidadeData = {
					nome: this.state.newName,
					sigla: this.state.newInitials,
					estado: this.state.newState
				};
				
				newConfigs.cidadeSelect = {
					value: this.state.newInitials,
					label: `${this.state.newInitials} : ${this.state.newName} - ${this.state.newState}`
				};
	
				this.props.updateFileMultipleData({
					name: 'configuracoes',
					data: newConfigs,
					type: 'config'
				});
			}
	
			if(this.state.initials != this.state.newInitials){
				let newAprData = JSON.parse(JSON.stringify(this.props.aproveitamentosData));
	
				for(let i in newAprData)
					if(newAprData[i].cidade == this.state.initials)
						newAprData[i].cidade = this.state.newInitials
				
				this.props.updateFileMultipleData({
					name: 'aproveitamentosData',
					data: newAprData,
					type: 'data'
				});
						
			}
	
			willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
		
		});
	}

	checkExistence = () => !!this.props.cidadesData[this.state.newInitials]
	
	isEmpty = () => !this.state.newName || !this.state.newInitials || !this.state.newState
	
	isEqual = ()=> this.state.name == this.state.newName && this.state.initials == this.state.newInitials && this.state.state == this.state.newState

    render(){

		if(this.state.backToMain) return(<Redirect to="/"/>);

		let isOk =  !(!this.isEmpty() && !this.isEqual() && this.state.initials != this.state.newInitials && this.checkExistence());

        let warning;


		if(!this.state.isProcessingData && !isOk){
			warning = <h3 style={{color: 'red'}}>Já existe uma Cidade cadastrada com essa sigla!</h3>
		}
		


        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Edição de Cidades</h1>
                    </Typography>
                </Grow>
                <form>
					<br/>
                    <Slide in={true} direction="right">
                    	<div> 
						<SelectInput
							id="cidade"
							label="Cidade:"
							desc="Selecione a Cidade a ser editada:"
							placeholder="Sigla: Cidade - Estado"
							value={this.state.city}
							updateState={this.cityHandler}
							options={this.props.cidadesSelect}
							focus
						/>
                    	</div>
					</Slide>
					<Grow in={this.state.city}>
						<Typography style={{textAlign: "center"}}>
							<h3>Os seguintes campos podem ser editados:</h3>
						</Typography>
					</Grow>
					<Slide in={this.state.city} direction="right">
                    	<div> 
						<TextInput
							id="nomeCidade"
							key="nomeCidade"
							type="text"
							label="Nome:"
							placeholder="ex: Fortaleza"
							desc="Nome completo da Cidade cadastrada."
							value={this.state.newName}
							updateState={(data)=>this.fieldHandler('newName', data)}
						/>
						<TextInput
							id="siglaCidade"
							key="siglaCidade"
							type="code"
							label="Sigla:"
							placeholder="ex: DC"
							desc="Sigla da Cidade cadastrada, utilizada como identificador da Cidade."
							value={this.state.newInitials}
							updateState={(data)=>this.fieldHandler('newInitials',data)}
						/>
						<TextInput
							id="siglaEstado"
							key="siglaEstado"
							type="code"
							label="Sigla:"
							placeholder="ex: CE"
							desc="Sigla do Estado o qual a Cidade cadastrada pertence."
							value={this.state.newState}
							updateState={(data)=>this.fieldHandler('newState',data)}
						/>
						</div> 
					</Slide>
                </form>
				<Slide in={this.state.city} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEqual() || this.isEmpty() || !isOk}
                            onClick={()=>{this.editCity()}} >
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
                                Excluir esta Cidade
                        </Button>
                    </div>
                </Slide>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        cidadesData: state.databaseData.cidadesData,
		cidadesSelect: state.databaseData.cidadesSelect,
		configuracoes: state.preferences,
		aproveitamentosData: state.databaseData.aproveitamentosData
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorCidade);