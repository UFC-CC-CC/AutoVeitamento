import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../actions/actionTypes';
import SelectInput from "../DataReceivers/SelectInput/SelectInput";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import willContinue from '../../utilities/confirmAlert';
import "./Sessions.css";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import BlockDisplay from "../BlockDisplay/BlockDisplay";
import dateUtils from "../../utilities/dateUtilities.js";



class Sessions extends Component {

    state = {
        session: null,
        sessionData: null,
        sessionState: null
	}
	
	processSessionsOptions = () => {
		let options = [];
		for(let i in this.props.sessions){
			options.push({
				value: this.props.sessions[i].id,
				label: this.props.sessions[i].label
			})
        }
		options = options.sort((a, b) => {
            return this.props.sessions[b.value].lastUpdate-this.props.sessions[a.value].lastUpdate
        });
		return options;
	}

    preprocessData = () => {
        let sessionData = this.props.sessions[this.state.session.value];

        let newState = {
            aluno: null,
            inst: null,
            blocks: [],
            origin: {},
            destiny: {},
            date: null,
            obs: sessionData.state.obs,
            professor: null,
            cargo: null,
            processo: sessionData.state.processo,
            shouldAutoFill: sessionData.state.shouldAutoFill,
            initialDate: sessionData.id
        }

        if(sessionData.state.cargo)
            newState.cargo = sessionData.state.cargo == "Coordenador de Curso"?{value: "coord", label: "Coordenador de Curso"}: {value:"vice", label:"Vice-Coordenador de Curso"};


        if(sessionData.state.aluno)
            this.props.alunosSelect.map((c)=> { if(c.value === sessionData.state.aluno) newState.aluno = c });

        if(sessionData.state.professor)
            this.props.professoresSelect.map((c)=> { if(c.value === sessionData.state.professor) newState.professor = c });

        if(sessionData.state.inst)
            this.props.instituicoesSelect.map((c)=> { if(c.value === sessionData.state.inst) newState.inst = c });

        if(sessionData.state.blocks.length != 0){
            for(let i in sessionData.state.blocks)
                this.props.blocosSelect[sessionData.state.inst].map((c)=> { if(c.value === sessionData.state.blocks[i]) newState.blocks.push(c) });
            
            newState.origin = JSON.parse(JSON.stringify(sessionData.state.origin,null,4));
            for(let i in newState.origin)
                for(let j in newState.origin[i])
                    newState.origin[i][j].disciplina = this.props.disciplinasData[sessionData.state.inst][j]

            newState.destiny = JSON.parse(JSON.stringify(sessionData.state.destiny,null,4));
            for(let i in newState.destiny)
                for(let j in newState.destiny[i])
                    newState.destiny[i][j].disciplina = this.props.disciplinasData[this.props.configuracoes.instituicaoSelect.value][j]
        }

        this.setState({
            sessionState: newState
        });
    }

	sessionInputHandler = (data) => {
		this.setState({
            session: data,
            sessionData: this.props.sessions[data.value],
		}, this.preprocessData);
	}


    confirmDeleteSession = () => {
        confirmAlert({
			customUI: ({ onClose }) => {
				return (
				  <div className='custom-ui alert-container opaque'>
					<h2>Você tem certeza que gostaria de excluir essa sessão?</h2>
                    <h3>{this.state.session.label}</h3>
					<h3>Essa <b>ação</b> não poderá ser desfeita.</h3>
                    <br/>
					<br/>
                    <button
					 class="btn btn-primary mr-md-5"
					  onClick={() => {
						onClose();
                        this.deleteSession();
					  }}
					>
					  Sim, delete a sessão.
					</button>
					<button class="btn btn-danger mr-md-5" onClick={onClose}>Não, me enganei.</button>
				  </div>
				);
			  }
		});
    }

    deleteSession = () => {
        this.props.deleteSession({
            id: this.state.sessionData.id
        });
        this.setState({
            session: null,
            sessionData: null,
            sessionState: null
        });
    }

    render(){

        let renderedComponents;

        if(this.state.sessionState){
            let blocks = <Typography style={{textAlign: "center"}}>
                            <h4>Não foram selecionados blocos</h4>
                        </Typography>;

            if(this.state.sessionData.state.blocks.length > 0)
                blocks = <div className="blockContainer"> {this.state.sessionData.state.blocks.map((curr)=>

                                <BlockDisplay 
                                    origin={this.props.blocosData[this.state.sessionData.state.inst][curr].cursadas}
                                    destiny={this.props.blocosData[this.state.sessionData.state.inst][curr].aproveitadas}
                                />
                            )}
                </div>

            renderedComponents = (<div>
                
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h3>Detalhes da Sessão</h3>
                    </Typography>
                </Grow>
				<br/>
				<Slide in={true} direction="right">
                <div className="threeColumnGrid">
                    <Card className="card">
                        <CardContent>
                        <Typography variant="h5"> Aluno: </Typography>
                        <Typography>
                            {this.state.sessionData.state.aluno?this.state.sessionData.state.aluno + ": " + this.props.alunosData[this.state.sessionData.state.aluno].nome:"Aluno não definido"}
                        </Typography>
                        </CardContent>
                    </Card>
                    <Card className="card">
                        <CardContent>
                        <Typography variant="h5"> Instituição de Origem: </Typography>
                        <Typography>
                            {this.state.sessionData.state.inst?this.state.sessionData.state.inst + ": " + this.props.instituicoesData[this.state.sessionData.state.inst]:"Instituição de Origem não definida"}
                        </Typography>
                        </CardContent>
                    </Card>
                    <Card className="card">
                            <CardContent>
                            <Typography variant="h5"> Data: </Typography>
                            <Typography>
                            {dateUtils.getRawStringWithHours(this.state.sessionData.id)}
                            </Typography>
                            </CardContent>
                    </Card>
                       
                </div>
                </Slide>
				<Slide in={true} direction="right">
                    <div className="twoColumnGrid">
                        <Card className="card">
                            <CardContent>
                            <Typography variant="h5"> Responsável: </Typography>
                            <Typography>
                                {this.state.sessionData.state.professor?"("+this.props.professoresData[this.state.sessionData.state.professor].dep+") "+this.state.sessionData.state.professor + ": " + this.props.professoresData[this.state.sessionData.state.professor].nome:"Responsável não definido"} </Typography>
                            </CardContent>
                        </Card>
                        <Card className="card">
                            <CardContent>
                            <Typography variant="h5"> Observações: </Typography>
                            <Typography>
                            {this.state.sessionData.state.obs != ""?this.state.sessionData.state.obs:"O aproveitamento não possui observações"}
                            </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </Slide>
                <br/>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h3>Blocos de Aproveitamento</h3>
                    </Typography>
                </Grow>
                <br/>
                <Slide in={true} direction="right">  
                    <div>         
                        {blocks}
                    </div>
                </Slide>
                <br/>
                <Slide in={true} direction="right">   
                    <div>        
                    <Link to={{ pathname: '/aprov', state: { inMainWindow: true, carriedState: this.state.sessionState, inSession: true}}}>
                        <Button
                            component="div"
                            variant="contained"
                            color="primary"
                            onClick={()=>{}} >
                                Continuar esta Sessão
                        </Button>
                    </Link>
                    <br/><br/>
                    <Button
                            component="div"
                            variant="contained"
                            color="secondary"
                            onClick={this.confirmDeleteSession} >
                                Excluir esta Sessão
                    </Button>
                    </div>  
                </Slide>
                
                </div>
               
                );
        }
        return(

            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Continuar Sessão de Aproveitamento</h1>
                    </Typography>
                </Grow>
                <br />
                <Grow in={true}>
                    <SelectInput
                            id="sessao"
                            label="Selecione a Sessão a ser continuada"
                            placeholder="Matrícula: Nome do Aluno - Instituição de Origem - Data de Modificação"
                            desc="Sessões são salvas sempre que um aproveitamento é iniciado mas não é concluído. Selecione a sessão que deseja continuar para retornar ao processo de aproveitamento sem perder os dados."
                            value={this.state.session}
                            updateState={(data)=>this.sessionInputHandler(data)}
                            options={this.processSessionsOptions()}
                        />
                </Grow>
                <br />
                {renderedComponents}
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
		sessions: state.sessions,
        configuracoes: state.preferences
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
        updateSession: (pyld) => dispatch(
            {
                type: actionTypes.SAVE_SESSION,
                payload: {...pyld}
            }
        ),
        deleteSession: (pyld) => dispatch(
            {
                type: actionTypes.DELETE_SESSION,
                payload: {...pyld}
            }
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sessions);