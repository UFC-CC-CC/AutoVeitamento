import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import willContinue from "../../../utilities/confirmAlert";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Slider from '@material-ui/core/Slider';
import "./EditorConfiguracao.css";

class EditorConfiguracao extends Component {

    state = {
		inst: this.props.configuracoes.instituicaoSelect,
		coord: this.props.configuracoes.coordenadorSelect,
		course: this.props.configuracoes.cursoSelect,
		city: this.props.configuracoes.cidadeSelect,
		newInst: this.props.configuracoes.instituicaoSelect,
		newCoord: this.props.configuracoes.coordenadorSelect,
		newCourse: this.props.configuracoes.cursoSelect,
		newCity: this.props.configuracoes.cidadeSelect,
		percent: this.props.configuracoes.percent,
		newPercent: this.props.configuracoes.percent,
		backToMain: false
	}

	confirmResetOfBlocks = () => {
		if(this.state.inst && this.state.newInst && this.state.inst.value != this.state.newInst.value){
			confirmAlert({
				customUI: ({ onClose }) => {
					return (
					  <div className='custom-ui alert-container'>
						<h2>Tem certeza que deseja alterar a instituição de destino?</h2>
						<br/>
						<h4>Isso irá <b>APAGAR</b>: </h4>
						<h4><b>TODOS</b> os blocos de Aproveitamento já registrados</h4>
						<h4><b>TODO</b> o histórico de Aproveitamentos</h4>
						<h4><b>TODAS</b> as sessões pendentes.</h4>
						<br/>
						<h4>Um backup será gerado caso seja necessário reverter essas mudanças.</h4>
						<br/>
						<button class="btn btn-primary mr-md-5" onClick={onClose}>Não, me enganei.</button>
						<button
						 class="btn btn-danger mr-md-5"
						  onClick={() => {
							onClose();
							this.editPreferences();
						  }}
						>
						  Sim, altere a instituição e delete os blocos!
						</button>
					  </div>
					);
				  }
			});
		}
		else{
			confirmAlert({
				customUI: ({ onClose }) => {
					return (
					  <div className='custom-ui alert-container'>
						<h2>Tem certeza que deseja alterar as configurações?</h2>
						<br/>
						<button class="btn btn-primary mr-md-5" onClick={onClose}>Não, me enganei.</button>
						<button
						 class="btn btn-danger mr-md-5"
						  onClick={() => {
							onClose();
							this.editPreferences();
						  }}
						>
						  Sim, altere as configurações!
						</button>
					  </div>
					);
				  }
			});
		}
		
	  };

	fieldHandler = (field, data) => this.setState({[field]: data});

	isEqual = () => this.state.inst && this.state.newInst && this.state.coord && this.state.newCoord && this.state.course && this.state.newCourse && this.state.city && this.state.newCity && this.state.inst.value == this.state.newInst.value && this.state.coord.value == this.state.newCoord.value && this.state.course.value == this.state.newCourse.value && this.state.city.value == this.state.newCity.value && this.state.percent == this.state.newPercent;

	editPreferences = ()=>{
		  
		
		if(this.state.inst && this.state.newInst && this.state.inst.value != this.state.newInst.value){
			
			const electron = window.require('electron');
			const fs = electron.remote.require('fs');
			const ncp = electron.remote.require('ncp');
			
			const currentDate = new Date();
			
			const dateString = currentDate.getDate() + "-" + (currentDate.getMonth()+1) + "-"+currentDate.getFullYear() + "-" + currentDate.getTime();
			fs.mkdir(`./Backups/${dateString}`, err => {
				if(err){
					return alert("Can't create directory!");
				}
				ncp("./src/database/",`./Backups/${dateString}`, err =>  {
					if (err) {
					  return alert("Can't copy directory!");
					}
					
					this.props.updateFile({
						instituicaoData: this.state.newInst?this.props.instituicoesData[this.state.newInst.value]:null,
						instituicaoSelect: this.state.newInst,
						coordenadorData: this.state.newCoord?this.props.professoresData[this.state.newCoord.value]:null,
						coordenadorSelect: this.state.newCoord,
						cursoData: this.state.newCourse?this.props.cursosData[this.state.newCourse.value]:null,
						cursoSelect: this.state.newCourse,
						cidadeData: this.state.newCity?this.props.cidadesData[this.state.newCity.value]:null,
						cidadeSelect: this.state.newCity,
						percent: this.state.newPercent
					});  


					this.props.replaceFile({
						name: 'blocosData',
						type: 'data',
						data: {}
					});
			
					this.props.replaceFile({
						name: 'blocosSelect',
						type: 'data',
						data: []
					});
					this.props.replaceFile({
						name: 'sessions',
						type: 'session',
						data: {}
					});
					this.props.replaceFile({
						name: 'aproveitamentosData',
						type: 'data',
						data: {}
					});
					this.props.replaceFile({
						name: 'aproveitamentosSelect',
						type: 'select',
						data: []
					});
				});
			})
		}
		else{
			this.props.updateFile({
				instituicaoData: this.state.newInst?this.props.instituicoesData[this.state.newInst.value]:null,
				instituicaoSelect: this.state.newInst,
				coordenadorData: this.state.newCoord?this.props.professoresData[this.state.newCoord.value]:null,
				coordenadorSelect: this.state.newCoord,
				cursoData: this.state.newCourse?this.props.cursosData[this.state.newCourse.value]:null,
				cursoSelect: this.state.newCourse,
				cidadeData: this.state.newCity?this.props.cidadesData[this.state.newCity.value]:null,
				cidadeSelect: this.state.newCity,
				percent: this.state.newPercent
			});  
		}
		
		willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
	}


    render(){
		if(this.state.backToMain)
			return this.props.location&&this.props.location.state&&this.props.location.state.redirectRoute?<Redirect to={{ pathname: this.props.location.state.redirectRoute, state: { inMainWindow: true }}}/>:<Redirect to="/"/>

		let isOk =  !(!this.isEqual() && this.state.inst && this.state.newInst && this.state.inst.value != this.state.newInst.value);

		let warning;


		if(!isOk){
			warning = <Typography>
						<h3 style={{color: 'red', fontWeight: 'bold'}}>ATENÇÃO!<br/>Alterar a instituição de Destino irá apagar
							<ul>
							<li><b>TODOS</b> os Blocos de Aproveitamento já registrados</li>
							<li><b>TODO</b> o Histórico de Aproveitamentos</li>
							<li><b>TODAS</b> as Sessões pendentes</li>
							</ul>
						</h3>
					  </Typography>
		}


        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Edição dos Campos de Configurações</h1>
                    </Typography>
                </Grow>
				<br/>
				<Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h3>Os seguintes campos podem ser editados:</h3>
                    </Typography>
				</Grow>
                <form>
				<Slide in={true} direction="right">
					<div>
						<SelectInput
							id="inst"
							type="instituicoes"
							label="Instituição de Destino:"
							placeholder="Sigla: Nome"
							desc="Selecione a Instituição de Ensino de Destino."
							value={this.state.newInst}
							updateState={(data)=>this.fieldHandler('newInst',data)}
							options={this.props.instituicoesSelect}
							isCreatable
							link="/cadastroInst"
							linkText="Cadastrar nova Instituição de Ensino"
						/>
						<SelectInput
							id="coordenador"
							type="professores"
							label="Coordenador do Curso:"
							placeholder="Unidade de Locação: Nome"
							desc="Selecione o(a) professor(a) que é o(a) Coordenador(a) do Curso."
							value={this.state.newCoord}
							updateState={(data)=>this.fieldHandler('newCoord',data)}
							options={this.props.professoresSelect}
							isCreatable
							link="/cadastroProfessor"
							linkText="Cadastrar novo(a) Professor(a)"
						/>
						<SelectInput
							id="curso"
							type="cursos"
							label="Curso de Destino:"
							placeholder="Código: Sigla - Nome"
							desc="Selecione o Curso de Destino."
							value={this.state.newCourse}
							updateState={(data)=>this.fieldHandler('newCourse',data)}
							options={this.props.cursosSelect}
							isCreatable
							link="/cadastroCurso"
							linkText="Cadastrar novo Curso"
						/>
						<div class={`form-group`}>
							<Typography>
								<label for='percentSlider' id='percentSliderLabel'>Porcentagem mínima de carga horária para Blocos de Aproveitamento</label>
								<Slider
									aria-labelledby="percentSliderLabel"
									id="percentSlider"
							        defaultValue={0}
        							valueLabelDisplay="auto"
							        step={1}
							        value={this.state.newPercent}
							        marks = {[
										  {
										    value: 0,
										    label: '0%',
										  },{
										    value: 25,
										    label: '25%',
										  },{
										    value: 50,
										    label: '50%',
										  },{
										    value: 75,
										    label: '75%',
										  },{
										    value: 100,
										    label: '100%',
										  }
										]}
							        min={0}
							        max={100}
							        onChange={(a, b)=>{this.fieldHandler('newPercent', b)}}
							      />	
								<small class="form-text text-muted">Será usada na verificação de blocos de aproveitamento. Selecione 0 (zero) para não fazer restrição sobre a carga horária das disciplinas de origem em relação às de destino.</small>
							</Typography>
						</div>
						

						<SelectInput
							id="city"
							type="cidades"
							label="Cidade:"
							placeholder="Sigla: Nome - Estado"
							desc="Selecione a Cidade em que a Universidade de Destino se situa."
							value={this.state.newCity}
							updateState={(data)=>this.fieldHandler('newCity',data)}
							options={this.props.cidadesSelect}
							isCreatable
							link="/cadastroCidade"
							linkText="Cadastrar nova Cidade"
						/>
                    </div>
					</Slide>
                </form>
				<Slide in={true} direction="right">
                    <div>
                        <Slide in={!isOk} direction="right">
                            <div>
                                {warning}
                            </div>
                        </Slide>
						<Button
                            component="div"
                            variant="contained"
                            color="primary"
                            disabled={this.isEqual()}
                            onClick={()=>{this.confirmResetOfBlocks()}} >
                                Salvar Alterações
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
		professoresData: state.databaseData.professoresData,
		professoresSelect: state.databaseData.professoresSelect,
		cidadesData: state.databaseData.cidadesData,
		cidadesSelect: state.databaseData.cidadesSelect,
		cursosData: state.databaseData.cursosData,
		cursosSelect: state.databaseData.cursosSelect,
		configuracoes: state.preferences
    }
}

const mapDispatchToProps = dispatch => {
    return{
        updateFile: (data) => dispatch(
            {
                type: actionTypes.EDIT_PREFERENCES,
                payload: {
					data: {...data}
				}
            }
		),
		replaceFile: (pyld) => dispatch(
			{
				type: actionTypes.REPLACE_FILE,
				payload: {...pyld}
			}
		)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorConfiguracao);