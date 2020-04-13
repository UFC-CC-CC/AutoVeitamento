import {connect} from 'react-redux';
import * as actionTypes from '../../actions/actionTypes';
import objCmp from '../../utilities/objectComparator';

const listener = (props) =>{
	const electron = window.require('electron');
	const fs = electron.remote.require('fs');

	//const curr = electron.remote.getCurrentWindow();


	fs.watchFile('./src/database/alunosSelect.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('alunosSelect');
	});

	fs.watchFile('./src/database/alunosData.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('alunosData');
	});

	fs.watchFile('./src/database/unidadesSelect.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('unidadesSelect');
	});

	fs.watchFile('./src/database/unidadesData.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('unidadesData');
	});

	fs.watchFile('./src/database/instituicoesSelect.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('instituicoesSelect');
	});

	fs.watchFile('./src/database/instituicoesData.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('instituicoesData');
	});

	fs.watchFile('./src/database/professoresSelect.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('professoresSelect');
	});

	fs.watchFile('./src/database/professoresData.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('professoresData');
	});

	fs.watchFile('./src/database/disciplinasSelect.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('disciplinasSelect');
	});

	fs.watchFile('./src/database/disciplinasData.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('disciplinasData');
	});

	fs.watchFile('./src/database/blocosSelect.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('blocosSelect');
	});

	fs.watchFile('./src/database/blocosData.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('blocosData');
	});

	fs.watchFile('./src/database/cidadesSelect.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('cidadesSelect');
	});

	fs.watchFile('./src/database/cidadesData.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('cidadesData');
	});

	fs.watchFile('./src/database/cursosSelect.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('cursosSelect');
	});

	fs.watchFile('./src/database/cursosData.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('cursosData');
	});

	fs.watchFile('./src/database/aproveitamentosData.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('aproveitamentosData');
	});

	fs.watchFile('./src/database/aproveitamentosSelect.json', {interval: 10},(curr, prev) => {
		props.onFileChangeHandler('aproveitamentosSelect');
	});

	fs.watchFile('./src/database/stack.json', {interval: 10},(curr, prev) => {
		props.getStack();
	});

	fs.watchFile('./src/database/newDataContainer.json', {interval: 10},(curr, prev) => {
		props.onNewDataHandler();
	});

	fs.watchFile('./src/database/sessions.json', {interval: 10},(curr, prev) => {
		props.getSessions();
	});

	fs.watchFile('./src/database/selectedInst.json', {interval: 10},(curr, prev) => {
		props.getSelectedInst();
	});

	fs.watchFile('./src/database/selectedProf.json', {interval: 10},(curr, prev) => {
		props.getSelectedProf();
	});

	fs.watchFile('./src/database/configuracoes.json', {interval: 10},(curr, prev) => {
		props.getPreferences();
	});


	// Iniciando os dados do reducer
	props.onFileChangeHandler('alunosData');
	props.onFileChangeHandler('alunosSelect');
	props.onFileChangeHandler('unidadesData');
	props.onFileChangeHandler('unidadesSelect');
	props.onFileChangeHandler('professoresData');
	props.onFileChangeHandler('professoresSelect');
	props.onFileChangeHandler('instituicoesData');
	props.onFileChangeHandler('instituicoesSelect');
	props.onFileChangeHandler('disciplinasData');
	props.onFileChangeHandler('disciplinasSelect');
	props.onFileChangeHandler('blocosData');
	props.onFileChangeHandler('blocosSelect');
	props.onFileChangeHandler('cidadesData');
	props.onFileChangeHandler('cidadesSelect');
	props.onFileChangeHandler('cursosData');
	props.onFileChangeHandler('cursosSelect');
	props.onFileChangeHandler('aproveitamentosData');
	props.onFileChangeHandler('aproveitamentosSelect');
	props.getPreferences();
	props.getSessions();
	props.onNewDataHandler();
	props.getStack();
	props.getSelectedInst();
	props.getSelectedProf();
	

	return props.children
} 

const mapStateToProps = state =>{
	return{
		newData: state.newData
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onFileChangeHandler: (name) => dispatch({type: actionTypes.READ_FILE, payload:{name: name}}),
		onNewDataHandler: () => dispatch({type: actionTypes.REGISTER_NEW_DATA}),
		getStack: () => dispatch({type: actionTypes.GET_STACK}),
		popStack: () => dispatch({type: actionTypes.POP_STACK}),
		getPreferences: () => dispatch({type: actionTypes.GET_PREFERENCES}),
		getSessions: () => dispatch({type: actionTypes.GET_SESSION}),
		getSelectedInst: ()=>dispatch({type: actionTypes.PULL_SELECTED_INST}),
		getSelectedProf: ()=>dispatch({type: actionTypes.PULL_SELECTED_PROF})
	}
} 

export default connect(null, mapDispatchToProps)(listener);