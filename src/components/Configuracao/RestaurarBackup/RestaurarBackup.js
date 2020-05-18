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
import OrdinaryDisplay from '../../Consulta/DisplayComponents/OrdinaryDisplay/OrdinaryDisplay';
import "./RestaurarBackup.css";

class RestaurarBackup extends Component {

    state = {
    	choosenBackup: null,
    	options: [],
		backToMain: false
	}

	componentDidMount(){
		this.processBackupOptions();
	}

	processBackupOptions = () => {
		const electron = window.require('electron');
		const fs = electron.remote.require('fs');
		if(!fs.existsSync(`./Backups/`)){
            fs.mkdirSync(`./Backups/`);
            return this.setState({
	  			options: []
	  		});
        }
		fs.readdir('Backups/', (err, files) => {
		  if(err)
		  	alert(`ERROR WHILE READING BACKUPS DIR;\nERROR CODE: ${err.code}\nERROR MESSAGE: ${err.message}`);
		  else{
		  		let sortedFiles = files.sort((a, b) => {
		  			let dateA = Number(a.split('-')[3]);
		  			let dateB = Number(b.split('-')[3]);
		  			return dateB - dateA;
		  		});
		  		let options = sortedFiles.map( (curr) => 
		  			{ 
		  				let dateObj = new Date(Number(curr.split('-')[3]));
		  				return {label:`Backup Realizado em ${dateObj.getDate()<10?'0'+dateObj.getDate():dateObj.getDate()}/${dateObj.getMonth()+1<10?'0'+(dateObj.getMonth()+1):dateObj.getMonth()+1}/${dateObj.getFullYear()} às ${dateObj.getHours()<10?'0'+dateObj.getHours():dateObj.getHours()}:${dateObj.getMinutes()<10?'0'+dateObj.getMinutes():dateObj.getMinutes()}:${dateObj.getSeconds()<10?'0'+dateObj.getSeconds():dateObj.getSeconds()}`, value: curr} 
		  		});
		  		
		  		this.setState({
		  			options: options
		  		});
		  }
		});
	}

	confirmRestoring = () => {
        confirmAlert({
			customUI: ({ onClose }) => {
				return (
				  <div className='custom-ui alert-container'>
					<h2>Tem certeza que gostaria de restaurar o Backup escolhido?</h2>
                    <h3>Todos os dados atuais do programa serão substituídos.</h3>
                    <br/>
					<br/>
                    <button
					 class="btn btn-primary mr-md-5"
					  onClick={() => {
						onClose();
                        this.restoreBackup();
                        willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
					  }}
					>
					  Sim, por favor.
					</button>
					<button class="btn btn-danger mr-md-5" onClick={()=>{
                        onClose();
                    }}>Não, obrigado.</button>
				  </div>
				);
			  }
		});
    }


    restoreBackup = () => {
    	alert("This will perform the backup for you now!");

        let copyFile = (copyPath, fileName) => {
            const electron = window.require('electron');
            const fs = electron.remote.require('fs');

            fs.copyFile(`${copyPath}${fileName}`, `src/database/${fileName}`, (err) => {
                if(err)
                    alert(`Error ocurred while copying ${fileName} !\nCODE:${err.code}\nMESSAGE:${err.message}`);
            }); 
        }

        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'configuracoes.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'stack.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'sessions.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'selectedInst.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'selectedProf.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'alunosData.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'alunosSelect.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'aproveitamentosData.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'aproveitamentosSelect.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'blocosData.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'blocosSelect.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'cidadesData.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'cidadesSelect.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'cursosData.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'cursosSelect.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'disciplinasData.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'disciplinasSelect.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'instituicoesData.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'instituicoesSelect.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'professoresData.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'professoresSelect.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'unidadesData.json');
        copyFile('Backups/'+this.state.choosenBackup.value+'/', 'unidadesSelect.json');
    }

    fieldHandler = (field, data) => this.setState({[field]: data});

	backupHandler = (data) => {
		
		const electron = window.require('electron');
		const fs = electron.remote.require('fs');

		const previousData = JSON.parse(fs.readFileSync(`./Backups/${data.value}/configuracoes.json`, 'utf8'));

		this.setState({
			choosenBackup: data,
			configData: previousData
		});
	};



    render(){

		if(this.state.backToMain)
			return <Redirect to="/"/>

		let renderedComponent;

		if(this.state.choosenBackup){
			renderedComponent = <Slide in={this.state.choosenBackup} direction="right">
			                        <div>
			                        <Grow in={true}>
					                    <Typography style={{textAlign: "center"}}>
					                        <h3>Dados de Configuração no Backup Selecionado:</h3>
					                    </Typography>
					                </Grow>
			                        <div className="restaurarBackupGrid2">
			                            <OrdinaryDisplay 
			                                title="Instituição de Ensino"
			                                data={
												this.state.configData.instituicaoSelect?
												`${this.state.configData.instituicaoSelect.value}: ${this.state.configData.instituicaoData}`
												:`Nenhuma Instituição de Ensino selecionada`
											}
			                            />
			                            <OrdinaryDisplay 
			                                title="Curso de Destino"
			                                data={
												this.state.configData.cursoData?
												`${this.state.configData.cursoData.codigo}: ${this.state.configData.cursoData.sigla} - ${this.state.configData.cursoData.nome}`
												:`Nenhum Curso de Destino selecionado`
											}
			                            />
			                        </div>
			                        <div className="restaurarBackupGrid3">
			                            <OrdinaryDisplay 
			                                title="Porcentagem min. de carga horária para Blocos"
			                                data={`${this.state.configData.percent}%`}
			                            />
			                            <OrdinaryDisplay 
			                                title="Coordenador(a) do Curso"
			                                data={
												this.state.configData.coordenadorData?
												`${this.state.configData.coordenadorData.dep}: ${this.state.configData.coordenadorData.nome}`
												:`Nenhum(a) Coordenador(a) selecionado(a)`
											}
			                            />
			                            <OrdinaryDisplay 
			                                title="Cidade"
			                                data={
												this.state.configData.cidadeData?
												`${this.state.configData.cidadeData.sigla}: ${this.state.configData.cidadeData.nome} - ${this.state.configData.cidadeData.estado}`
												:`Nenhuma Cidade selecionada`
											}
			                            />
			                        </div>
		                            <Button
		                                component="div"
		                                variant="contained"
		                                color="primary"
		                                onClick={()=>{this.confirmRestoring()}} >
		                                    Restaurar este Backup
		                            </Button>
			                      </div>
		                      </Slide>
		}

        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Restauração de Backups</h1>
                    </Typography>
                </Grow>
                <br/>
      			<Slide in={true} direction="right">
                    <SelectInput 
                        id="consultaAluno"
                        type="aluno"
                        isClearable
                        label="Escolha o Backup referente ao Ponto de Restauração desejado:"
                        placeholder="ex: Backup Realizado em DD/MM/AAAA às HH:MM:SS"
                        desc="Backups são gerados automaticamente quando o curso de origem é alterado nas configurações, apagando um grande volume de dados."
                        value={this.state.choosenBackup}
                        updateState={data=>{this.backupHandler(data)}}
                        options={this.state.options}
                    />
                </Slide>      
                {renderedComponent}    
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

export default connect(mapStateToProps, mapDispatchToProps)(RestaurarBackup);