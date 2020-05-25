import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../actions/actionTypes';
import DiscDetailsInput from '../DataReceivers/DiscDetailsInput/DiscDetailsInput';
import SelectInput from "../DataReceivers/SelectInput/SelectInput";
import SelectMulti from "../DataReceivers/SelectMulti/SelectMulti";
import TextInput from "../DataReceivers/TextInput/TextInput";
import DateInput from "../DataReceivers/DateInput/DateInput";
import "./Aproveitamento.css";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import willContinue from '../../utilities/confirmAlert';
import pdfGen from "../../utilities/generatePDF";
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

class Aproveitamento extends Component {

    state = {
        aluno: null,
        inst: null,
        blocks: [],
        origin: {},
        destiny: {},
        date: null,
        obs: "",
        professor: null,
        shouldAutoFill: true,
        initialDate: null,
        cargo: {value: "coord", label: "Coordenador de Curso"},
        processo: "",
        isEditor: false,
        showNotifications: false
    }

    componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.initialDate == null && this.props.location&&this.props.location.state&&this.props.location.state.carriedState){
            this.setState(this.props.location.state.carriedState);
            if(this.props.location.state.carriedState.inst){
                this.props.updateSelectedInst({data: this.props.location.state.carriedState.inst});
            }
            if(this.props.location.state.carriedState.professor){
                this.props.updateSelectedProf({data: this.props.location.state.carriedState.professor});
            }
            if(!this.props.location.state.inSession)
                this.setState({
                    isEditor: true
                });

        }
        else{
            this.setState({
                initialDate: new Date().getTime()
            })
        }
    }

    countDecimals =  (value) => {
        if(Math.floor(value) === value) return 0;
        return value.toString().split(".")[1].length || 0; 
    }

    fixHoursFields = () => {
        let tempState = JSON.parse(JSON.stringify(this.state, null, 4));
        let alterations = [];

        for(let i in tempState.destiny){
            for(let j in tempState.destiny[i]){
                if(Number(tempState.destiny[i][j].horasApr) % 1 != 0){
                    tempState.destiny[i][j].horasApr = Number(tempState.destiny[i][j].horasApr).toFixed(0);
                    alterations.push(tempState.destiny[i][j].disciplina.nome);
                }
            }
        }
        this.setState(tempState);
        
        let alertString = "Atenção!\nOs campos de Horas Aproveitadas foram ajustados nas seguintes disciplinas:\n";
        for(let i in alterations)
            alertString += `\n${alterations[i]}`
        if(alterations.length > 0)
            alert(alertString);
        return alterations;
    }

    fixGradesFields = () => {
        let tempState = JSON.parse(JSON.stringify(this.state, null, 4));
        let alterations = [];

        for(let i in tempState.origin){
            for(let j in tempState.origin[i]){
                if(this.countDecimals(Number(tempState.origin[i][j].nota)) > 1){
                    tempState.origin[i][j].nota = Number(tempState.origin[i][j].nota).toFixed(1);
                    alterations.push(tempState.origin[i][j].disciplina.nome);
                }
            }
        }

        for(let i in tempState.destiny){
            for(let j in tempState.destiny[i]){
                if(this.countDecimals(Number(tempState.destiny[i][j].nota)) > 1){
                    tempState.destiny[i][j].nota = Number(tempState.destiny[i][j].nota).toFixed(1);
                    alterations.push(tempState.destiny[i][j].disciplina.nome);
                }
            }
        }

        this.setState(tempState);
        
        let alertString = "Atenção!\nOs campos de Notas foram ajustados nas seguintes disciplinas:\n";
        for(let i in alterations)
            alertString += `\n${alterations[i]}`
        if(alterations.length > 0)
            alert(alertString);
        return alterations;
    }

    saveSession = () => {
        let alunoLabel = (this.state.aluno?this.state.aluno.label:"Aluno não definido");
        let instLabel = (this.state.inst?this.state.inst.value:"Instituição não definida");
        let data = new Date();
        let dataLabel = `${data.getDate() < 10? "0"+(data.getDate()) : data.getDate()}/${data.getMonth()+1 < 10 ? "0"+(data.getMonth()+1) : data.getMonth()+1}/${data.getFullYear()} ${data.getHours()}:${data.getMinutes() < 10 ? "0"+data.getMinutes() : data.getMinutes()}`
        let savedState = {
            aluno: this.state.aluno?this.state.aluno.value:null,
            inst: this.state.inst?this.state.inst.value:null,
            blocks: this.state.blocks.map(curr=>curr.value),
            origin: JSON.parse(JSON.stringify(this.state.origin)),
            destiny: JSON.parse(JSON.stringify(this.state.destiny)),
            date: this.state.date,
            obs: this.state.obs,
            professor: this.state.professor?this.state.professor.value:null,
            cargo: this.state.cargo,
            processo: this.state.processo,
            shouldAutoFill: this.state.shouldAutoFill
        }

        for(let i in this.state.origin){
            savedState.origin[i] = {};
            for(let j in this.state.origin[i]){
                savedState.origin[i][j] = {
                    id: this.state.origin[i][j].id,
                    nota: this.state.origin[i][j].nota,
                    semestre: this.state.origin[i][j].semestre,
                    disciplina: this.state.origin[i][j].disciplina.codigo
                }
            }
        }

        for(let i in this.state.destiny){
            savedState.destiny[i] = {}
            for(let j in this.state.destiny[i]){
                savedState.destiny[i][j] = {
                    id: this.state.destiny[i][j].id,
                    nota: Number(this.state.destiny[i][j].nota).toFixed(1),
                    horasApr: this.state.destiny[i][j].horasApr,
                    disciplina: this.state.destiny[i][j].disciplina.codigo
                }
            }
        }

        this.props.updateSession({
            label: `${alunoLabel} - ${instLabel} - ${dataLabel}`,
            id: this.state.initialDate,
            lastUpdate: data.getTime(),
            state: savedState
        });
    }

    fieldHandler = (field, data, callback) => this.setState({[field]: data}, callback);

    profHandler = (data, callback) => {
        this.props.updateSelectedProf({data: data});    
        this.setState({professor: data}, callback);
    }
    instHandler = (data, callback) =>{
        this.props.updateSelectedInst({data: data});    
        this.setState({
            inst: data,
            blocks: [],
            origin: {},
            destiny: {},
            shouldAutoFill: true
        }, callback);
}


    discDetailsInputHandler = (ood,id,index,field, data) => {
        let tempState = {...this.state};
        tempState[ood][id][index][field] = data;
        if(ood == 'destiny' && field == 'nota')
            tempState.shouldAutoFill = false
        this.setState(tempState, ()=>{
            this.autofillGrades();
            if(this.checkAutoFill()){
                this.setState({shouldAutoFill: true})
            }
        });
       
    }

    checkAutoFill = () => {
        let reset = true;
        for(let i in this.state.destiny)
            for(let j in this.state.destiny[i]){
                if(this.state.destiny[i][j].nota) reset = false
            }
             
        return reset
    }

    blockHandler = (data, callback) => {
        let origin = {};
        let destiny = {};

            try{
                data.map((current)=>{
                    if(this.state.inst && this.props.blocosData[this.state.inst.value] && !this.props.blocosData[this.state.inst.value][current.value])
                        return

                    origin[current.value] = {}
                    this.props.blocosData[this.state.inst.value][current.value].cursadas.map((curr)=>{
                        origin[current.value][curr] = {
                            id: curr,
                            nota: 0,
                            semestre: "",
                            disciplina: this.props.disciplinasData[this.state.inst.value][curr]
                        }
                    });

                    destiny[current.value] = {};
                    this.props.blocosData[this.state.inst.value][current.value].aproveitadas.map((curr)=>{
                        destiny[current.value][curr] = {
                            id: curr,
                            nota: 0,
                            horasApr: 0,
                            disciplina: this.props.disciplinasData[this.props.configuracoes.instituicaoSelect.value][curr]
                        }
                    });
                    
                });
                
                let previousState = {...this.state};

                for(let i in origin){
                    if(previousState.origin[i]){
                        origin[i] = {...previousState.origin[i]}
                    }
                }

                for(let i in destiny){
                    if(previousState.destiny[i]){
                        destiny[i] = {...previousState.destiny[i]}
                    }
                }
                this.setState({blocks: data,
                              origin: origin,
                              destiny: destiny}, ()=>{
                                  if(callback)
                                    callback();
                                  this.autoFillHours();
                            });
            }
            catch(e){
                //alert("Error on aproveitamento. That one >:(")
                setTimeout(()=>this.blockHandler(data, callback),500);
            }

        
    }

    autofillGrades = () => {
        if(!this.state.shouldAutoFill) return

        for(let i in this.state.origin){
            let sum = 0;
            for(let j in this.state.origin[i]){
                sum += parseFloat(this.state.origin[i][j].nota);
            }
            sum = (sum/Object.keys(this.state.origin[i]).length).toFixed(1);
            let tempState = {...this.state}
            for(let j in this.state.destiny[i])
                tempState.destiny[i][j].nota = sum;
                
            this.setState(tempState);
        }

    }

    autoFillHours = () => {

        let tempState = {...this.state}

        for(let j in this.state.origin){
            let sumOrigin = 0;
            
            for(let i in this.state.origin[j]){
                sumOrigin += parseInt(this.state.origin[j][i].disciplina.horas)
            }

            sumOrigin = Number(sumOrigin/Object.keys(this.state.destiny[j]).length).toFixed(0);
                
            for(let i in this.state.destiny[j]){
                tempState.destiny[j][i].horasApr = sumOrigin
            }
        }
    
        this.setState(tempState);
    }

    
    preprocessDataForPDF = () => {
        let meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

        const aprData = this.props.aproveitamentosData[this.state.initialDate];
        let preprocessedData = {}
        let data = new Date(aprData.initialDate);
        preprocessedData.nomeAluno = this.props.alunosData[aprData.aluno].nome;
        preprocessedData.matriculaAluno = aprData.aluno;

        preprocessedData.cursoDestino = this.props.cursosData[aprData.curso].nome;
        preprocessedData.instituicaoDestino = this.props.instituicoesData[aprData.instDestino];

        preprocessedData.instituicaoOrigem = this.props.instituicoesData[aprData.inst];

        preprocessedData.numeroProcesso = aprData.processo;

        preprocessedData.cidade = this.props.cidadesData[aprData.cidade].nome;
        preprocessedData.dia = data.getDate();
        preprocessedData.mes = meses[data.getMonth()];
        preprocessedData.ano = data.getFullYear();

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
            pdfGen.generateTestPDF(this.preprocessDataForPDF(),this.state.aluno.value+"-"+this.state.inst.value+"-")    
            alert("Relatório gerado!\nEstá disponível na pasta 'Relatórios Gerados', dentro da pasta da aplicação.");
        }
        catch(e){
            alert("Ocorreu um erro ao gerar o seu relatório! Por favor, verifique se o seu computador possui uma versão do LaTeX instalado.")
        }
        
	}

    askGenerateReport = () => {
        confirmAlert({
			customUI: ({ onClose }) => {
				return (
				  <div className='custom-ui alert-container'>
					<h2>Seu aproveitamento foi realizado com sucesso!</h2>
                    <h3>Gostaria de gerar o relatório desse aproveitamento agora?</h3>
					<h3>Esta opção estará disponível na tela de Consulta de Aproveitamentos,</h3>
                    <h3> caso opte por não gerá-lo agora.</h3>
                    <br/>
					<br/>
                    <button
					 class="btn btn-primary mr-md-5"
					  onClick={() => {
						onClose();
                        this.generateReport();
                        willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
					  }}
					>
					  Sim, por favor.
					</button>
					<button class="btn btn-danger mr-md-5" onClick={()=>{
                        onClose();
                        willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
                    }}>Não, obrigado.</button>
				  </div>
				);
			  }
		});
    }

    confirmRegister = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
				  <div className='custom-ui alert-container'>
					<h2>Tem certeza que deseja {this.state.isEditor?"editar":"realizar"} esse aproveitamento?</h2>
					<br/>
					<br/>
                    <button
					 class="btn btn-primary mr-md-5"
					  onClick={() => {
						onClose();
						this.registerAproveitamento();
					  }}
					>
					  Sim, conclua {this.state.isEditor?"a edição":"o cadastro"}.
					</button>
					<button class="btn btn-danger mr-md-5" onClick={onClose}>Não, deixe-me confirmar os dados mais uma vez.</button>
				  </div>
				);
			  }
		});
	  };

    registerAproveitamento = () => {
        let originObj = {};
        let destinyObj= {};

        for(let i in this.state.origin)
            for(let j in this.state.origin[i])
                originObj[this.state.origin[i][j].id] = {
                    id: this.state.origin[i][j].id,
                    nota: Number(this.state.origin[i][j].nota).toFixed(1),
                    semestre: this.state.origin[i][j].semestre
                };
            
        for(let i in this.state.destiny)
            for(let j in this.state.destiny[i])
                destinyObj[this.state.destiny[i][j].id] = {
                    id: this.state.destiny[i][j].id,
                    nota: Number(this.state.destiny[i][j].nota).toFixed(1),
                    horasApr: this.state.destiny[i][j].horasApr
                };

        let data = new Date(this.state.initialDate);
        
        let originState = JSON.parse(JSON.stringify(this.state.origin));
        for(let i in originState)
            for(let j in originState[i])
                delete originState[i][j].disciplina
        
        let destinyState = JSON.parse(JSON.stringify(this.state.destiny));
        for(let i in destinyState)
            for(let j in destinyState[i])
                delete destinyState[i][j].disciplina
            

        this.props.updateFile({
            name: 'aproveitamentosData',
            data: {
                aluno: this.state.aluno.value,
                inst: this.state.inst.value,
                responsavel: this.state.professor.value,
                data: this.state.date,
                obs: this.state.obs,
                blocos: this.state.blocks.map((curr)=> ({ 
                    codigo: curr.value,
                    label: curr.label,
                    cursadas: this.props.blocosData[this.state.inst.value][curr.value].cursadas,
                    aproveitadas: this.props.blocosData[this.state.inst.value][curr.value].aproveitadas  
                })),
                blocosLabel: this.state.blocks.map((curr)=>curr.label),
                origin: originObj,
                destiny: destinyObj,
                originState: originState,
                destinyState: destinyState,
                instDestino: this.props.configuracoes.instituicaoSelect.value,
                cidade:this.props.configuracoes.cidadeSelect.value, 
                curso: this.props.configuracoes.cursoSelect.value,
                coordenador: this.props.configuracoes.coordenadorSelect.value,
                cargo: this.state.cargo.label,
                processo: this.state.processo,
                label: `${this.state.aluno.label} (${this.state.inst.value}) em ${data.getDate() < 10? "0"+(data.getDate()) : data.getDate()}/${data.getMonth()+1 < 10 ? "0"+(data.getMonth()+1) : data.getMonth()+1}/${data.getFullYear()} às ${data.getHours()}:${data.getMinutes() < 10 ? "0"+data.getMinutes() : data.getMinutes()}`,
                initialDate: this.state.initialDate
            },
            type: 'data',
            id: this.state.initialDate
        });

        

        this.props.updateFile({
            name: 'aproveitamentosSelect',
            data: {
                label: `${this.state.aluno.label} (${this.state.inst.value}) em ${data.getDate() < 10? "0"+(data.getDate()) : data.getDate()}/${data.getMonth()+1 < 10 ? "0"+(data.getMonth()+1) : data.getMonth()+1}/${data.getFullYear()} às ${data.getHours()}:${data.getMinutes() < 10 ? "0"+data.getMinutes() : data.getMinutes()}`,
                value: this.state.initialDate
            },
            type: 'select'
        });

        this.props.deleteSession({
            id: this.state.initialDate
        })

        this.askGenerateReport();
    
    }

    isEmpty = () => {

        if(!this.state.aluno || !this.state.inst || !this.state.date || !this.state.professor || this.state.blocks.length == 0 || !this.state.processo || !this.state.cargo)
            return true
        for(let i in this.state.origin)
            for(let j in this.state.origin[i])
                if(!this.state.origin[i][j].semestre)
                    return true

        
        for(let i in this.state.destiny)
            for(let j in this.state.destiny[i])
                if(!this.state.destiny[i][j].horasApr)
                    return true

        return false
        
    }

    generateHoursWarning = () => {
        try{
            const minPer = this.props.configuracoes.percent/100;

            let failures = [];

            this.state.blocks.map( curr => {
                let sumOfHoursOrigin = 0;
                let sumOfHoursDestiny = 0;

                this.props.blocosData[this.state.inst.value][curr.value].cursadas.map( originDisc => {     
                    sumOfHoursOrigin += Number(this.props.disciplinasData[this.state.inst.value][originDisc].horas);
                    return;
                });
                
                this.props.blocosData[this.state.inst.value][curr.value].aproveitadas.map( destinyDisc => {
                    sumOfHoursDestiny += Number(this.props.disciplinasData[this.props.configuracoes.instituicaoSelect.value][destinyDisc].horas);
                    return;
                });
                if(sumOfHoursOrigin < sumOfHoursDestiny*minPer)
                    failures.push(curr.value);

                return
            });

            return failures;
        }
        catch(e){
            return [];
        }
    }

    render(){

        if(this.state.backToMain){
            return <Redirect to="/" />
        }

        if(!this.props.configuracoes.instituicaoSelect || !this.props.configuracoes.coordenadorSelect || !this.props.configuracoes.cursoSelect || !this.props.configuracoes.cidadeSelect){
            return(
                <div>
                    <Typography>
                        <h3 class="spacing_cb">Aproveitamento de Cadeiras</h3>
                        <br/>
                        <br/>
                        <h4 class="spacing_cb">Não é possível realizar um Aproveitamento de Cadeiras sem antes ter preenchido todos os campos nas configurações!</h4>
                        <br/>
                        <Link to={{ pathname: '/editorConfig', state: { inMainWindow: true, redirectRoute: '/aprov' }}}>
                            <button class="btn btn-primary">Editar Configurações</button>
                        </Link>
                    </Typography>
                </div>
            );
        }

        let blocksSelect;
        if(this.state.inst){
            blocksSelect = (
                <Slide in={this.state.inst} direction="right">
                    <SelectMulti 
                                id="blocosAproveitamento"
                                type="blocos"
                                inst={this.state.inst.value}
                                isCreatable
                                label="Blocos de Aproveitamento: "
                                placeholder="CURSADAS aproveitando APROVEITADAS"
                                desc="Selecione os Blocos de Aproveitamento a serem utilizados no Aproveitamento"
                                value={this.state.blocks}
                                updateState={(data, callback)=>{this.blockHandler(data, callback)}}
                                link="/cadastroBloc"
                                linkText="Cadastrar novo Bloco de Aproveitamento"
                                options={this.props.blocosSelect[this.state.inst.value]}
                                onBlur={this.saveSession}
                            />
                    </Slide>);
        }

        let origin = {};
        let destiny = {};

        for(let i in this.state.origin){
            origin[i] = [];
            for(let index in this.state.origin[i]){
                origin[i].push(<DiscDetailsInput
                    id={i+"id:"+index}
                    key={i+"id:"+index}
                    disciplina={this.state.origin[i][index].disciplina}
                    type='cursada'
                    nota={this.state.origin[i][index].nota}
                    semestre={this.state.origin[i][index].semestre}
                    updateState={(field, data)=>this.discDetailsInputHandler('origin',i,index,field,data)}
                    onBlur={this.saveSession}
                    hoursFix={this.fixHoursFields}
                    gradeFix={this.fixGradesFields}
                />);
            }
        }

        for(let i in this.state.destiny){
            destiny[i] = [];
            for(let index in this.state.destiny[i]){
                destiny[i].push(<DiscDetailsInput
                    id={i+"id:"+index}
                    key={i+"id:"+index}
                    disciplina={this.state.destiny[i][index].disciplina}
                    type='aproveitada'
                    nota={this.state.destiny[i][index].nota}
                    hora={this.state.destiny[i][index].horasApr}
                    semestre={this.state.destiny[i][index].semestre}
                    updateState={(field, data)=>this.discDetailsInputHandler('destiny',i,index,field,data)}
                    onBlur={this.saveSession}
                    hoursFix={this.fixHoursFields}
                    gradeFix={this.fixGradesFields}
                />)
            }
        }

        let originFields = [];
        let destinyFields = [];

        for(let i in origin){
            originFields.push(<div className="singleColumn">
                {origin[i]}
            </div>);
        }

        for(let i in destiny){
            destinyFields.push(<div className="singleColumn">
                {destiny[i]}
            </div>);
        }

        let renderedComponents = [];

        let blocosIds = Object.keys(this.state.origin);


        if(this.state.inst && this.props.blocosSelect[this.state.inst.value])
            for(let i = 0; i < this.state.blocks.length; i++){
                let label;
                this.props.blocosSelect[this.state.inst.value].map((curr)=>{
                    if(curr.value == blocosIds[i])
                        label = curr.label;
                });

                // Não sincronia
                if(blocosIds.length != this.state.blocks.length){
                    return this.render();
                }

                let blocoAtual = this.props.blocosData[this.state.inst.value][blocosIds[i]];

                // Não sincronia
                if(!blocoAtual.data){
                    return this.render();
                }

                renderedComponents.push(
                <Fade in={true}>
                    <div>
                        <hr/>
                        <h3>{label}</h3>
                        <h5>Cadastrado em {blocoAtual.data.split("-")[2]}/{blocoAtual.data.split("-")[1]}/{blocoAtual.data.split("-")[0]}</h5>
                        <div className="tripleColumn">
                            <div className="blocosData">
                                <h4>Solicitador:</h4>
                                <p><b>{this.props.professoresData[blocoAtual.solicitador].siape} : </b>{this.props.professoresData[blocoAtual.solicitador].nome}</p>
                            </div>
                            <div className="blocosData">
                                <h4>Parecerista:</h4>
                                {
                                    this.props.professoresData[blocoAtual.parecerista]?
                                    (<p><b>{this.props.professoresData[blocoAtual.parecerista].siape} : </b>{this.props.professoresData[blocoAtual.parecerista].nome}</p>)
                                    :("O bloco não possui parecerista")
                                }
                                
                            </div>
                            {
                                blocoAtual.obs != "" ? (<div className="blocosData">
                                                            <h4>Observações:</h4>
                                                            <p>{blocoAtual.obs}</p>
                                                        </div>) : (<div className="blocosData">
                                                            <h4>O bloco não possui observações.</h4>
                                                        </div>)
                            }
                        </div>
                        <br/>
                        <br/>
                        <Typography>
                        <div className="doubleColumn">
                            {originFields[i]}
                            {destinyFields[i]}
                        </div>

                        </Typography>
                        
                    </div>
                </Fade>
                )
            }

        const warnings = this.generateHoursWarning();

        let blockHourWarning = [];

        if(warnings.length > 0){
            blockHourWarning = (<Typography>
                        <br/>
                        <h3 style={{color: "blue"}}>Atenção! Os seguintes blocos de aproveitamento não condizem com a porcentagem mínima de horas configurada: ({this.props.configuracoes.percent<10?'0'+this.props.configuracoes.percent:this.props.configuracoes.percent}%)</h3>
                        <ul style={{color: "blue"}}>
                            {warnings.map(curr => <li>{this.props.blocosData[this.state.inst.value][curr].label}</li>)}
                        </ul>
                        <h3 style={{color: "blue"}}>Por favor, certifique-se que os blocos escolhidos estão corretos antes de finalizar esse aproveitamento.</h3>
                        <br/>
                    </Typography>

        );}


        return(
            <div>
                <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                    <Grow in={true}>
                        <Typography style={{textAlign: "center"}}>
                            <h1>{this.state.isEditor?"Edição de Aproveitamento":"Aproveitamento de Cadeiras"}</h1>
                        </Typography>
                    </Grow>
                    <br/>
                    <div className="wrapper" >
                        <Slide in={true} direction="right">
                            <SelectInput
                                id="aproveitamentoAluno"
                                type="alunos"
                                label="Aluno:"
                                placeholder="Matrícula: Nome"
                                desc="Selecione o Aluno que deseja aproveitar uma ou mais cadeiras"
                                value={this.state.aluno}
                                updateState={(data)=>this.fieldHandler('aluno',data)}
                                options={this.props.alunosSelect}
                                isCreatable
                                link="/cadastroAluno"
                                linkText="Cadastrar novo aluno "
                                onBlur={this.saveSession}
                                focus
                            />
                        </Slide>
                        <Slide in={true} direction="left">
                            <SelectInput
                                id="aproveitamentoProfessor"
                                type="professores"
                                label="Responsável:"
                                placeholder="Unidade: Nome"
                                desc="Selecione o Professor responsável pelo Aproveitamento."
                                value={this.state.professor}
                                updateState={(data)=>this.profHandler(data)}
                                options={this.props.professoresSelect}
                                isCreatable
                                onBlur={this.saveSession}
                                link="/cadastroProfessor"
                                linkText="Cadastrar novo professor "
                            />
                        </Slide>
                        <Slide in={true} direction="right">
                            <SelectInput
                                id="instituicaoAluno"
                                type="instituicoes"
                                label="Instituição de Origem: "
                                placeholder="Sigla: Nome"
                                desc="Selecione a Instituição de Origem da qual o Aluno pertenceu"
                                value={this.state.inst}
                                updateState={(data)=>this.instHandler(data)}
                                options={this.props.instituicoesSelect}
                                isCreatable
                                onBlur={this.saveSession}
                                link="/cadastroInst"
                                linkText="Cadastrar nova Instituição de Ensino "
                            />
                        </Slide>
                        <Slide in={true} direction="left">
                            <div>
                                <DateInput 
                                    id="aproveitamentoData"
                                    label="Data:"
                                    desc="Data em que se consolida o aproveitamento"
                                    value={this.state.date}
                                    onBlur={this.saveSession}
                                    isAuto
                                    updateState={(data)=>this.fieldHandler('date',data)}
                                />
                            </div>
                        </Slide>
                        <Slide in={true} direction="right">
                            <div>
                                <TextInput 
                                    id="aproveitamentoProcesso"
                                    type="text"
                                    label="Número do Processo:"
                                    placeholder="23067.XXXXXX/YYYY-DD"
                                    desc="Número do processo referente ao aproveitamento de acordo com o padrão da Universidade de Destino."
                                    value={this.state.processo}
                                    updateState={(data)=>this.fieldHandler('processo',data)}
                                    onBlur={this.saveSession}
                                />
                            </div>
                        </Slide>
                        <Slide in={true} direction="left">
                            <SelectInput
                                id="aproveitamentoCargo-"
                                label="Função do Responsável:"
                                placeholder="Coordenador / Vice-Coordenador"
                                desc="Selecione a função exercida pelo Responsável pelo Aproveitamento"
                                value={this.state.cargo}
                                updateState={(data)=>{this.fieldHandler('cargo', data)}}
                                options={
                                    [{value: "coord", label: "Coordenador de Curso"}, {value:"vice", label:"Vice-Coordenador de Curso"}]
                                }
                                onBlur={this.saveSession}
                            />
                        </Slide>
                        <div>
                            {blocksSelect}
                        </div>
                        <Slide in={true} direction="left">
                            <div>
                                <TextInput
                                    id="aproveitamentoObs"
                                    type="text"
                                    label="Observações:"
                                    placeholder="..."
                                    desc="Observações do aproveitamento"
                                    value={this.state.obs}
                                    updateState={(data)=>{this.fieldHandler('obs', data)}}
                                    onBlur={this.saveSession}
                                />
                            </div>
                        </Slide>
                        
                        
                        
                    </div>
                    {renderedComponents}
                    {blockHourWarning}
                    <Slide in={true} direction="right">
                        <div>
                            <Button
                                component="div"
                                variant="contained"
                                color="primary"
                                disabled={this.isEmpty()}
                                onClick={()=>{this.confirmRegister()}} >
                                    {this.state.isEditor?"Concluir Edição":"Realizar Aproveitamento"}
                            </Button>
                        </div>
                    </Slide>
                    </div>
                

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
        cursosData: state.databaseData.cursosData,
        cidadesData: state.databaseData.cidadesData,
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
        ),
        updateSelectedInst: (pyld) => dispatch(
            {
                type: actionTypes.PUSH_SELECTED_INST,
                payload: {...pyld}
            }
        ),
        updateSelectedProf: (pyld) => dispatch(
            {
                type: actionTypes.PUSH_SELECTED_PROF,
                payload: {...pyld}
            }
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Aproveitamento);