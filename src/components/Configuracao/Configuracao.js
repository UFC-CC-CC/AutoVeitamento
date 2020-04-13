import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; // Import
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import willContinue from "../../utilities/confirmAlert";
import * as actionTypes from '../../actions/actionTypes';

class Configuracao extends Component{

	state = {
		backToMain: false	
	}

	formatToFactory = () => {
		const electron = window.require('electron');
		const fs = electron.remote.require('fs');
		const ncp = electron.remote.require('ncp');
		
		const currentDate = new Date();
		
		const dateString = currentDate.getDate() + "-" + (currentDate.getMonth()+1) + "-"+currentDate.getFullYear() + "-" + currentDate.getTime();
		
		fs.mkdir(`./Backups/${dateString}`, err => {
				if(err){
					alert("Can't create directory!");
				}
				ncp("./src/database/",`./Backups/${dateString}`, err =>  {
					if (err) {
					  alert("Can't copy directory!");
					}
					
					this.props.updateFile({
						instituicaoData: null,
						instituicaoSelect: null,
						coordenadorData: null,
						coordenadorSelect: null,
						cursoData: null,
						cursoSelect: null,
						cidadeData: null,
						cidadeSelect: null,
						percent: 0
					});  
					


					this.props.replaceFile({
						name: 'stack',
						type: 'data',
						data: {
						    "alunos": null,
						    "professores": null,
						    "instituicoes": null,
						    "unidades": null,
						    "disciplinas": null,
						    "blocos": null,
						    "cursos": null,
						    "cidades": null
						}
					});					

					this.props.replaceFile({
						name: 'selectedInst',
						type: 'data',
						data: null
					});		

					this.props.replaceFile({
						name: 'selectedProf',
						type: 'data',
						data: null
					});		


					this.props.replaceFile({
						name: 'newDataContainer',
						type: 'data',
						data: {}
					});		

					this.props.replaceFile({
						name: 'alunosData',
						type: 'data',
						data: {}
					});
					this.props.replaceFile({
						name: 'alunosSelect',
						type: 'select',
						data: []
					});


					this.props.replaceFile({
						name: 'cidadesData',
						type: 'data',
						data: {}
					});
					this.props.replaceFile({
						name: 'cidadesSelect',
						type: 'select',
						data: []
					});


					this.props.replaceFile({
						name: 'cursosData',
						type: 'data',
						data: {}
					});
					this.props.replaceFile({
						name: 'cursosSelect',
						type: 'select',
						data: []
					});


					this.props.replaceFile({
						name: 'disciplinasData',
						type: 'data',
						data: {}
					});
					this.props.replaceFile({
						name: 'disciplinasSelect',
						type: 'data',
						data: {}
					});


					this.props.replaceFile({
						name: 'instituicoesData',
						type: 'data',
						data: {}
					});
					this.props.replaceFile({
						name: 'instituicoesSelect',
						type: 'select',
						data: []
					});


					this.props.replaceFile({
						name: 'professoresData',
						type: 'data',
						data: {}
					});
					this.props.replaceFile({
						name: 'professoresSelect',
						type: 'select',
						data: []
					});

					this.props.replaceFile({
						name: 'unidadesData',
						type: 'data',
						data: {}
					});
					this.props.replaceFile({
						name: 'unidadesSelect',
						type: 'select',
						data: []
					});

					this.props.replaceFile({
						name: 'blocosData',
						type: 'data',
						data: {}
					});
					this.props.replaceFile({
						name: 'blocosSelect',
						type: 'data',
						data: {}
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

					willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
				});
			})
	}

	askFormatToFactory = () => {
		confirmAlert({
				customUI: ({ onClose }) => {
					return (
					  <div className='custom-ui alert-container'>
						<h2>Tem certeza que deseja apagar TODOS os dados já cadastrados no programa?</h2>
						<br/>
						<h4>Um backup será gerado caso seja necessário reverter essas mudanças.</h4>
						<br/>
						<button class="btn btn-primary mr-md-5" onClick={onClose}>Não, me enganei.</button>
						<button
						 class="btn btn-danger mr-md-5"
						  onClick={() => {
							onClose();
							this.formatToFactory();
						  }}
						>
						  Sim, delete todos os dados!
						</button>
					  </div>
					);
				  }
			});
	}

	fieldHandler = (field, data) => this.setState({[field]: data});

	render(){
		if(this.state.backToMain)
			return this.props.location&&this.props.location.state&&this.props.location.state.redirectRoute?<Redirect to={this.props.location.state.redirectRoute}/>:<Redirect to="/"/>

		return(
			
			<div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
			<Grow in={true}>
			<div>
				<Typography style={{textAlign: "center"}}>
					<h1>Configurações</h1>
				</Typography>
			
			<br/>
			<Grow in={true}>
	                    <Typography style={{textAlign: "center"}}>
	                        <h3>Os campos de configurações do programa estão definidos como:</h3>
	                    </Typography>
					</Grow>
			<br/>
			<Slide in={true} direction="right">
				<Typography>
				<div>
					<h4>Instituição de Destino:</h4>
					<p>{this.props.configuracoes.instituicaoSelect?this.props.configuracoes.instituicaoSelect.label:"Nenhuma instituição foi cadastrada como instituição de destino ainda."}</p>

					<h4>Curso de Destino:</h4>
					<p>{this.props.configuracoes.cursoSelect?this.props.configuracoes.cursoSelect.label:"Nenhum curso foi definido como curso de destino ainda."}</p>

					<h4>Coordenador do Curso:</h4>
					<p>{this.props.configuracoes.coordenadorSelect?this.props.configuracoes.coordenadorSelect.label:"Nenhum(a) professor(a) foi definido(a) como coordenador(a) do curso ainda."}</p>

					<h4>Porcentagem mínima de carga horária para Blocos de Aproveitamento:</h4>
					<p>{this.props.configuracoes.percent}%</p>

					<h4>Cidade:</h4>
					<p>{this.props.configuracoes.cidadeSelect?this.props.configuracoes.cidadeSelect.label:"Nenhuma cidade foi definido(a) como cidade padrão ainda."}</p>
				</div>
				</Typography>
			</Slide>
			<br/>
			<Slide in={true}>
				<Link to={{ pathname: '/editorConfig', state: { inMainWindow: true }}}>
					<Button component="div"
							variant="contained"
							color="primary">Editar Configurações</Button>
				</Link>
			</Slide>
			<br/><br/>
			<Slide in={true}>
				<Link to={{ pathname: '/restaurarBackup', state: { inMainWindow: true }}}>
					<Button component="div"
							variant="contained"
							color="primary">Restaurar Backup Anterior</Button>
				</Link>
			</Slide>
			<br/><br/>
			<Slide in={true}>
					<Button component="div"
							variant="contained"
							color="primary"
							onClick={this.askFormatToFactory}>Deletar todos os dados</Button>
			</Slide>
			
			</div>
			</Grow>
			</div>	
		);
	}
}

const mapStateToProps = state => ({
	configuracoes: state.preferences
});


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

export default connect(mapStateToProps, mapDispatchToProps)(Configuracao);