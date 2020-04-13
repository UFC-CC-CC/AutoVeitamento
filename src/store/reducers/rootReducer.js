import * as actionTypes from '../../actions/actionTypes';
import objOpe from "../../utilities/objOpe";

const initialState = {
	databaseData: {
		alunosData: {},
		alunosSelect: [],
		professoresData: {},
		professoresSelect: [],
		instituicoesData: {},
		instituicoesSelect: [],
		unidadesData: {},
		unidadesSelect: [],
		disciplinasData: {},
		disciplinasSelect: {},
		blocosData: {},
		blocosSelect: {},
		cursosData: {},
		cursosSelect: [],
		cidadesData: {},
		cidadesSelect: [],
		aproveitamentosData: {},
		aproveitamentosSelect: []
	},
	preferences: {},
	newData: {},
	sessions: {},
	selectedInst: null,
	selectedProf: null,
	stack: {
		alunos: null,
		professores: null,
		instituicoes: null,
		unidades: null,
		disciplinas: null,
		blocos: null,
		cursos: null,
		cidades: null
	}
}

const reducer = (state = initialState, action)=>{
	const electron = window.require('electron');
	const fs = electron.remote.require('fs');
	let muttableState = JSON.parse(JSON.stringify(state));

	switch(action.type){
		case actionTypes.READ_FILE: // Lê o arquivo e atualiza dados			
			muttableState.databaseData[action.payload.name] = JSON.parse(fs.readFileSync(`./src/database/${action.payload.name}.json`, 'utf8'));

			return muttableState;
		
		case actionTypes.ADD_ON_FILE: // Recebe dados a serem incluídos no arquivo, grava-os nele e atualiza os dados
		// Recebe: name, data, type(data ou select), id (nome caso seja data), specifier (instituição ou unidade ou null) e dataType
			
			// Caso os dados essenciais não sejam passados, não faça nada!
			if(!action.payload.data || !action.payload.name)
				return muttableState;

			if(!action.payload.specifier && action.payload.type == 'data' && action.payload.id){
				if(!muttableState.databaseData[action.payload.name]) muttableState.databaseData[action.payload.name] = {}
				muttableState.databaseData[action.payload.name][action.payload.id] = action.payload.data;
			}
				
			else if(!action.payload.specifier && action.payload.type == 'select'){
				let shouldAdd = true;
				let newArray = []
				muttableState.databaseData[action.payload.name].map((c)=>{
					if(c.value == action.payload.data.value){
						shouldAdd = false
						newArray.push(action.payload.data);
					}
					else
						newArray.push(c)
				})
				if(shouldAdd){
					muttableState.stack[action.payload.dataType] = action.payload.data
					;

					muttableState.databaseData[action.payload.name].push(action.payload.data);
					muttableState.databaseData[action.payload.name] = muttableState.databaseData[action.payload.name].sort(objOpe.comparator);
				}
				if(!shouldAdd){
					muttableState.databaseData[action.payload.name] = JSON.parse(JSON.stringify(newArray, null, 4));
					muttableState.databaseData[action.payload.name] = muttableState.databaseData[action.payload.name].sort(objOpe.comparator);
				}
			}

			else if(action.payload.specifier && action.payload.type == 'data' && action.payload.id){
				if(!muttableState.databaseData[action.payload.name][action.payload.specifier]) muttableState.databaseData[action.payload.name][action.payload.specifier] = {}
				muttableState.databaseData[action.payload.name][action.payload.specifier][action.payload.id] = action.payload.data;
			}

			else if(action.payload.specifier && action.payload.type == 'select'){
				let shouldAdd = true;
				let newArray = []
				if(!muttableState.databaseData[action.payload.name][action.payload.specifier]) muttableState.databaseData[action.payload.name][action.payload.specifier] = []

				muttableState.databaseData[action.payload.name][action.payload.specifier].map((c)=>{
					if(c.value == action.payload.data.value){
						shouldAdd = false
						newArray.push(action.payload.data);
					}
					else
						newArray.push(c)
				})
				if(shouldAdd){
					muttableState.stack[action.payload.dataType] = action.payload.data;
					muttableState.databaseData[action.payload.name][action.payload.specifier].push(action.payload.data);
					muttableState.databaseData[action.payload.name][action.payload.specifier] = muttableState.databaseData[action.payload.name][action.payload.specifier].sort(objOpe.comparator);
				}
				if(!shouldAdd){
					muttableState.databaseData[action.payload.name][action.payload.specifier] = JSON.parse(JSON.stringify(newArray, null, 4));
					muttableState.databaseData[action.payload.name][action.payload.specifier] = muttableState.databaseData[action.payload.name][action.payload.specifier].sort(objOpe.comparator);
				}
			}

			fs.writeFileSync(`./src/database/${action.payload.name}.json`, JSON.stringify(muttableState.databaseData[action.payload.name], null, 4) );
			fs.writeFileSync(`./src/database/stack.json`, JSON.stringify(muttableState.stack, null, 4));

			return muttableState;
		
		case actionTypes.EDIT_ON_FILE:// Altera um certo dado em um arquivo
		// Recebe: name, data, type, id (nome da propriedade (data) ou value (select)), specifier, prevId (nome da propriedade (data) ou value (select)) e prevSpecifier
			
			// Caso os dados essenciais não sejam passados, não faça nada!
			if(!action.payload.data || !action.payload.name)
				return muttableState;

			// Dados com id sem especificador. ex: alunosData
			if(!action.payload.specifier && action.payload.type == 'data' && action.payload.id && action.payload.prevId){
				delete muttableState.databaseData[action.payload.name][action.payload.prevId];
				muttableState.databaseData[action.payload.name][action.payload.id] = action.payload.data;
			}
			// Select sem especificador. ex: alunosSelect
			else if(!action.payload.specifier && action.payload.type == 'select' && action.payload.prevId){
				muttableState.databaseData[action.payload.name] = muttableState.databaseData[action.payload.name]
					.filter( cur => cur.value != action.payload.prevId);
				muttableState.databaseData[action.payload.name].push(action.payload.data);
				muttableState.databaseData[action.payload.name] = muttableState.databaseData[action.payload.name].sort(objOpe.comparator);
			}

			// Dados com id com especificador. ex: disciplinasData
			else if(action.payload.specifier && action.payload.type == 'data' && action.payload.id && action.payload.prevSpecifier && action.payload.prevId){
				if(!muttableState.databaseData[action.payload.name][action.payload.specifier]) muttableState.databaseData[action.payload.name][action.payload.specifier] = {}
				delete muttableState.databaseData[action.payload.name][action.payload.prevSpecifier][action.payload.prevId];
				muttableState.databaseData[action.payload.name][action.payload.specifier][action.payload.id] = action.payload.data;
			}

			// Select com especificador. ex: disciplinasSelect
			else if(action.payload.specifier && action.payload.type == 'select'){
				if(!muttableState.databaseData[action.payload.name][action.payload.specifier]) muttableState.databaseData[action.payload.name][action.payload.specifier] = []
				muttableState.databaseData[action.payload.name][action.payload.prevSpecifier] = muttableState.databaseData[action.payload.name][action.payload.prevSpecifier]
					.filter( cur => cur.value != action.payload.prevId);
				muttableState.databaseData[action.payload.name][action.payload.specifier].push(action.payload.data);
				muttableState.databaseData[action.payload.name][action.payload.specifier] = muttableState.databaseData[action.payload.name][action.payload.specifier].sort(objOpe.comparator);
			}

			fs.writeFileSync(`./src/database/${action.payload.name}.json`, JSON.stringify(muttableState.databaseData[action.payload.name], null, 4) );
			
			return muttableState;
		
		case actionTypes.DELETE_ON_FILE:// Deleta um certo dado no arquivo
		// Recebe: name, type (data ou select), id e specifier

			// Caso os dados essenciais não sejam passados, não faça nada!
			if(!action.payload.name && !action.payload.id)
				return muttableState;

			// Dados com id sem especificador. ex: alunosData
			if(!action.payload.specifier && action.payload.type == 'data'){
				delete muttableState.databaseData[action.payload.name][action.payload.id];
			}
			// Select com id sem especificador. ex: alunosSelect
			else if(!action.payload.specifier && action.payload.type == 'select'){
				
				muttableState.databaseData[action.payload.name] = muttableState.databaseData[action.payload.name]
					.filter( cur => cur.value != action.payload.id);
			}

			// Dados com id com especificador. ex: disciplinasData
			else if(action.payload.specifier && action.payload.type == 'data' && action.payload.specifier){

				delete muttableState.databaseData[action.payload.name][action.payload.specifier][action.payload.id];
			}

			// Select com id com especificador. ex: disciplinasSelect
			
			else if(action.payload.specifier && action.payload.type == 'select'){

				muttableState.databaseData[action.payload.name][action.payload.specifier] = muttableState.databaseData[action.payload.name][action.payload.specifier]
					.filter( cur => cur.value != action.payload.id);
			}
			
			fs.writeFileSync(`./src/database/${action.payload.name}.json`, JSON.stringify(muttableState.databaseData[action.payload.name], null, 4));
			
			return muttableState;

		case actionTypes.REPLACE_FILE:// Troca o conteúdo de um arquivo pelo campo de data no payload da action
		// Recebe: name, data, type ('select' ou 'data')
			
			if(action.payload.type == 'select'){
				muttableState.databaseData[action.payload.name] = [...action.payload.data]
			}
			else if(action.payload.type == 'data'){
				muttableState.databaseData[action.payload.name] = {...action.payload.data}
			}
			else if(action.payload.type == 'config'){
				muttableState.preferences = {...action.payload.data};
				fs.writeFileSync(`./src/database/configuracoes.json`, JSON.stringify(muttableState.preferences, null, 4));
				return muttableState;
			}
			else if(action.payload.type == 'session'){
				muttableState.sessions = {...action.payload.data};
				fs.writeFileSync(`./src/database/sessions.json`, JSON.stringify(muttableState.sessions, null, 4));
				return muttableState;
			}
			else{
				return muttableState;
			}
			fs.writeFileSync(`./src/database/${action.payload.name}.json`, JSON.stringify(muttableState.databaseData[action.payload.name], null, 4));
			return muttableState;

		case actionTypes.REGISTER_NEW_DATA:
			muttableState.newData = JSON.parse(fs.readFileSync(`./src/database/newDataContainer.json`, 'utf8'));
			return muttableState;

		case actionTypes.RESET_NEW_DATA:
			muttableState.newData = {};
			fs.writeFileSync(`./src/database/newDataContainer.json`, JSON.stringify(muttableState.newData, null, 4));
			return muttableState;
		

		case actionTypes.GET_STACK:
			muttableState.stack = JSON.parse(fs.readFileSync(`./src/database/stack.json`, 'utf8'));
			return muttableState;

		case actionTypes.PUSH_STACK:
			// Recebe o id no package assim como o tipo de dado
			muttableState.stack[action.type] = {
				data: action.payload.data
			}
			fs.writeFileSync(`./src/database/stack.json`, JSON.stringify(muttableState.stack, null, 4));
			return muttableState;

		case actionTypes.POP_STACK:
			// Recebe o tipo de dado a ser removido
			muttableState.stack[action.payload.type] = null;
			fs.writeFileSync(`./src/database/stack.json`, JSON.stringify(muttableState.stack, null, 4));
			return muttableState;

		case actionTypes.RESET_STACK:
			muttableState.stack = {
				alunos: null,
				professores: null,
				instituicoes: null,
				unidades: null,
				disciplinas: null,
				blocos: null,
				cursos: null,
				cidades: null
			}
			fs.writeFileSync(`./src/database/stack.json`, JSON.stringify(muttableState.stack, null, 4));
			return muttableState;

		case actionTypes.GET_PREFERENCES:
			muttableState.preferences = JSON.parse(fs.readFileSync(`./src/database/configuracoes.json`, 'utf8'));
			return muttableState;

		case actionTypes.EDIT_PREFERENCES:
			muttableState.preferences = action.payload.data;
			fs.writeFileSync(`./src/database/configuracoes.json`, JSON.stringify(action.payload.data, null, 4));
			return muttableState;

		case actionTypes.GET_SESSION:
			muttableState.sessions = JSON.parse(fs.readFileSync(`./src/database/sessions.json`, 'utf8'));
			return muttableState;

		case actionTypes.SAVE_SESSION:
			// payload:
			// label, id, state
			fs.readFile('./src/database/sessions.json', (err, data) => {
				if (err) throw err;
				let sessions = JSON.parse(data);
				sessions[action.payload.id] = {
					label: action.payload.label,
					id: action.payload.id,
					lastUpdate: action.payload.lastUpdate,
					state: action.payload.state
				}
				fs.writeFileSync(`./src/database/sessions.json`, JSON.stringify(sessions, null, 4));
			});
			return muttableState;
		
		case actionTypes.DELETE_SESSION:
			// payload:
			// id
			fs.readFile('./src/database/sessions.json', (err, data) => {
				if (err) throw err;
				let sessions = JSON.parse(data);
				delete sessions[action.payload.id];
				fs.writeFileSync(`./src/database/sessions.json`, JSON.stringify(sessions, null, 4));
			});
			return muttableState;

		case actionTypes.PULL_SELECTED_INST:
			muttableState.selectedInst = JSON.parse(fs.readFileSync(`./src/database/selectedInst.json`, 'utf8'));
			return muttableState;

		case actionTypes.PUSH_SELECTED_INST:
			muttableState.selectedInst = action.payload.data;
			fs.writeFileSync(`./src/database/selectedInst.json`, JSON.stringify(action.payload.data, null, 4));
			return muttableState;

		case actionTypes.RESET_SELECTED_INST:
			muttableState.selectedInst = null;
			fs.writeFileSync(`./src/database/selectedInst.json`, JSON.stringify(null, null, 4));
			return muttableState;

		case actionTypes.PULL_SELECTED_PROF:
			muttableState.selectedProf = JSON.parse(fs.readFileSync(`./src/database/selectedProf.json`, 'utf8'));
			return muttableState;

		case actionTypes.PUSH_SELECTED_PROF:
			muttableState.selectedProf = action.payload.data;
			fs.writeFileSync(`./src/database/selectedProf.json`, JSON.stringify(action.payload.data, null, 4));
			return muttableState;

		case actionTypes.RESET_SELECTED_PROF:
			muttableState.selectedProf = null;
			fs.writeFileSync(`./src/database/selectedProf.json`, JSON.stringify(null, null, 4));
			return muttableState;

		default:
			return muttableState;
	}
}

export default reducer;