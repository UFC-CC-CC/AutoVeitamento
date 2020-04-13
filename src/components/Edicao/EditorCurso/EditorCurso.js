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

class EditorCurso extends Component {

    state = {
		course: null,
        name:"",
		initials: "",
		code: "",
		newName: "",
		newInitials: "",
		newCode: "",
		backToMain: false,
        isProcessingData: false
	}

	componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.course == null && this.props.location&&this.props.location.state&&this.props.location.state.carriedState)
			this.courseHandler(this.props.location.state.carriedState);
    }
	
	fieldHandler = (field, data) => this.setState({[field]: data});

	courseHandler = (data) => this.setState({
		course: data,
		name: this.props.cursosData[data.value].nome,
		newName: this.props.cursosData[data.value].nome,
		code: data.value,
		newCode: data.value,
		initials: this.props.cursosData[data.value].sigla,
		newInitials: this.props.cursosData[data.value].sigla
	});

	// checa nas configurações retornando um objeto com as labels dos conflitos
	isDeleteOk = () => {
		let conflitos = {
			configuracoes: [],
			aproveitamentos: []
		}

        if(this.props.configuracoes.cursoSelect.value == this.state.course.value)
            conflitos.configuracoes.push("Curso")
		
		for(let i in this.props.aproveitamentosData){
			if(this.props.aproveitamentosData[i].curso == this.state.course.value)
				conflitos.aproveitamentos.push(this.props.aproveitamentosData[i].label)
		}	
	
			
		return (conflitos.configuracoes.length == 0 && conflitos.aproveitamentos.length == 0)?false:conflitos;
	}

	checkIsDeleteOk = () => {
		let conflicts = this.isDeleteOk();
		if (conflicts) denyDeletePopup(()=>{}, "Curso", conflicts);
		else confirmDeletePopup(this.deleteCourse);
	}

	deleteCourse = () => {
		this.props.deleteOnFile({
			name: 'cursosData',
			type: 'data',
            id: this.state.course.value
        });
        
		this.props.deleteOnFile({
			name: 'cursosSelect',
			type: 'select',
			id: this.state.course.value
		});
		willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
	}

	editCourse = ()=>{
        this.setState({isProcessingData: true}, ()=>{
			this.props.updateFile({
				name: 'cursosSelect',
				data: {
					value: this.state.newCode,
					label: `${this.state.newCode} : ${this.state.newInitials} - ${this.state.newName}`
				},
				type: 'select',
				id: this.state.newCode,
				prevId: this.state.code
			});    
			
			this.props.updateFile({
				name: 'cursosData',
				data: {
					nome: this.state.newName,
					codigo: this.state.newCode,
					sigla: this.state.newInitials
					
				},
				type: 'data',
				id: this.state.newCode,
				prevId: this.state.code
			});  
			
			if(this.props.configuracoes.cursoData && this.props.configuracoes.cursoData.codigo ==  this.state.code){
				let newConfigs = JSON.parse(JSON.stringify(this.props.configuracoes));
			
				newConfigs.cursoData = {
					nome: this.state.newName,
					codigo: this.state.newCode,
					sigla: this.state.newInitials
				};
				newConfigs.cursoSelect = {
					value: this.state.newCode,
					label: `${this.state.newCode} : ${this.state.newInitials} - ${this.state.newName}`
				}
	
				this.props.updateFileMultipleData({
					name: 'configuracoes',
					data: newConfigs,
					type: 'config'
				});
			}
			
			if(this.state.code != this.state.newCode){
				let newAprData = JSON.parse(JSON.stringify(this.props.aproveitamentosData));
	
				for(let i in newAprData)
					if(newAprData[i].curso == this.state.code)
						newAprData[i].curso = this.state.newCode
				
				this.props.updateFileMultipleData({
					name: 'aproveitamentosData',
					data: newAprData,
					type: 'data'
				});
					
			}
	
			willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
		});
	}

	checkExistence = () => (this.state.code != this.state.newCode) && !!this.props.cursosData[this.state.newCode];
	
	isEmpty = () => !this.state.newName || !this.state.newInitials || !this.state.newCode
	
	isEqual = ()=> this.state.name == this.state.newName && this.state.initials == this.state.newInitials && this.state.code == this.state.newCode

    render(){
		if(this.state.backToMain) return(<Redirect to="/"/>);

		let renderedComponents;
		let submit;

		let isOk =  !(!this.isEmpty() && !this.isEqual() && this.state.code != this.state.newCode && this.checkExistence());

        let warning;

		if(!this.state.isProcessingData && !isOk){
			warning = <h3 style={{color: 'red'}}>Já existe um Curso cadastrado com esse código!</h3>
		}

        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Edição de Cursos</h1>
                    </Typography>
                </Grow>
                <form>
					<Slide in={true} direction="right">
						<div> 
						<SelectInput
							id="curso"
							label="Curso:"
							placeholder="Código: Sigla - Nome"
							desc="Selecione o Curso a ser editado."
							value={this.state.course}
							updateState={this.courseHandler}
							options={this.props.cursosSelect}
							focus
						/>
                		</div>
					</Slide>

					<Grow in={this.state.course}>
						<Typography style={{textAlign: "center"}}>
							<h3>Os seguintes campos podem ser editados:</h3>
						</Typography>
					</Grow>
					<Slide in={this.state.course} direction="right">
                    	<div> 
						<TextInput
							id="nomeCurso"
							key="nomeCurso"
							type="text"
							label="Nome:"
							placeholder="ex: Ciências da Computação"
							desc="Nome completo do Curso cadastrado."
							value={this.state.newName}
							updateState={(data)=>this.fieldHandler('newName', data)}
						/>
						<TextInput
							id="siglaCurso"
							key="siglaCurso"
							type="code"
							label="Sigla:"
							placeholder="ex: CC"
							desc="Sigla do Curso cadastrado."
							value={this.state.newInitials}
							updateState={(data)=>this.fieldHandler('newInitials',data)}
						/>
						<TextInput
							id="codigoCurso"
							key="codigoCurso"
							type="number"
							label="Código:"
							placeholder="ex: 65"
							desc="Código do curso cadastrado."
							value={this.state.newCode}
							updateState={(data)=>this.fieldHandler('newCode',data)}
						/>
						</div>
					</Slide>
                </form>
				<Slide in={this.state.course} direction="right">
                    <div>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEqual() || this.isEmpty() || !isOk}
                            onClick={()=>{this.editCourse()}} >
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
                                Excluir este Curso
                        </Button>
                    </div>
                </Slide>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        cursosData: state.databaseData.cursosData,
		cursosSelect: state.databaseData.cursosSelect,
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorCurso);