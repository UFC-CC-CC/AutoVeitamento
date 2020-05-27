import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import SelectInput from "../../DataReceivers/SelectInput/SelectInput";
import "./ConsultaAproveitamento.css";
import willContinue from "../../../utilities/confirmAlert";
import DiscDetailsDisplay from "../../DataReceivers/DiscDetailsDisplay/DiscDetailsDisplay";
import confirmDeletePopup from "../../Edicao/ConfirmDeletePopup/ConfirmDeletePopup";
import pdfGen from "../../../utilities/generatePDF";
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import OneLineDisplay from "../../Consulta/DisplayComponents/OneLineDisplay/OneLineDisplay";
import OrdinaryDisplay from "../../Consulta/DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";
import MultiRowDisplay from "../../Consulta/DisplayComponents/MultiRowDisplay/MultiRowDisplay";
import SuperBlockCardComponent from "./SuperBlockCardComponent/SuperBlockCardComponent";

class ConsultaAproveitamento extends Component {

	state={
		aproveitamento: null,
		carriedState: null,
		data: null,
		backToMain: false
	}

	// WIP
    preprocessDataForPDF = () => {
        let meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

        const aprData = this.props.aproveitamentosData[this.state.carriedState.initialDate];
        let preprocessedData = {}
        let data = new Date(aprData.initialDate);
        preprocessedData.nomeAluno = this.props.alunosData[aprData.aluno].nome;
        preprocessedData.matriculaAluno = aprData.aluno;

        preprocessedData.cursoDestino = this.props.cursosData[aprData.curso].nome;
        preprocessedData.instituicaoDestino = this.props.instituicoesData[aprData.instDestino];

        preprocessedData.instituicaoOrigem = this.props.instituicoesData[aprData.inst];

        preprocessedData.numeroProcesso = aprData.processo;

        preprocessedData.cidade = this.props.cidadesData[aprData.cidade].nome;
        
        preprocessedData.dia = aprData.data.split('-')[2];
        preprocessedData.mes = meses[Number(aprData.data.split('-')[1]) - 1];
        preprocessedData.ano = aprData.data.split('-')[0];

        preprocessedData.cargo = aprData.cargo;


		preprocessedData.origin = {};
		preprocessedData.destiny = {};

		for(let i in aprData.originState){
			preprocessedData.origin[i] = [];
			for(let j in aprData.originState[i]){
				preprocessedData.origin[i].push(`& ${aprData.originState[i][j].semestre} & ${j} ${this.props.disciplinasData[aprData.inst][j].nome} & ${Number(aprData.originState[i][j].nota).toFixed(1)} & ${this.props.disciplinasData[aprData.inst][j].horas} h\n`);
			}
		}

		for(let i in aprData.destinyState){
			preprocessedData.destiny[i] = [];
			for(let j in aprData.destinyState[i]){
				preprocessedData.destiny[i].push(`& ${j} ${this.props.disciplinasData[aprData.instDestino][j].nome} & ${Number(aprData.destinyState[i][j].nota).toFixed(1)}\n& \\hspace{0,3cm} ${aprData.destinyState[i][j].horasApr} h\n`);
			}
		}

        return preprocessedData;
    }

	generateReport = () => {
		try{
			pdfGen.generateTestPDF(this.preprocessDataForPDF(),this.state.carriedState.aluno.value+"-"+this.state.carriedState.inst.value+"-")    
            alert("Relatório gerado!\nEstá disponível na pasta 'Relatórios Gerados', dentro da pasta da aplicação.");
        }
        catch(e){
            alert("Ocorreu um erro ao gerar o seu relatório! Por favor, verifique se o seu computador possui uma versão do LaTeX instalado.")
        }
    }

	aproveitamentoHandler = (data) => {
		this.setState({
			aproveitamento: {...data}
		}, this.preprocessData);
	}

	fieldHandler = (field, data, callback) => this.setState({[field]: data}, callback);


	checkIsDeleteOk = () => {
		confirmDeletePopup(this.deleteApr);
	}

	deleteApr = () => {
		let currentId = this.state.aproveitamento.value;
		this.setState({
			aproveitamento: null,
			carriedState: null,
			data: null,
			backToMain: false
		}, () => {
			this.props.deleteOnFile({
				name: 'aproveitamentosData',
				type: 'data',
				id: currentId
			});
			
			this.props.deleteOnFile({
				name: 'aproveitamentosSelect',
				type: 'select',
				id: currentId
			});
		})
		

		this.fieldHandler('aproveitamento', null)
		// Sempre mandar para tela inicial após deletar um aproveitamento
		willContinue((data)=>{this.fieldHandler('backToMain', data)}, true);
	}

	preprocessData = () => {
		let aprData = this.props.aproveitamentosData[this.state.aproveitamento.value];
		let data = aprData.data;
		let newState = {
			aluno: null,
			inst: null,
			blocks: [],
			origin: {},
			destiny: {},
			date: data,
			obs: aprData.obs,
			cargo: null,
			professor: null,
			processo: aprData.processo,
			shouldAutoFill: true,
			initialDate: aprData.initialDate
		};

		if(aprData.cargo)
            newState.cargo = aprData.cargo == "Coordenador de Curso"?{value: "coord", label: "Coordenador de Curso"}: {value:"vice", label:"Vice-Coordenador de Curso"};


		if(aprData.aluno)
            this.props.alunosSelect.map((c)=> { if(c.value === aprData.aluno) newState.aluno = c });

		if(aprData.responsavel)
            this.props.professoresSelect.map((c)=> { if(c.value === aprData.responsavel) newState.professor = c });

		if(aprData.inst)
            this.props.instituicoesSelect.map((c)=> { if(c.value === aprData.inst) newState.inst = c });

		if(aprData.blocos.length != 0){
			for(let i in aprData.blocos)
				this.props.blocosSelect[aprData.inst].map((c)=> { if(c.value === aprData.blocos[i].codigo) newState.blocks.push(c) });
			
			newState.origin = JSON.parse(JSON.stringify(aprData.originState,null,4));
			for(let i in newState.origin)
				for(let j in newState.origin[i])
					newState.origin[i][j].disciplina = this.props.disciplinasData[aprData.inst][j]

			newState.destiny = JSON.parse(JSON.stringify(aprData.destinyState,null,4));
			for(let i in newState.destiny)
				for(let j in newState.destiny[i])
					newState.destiny[i][j].disciplina = this.props.disciplinasData[this.props.configuracoes.instituicaoSelect.value][j]
		}

		this.setState({
			carriedState: newState,
			data: data
        });

	}
    render(){

		let detalhesAproveitamento;

		if(this.state.carriedState){
			let initialDate = new Date(this.state.carriedState.initialDate);
			let data = this.state.data.split('-')[2] + "/" +this.state.data.split('-')[1]+"/"+this.state.data.split('-')[0] + " às " + initialDate.getHours() +":"+(initialDate.getMinutes() < 10 ? "0"+initialDate.getMinutes():initialDate.getMinutes());
			let aprData = {...this.props.aproveitamentosData[this.state.aproveitamento.value]};

			let cpf = this.props.alunosData[aprData.aluno].cpf;
			detalhesAproveitamento = (
			<div>
				<Grow in={true}>
                        <Typography style={{textAlign: "center"}}>
							<h1>Detalhes do Aproveitamento</h1>                        
						</Typography>
                    </Grow>
				<br/>
				
				<Slide in={true} direction="right">
					<div className="twoColumnGrid2">
						<MultiRowDisplay
							mainTitle="Aluno"
							titles={["Nome", "Matrícula", "CPF", "Instituição de Origem"]}
							datas={[`${this.props.alunosData[aprData.aluno].nome}`, aprData.aluno, `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}.${cpf.substr(6, 3)}-${cpf.substr(9, 2)}`, `${aprData.inst} - ${this.props.instituicoesData[aprData.inst]}`]}
						/>
						<MultiRowDisplay
							mainTitle="Dados do Aproveitamento"
							titles={["Curso de Destino", "Responsável", "N° do Processo", "Local & Data"]}
							datas={[this.props.cursosData[aprData.curso].nome, `${aprData.responsavel} - ${this.props.professoresData[aprData.responsavel].nome}`, aprData.processo, `${this.props.cidadesData[aprData.cidade].nome}, ${data}`]}
						/>
					</div>
				</Slide>
				<Slide in={true} direction="right">
					<div>
						<OneLineDisplay
							title="Observações"
							data={aprData.obs ? aprData.obs : "Este aproveitamento não possui observações"}
						/>
					</div>
				</Slide>
				<br/>
				<Grow in={true}>
					<Typography style={{textAlign: "center"}}>
						<h1>Blocos do Aproveitamento</h1>                        
					</Typography>
				</Grow>
				<br/>
				<div>
					{
					aprData.blocos.map((curr)=>{
						
						let blocoAtual = this.props.blocosData[aprData.inst][curr.codigo];
						

						return(
						<div>
							<SuperBlockCardComponent 
								blockTitle={curr.label}
								blockDate={`${blocoAtual.data.split("-")[2]}/${blocoAtual.data.split("-")[1]}/${blocoAtual.data.split("-")[0]}`}
								blockSol={{
									siape: blocoAtual.solicitador,
									nome: this.props.professoresData[blocoAtual.solicitador].nome,
									dep: `${this.props.professoresData[blocoAtual.solicitador].dep} - ${this.props.unidadesData[this.props.professoresData[blocoAtual.solicitador].dep]}`
									}}
								blockPar={ this.props.professoresData[blocoAtual.parecerista]?{
									siape: this.props.professoresData[blocoAtual.parecerista].nome,
									nome: blocoAtual.parecerista,
									dep: `${this.props.professoresData[blocoAtual.parecerista].dep} - ${this.props.unidadesData[this.props.professoresData[blocoAtual.parecerista].dep]}`
									}:null}
								blockObs={blocoAtual.obs}
								blockOrigin={curr.cursadas.map(origin =>({
									id:curr.codigo,
									disciplina:this.props.disciplinasData[aprData.inst][origin],
									nota:aprData.origin[origin].nota,
									semestre:aprData.origin[origin].semestre
								}))}
								blockDestiny={curr.aproveitadas.map(destiny=>({ 
									id:curr.codigo,
									disciplina:this.props.disciplinasData[aprData.instDestino][destiny],
									nota:aprData.destiny[destiny].nota,
									hora:aprData.destiny[destiny].horasApr
								}))}
							/>
							<br/>
							<br/>
						</div>
					)})
					}
				</div>

			</div>
			);
		}


        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                    <Grow in={true}>
                        <Typography style={{textAlign: "center"}}>
							<h1>Consulta de Aproveitamentos</h1>                        
						</Typography>
                    </Grow>
				<br/>
				<Slide in={true} direction="right">
					<SelectInput
						id="consultaAproveitamentos"
						label="Aproveitamento:"
						placeholder="ALUNO (INSTITUIÇÃO DE ORIGEM) em DATA"
						desc="Selecione o Aproveitamento realizado que deseja consultar."
						value={this.state.aproveitamento}
						updateState={(data)=>{this.aproveitamentoHandler(data)}}
						options={this.props.aproveitamentosSelect.sort((a, b) => b.value - a.value)}
					/>
				</Slide>
				<br/>
				{detalhesAproveitamento}
				<br/>
				<Slide in={this.state.aproveitamento} direction="right">
                        <div>
                            <Button
                                component="div"
                                variant="contained"
                                color="primary"
                                onClick={()=>{this.generateReport()}} >
									Gerar Relatório
                            </Button>
							<br/>
							<br/>
							<Link to={{ pathname: '/aprov', state: { inMainWindow: true, carriedState:this.state.carriedState }}}>
								<Button
									component="div"
									variant="contained"
									color="primary"
								>
										Editar este Aproveitamento
								</Button>
							</Link>
							<br/>
							<br/>
							<Button
                                component="div"
                                variant="contained"
                                color="secondary"
                                onClick={()=>{this.checkIsDeleteOk()}} >
									Excluir Aproveitamento
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
        professoresData: state.databaseData.professoresData,
        professoresSelect: state.databaseData.professoresSelect,
        blocosData: state.databaseData.blocosData,
        blocosSelect: state.databaseData.blocosSelect,
        instituicoesData: state.databaseData.instituicoesData,
        instituicoesSelect: state.databaseData.instituicoesSelect,  
        disciplinasData: state.databaseData.disciplinasData,
        disciplinasSelect: state.databaseData.disciplinasSelect,
        aproveitamentosData: state.databaseData.aproveitamentosData,
		aproveitamentosSelect: state.databaseData.aproveitamentosSelect,
		unidadesData: state.databaseData.unidadesData,
		unidadesSelect: state.databaseData.unidadesSelect,
		cursosData: state.databaseData.cursosData,
		cursosSelect: state.databaseData.cursosSelect,
		configuracoes: state.preferences,
		cidadesData: state.databaseData.cidadesData,
		cidadesSelect: state.databaseData.cidadesSelect,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        updateFile: (pyld) => dispatch(
            {
                type: actionTypes.ADD_ON_FILE,
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

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaAproveitamento);