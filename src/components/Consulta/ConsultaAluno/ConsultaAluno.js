import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import SelectInput from "../../DataReceivers/SelectInput/SelectInput";
import FilterComponent from "../FilterComponent/FilterComponent";
import Slide from '@material-ui/core/Slide';
import "./ConsultaAluno.css";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import OrdinaryDisplay from "../DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";

class ConsultaAluno extends Component {

    state = {
        choosenStudent: null,
        matricula: "",
        matriculaToggle: false,
        cpf: "",
        cpfToggle: false,
        nome: "",
        nomeToggle: false,
        options: this.props.alunosSelect
    }

    fieldHandler = (field,data) => {
        this.setState({
            [field]: data
        }, this.filterOptions);
    }

    filterOptions = () => {
        let options = this.props.alunosSelect;

        if(this.state.matriculaToggle){
            options = options.filter(
                curr => {
                    return curr.value.toString().toUpperCase().includes(this.state.matricula.toString().toUpperCase());
                }
            );
        }
        if(this.state.cpfToggle){
            options = options.filter(
                curr => {
                    return this.props.alunosData[curr.value].cpf.toString().toUpperCase().includes(this.state.cpf.toString().toUpperCase());
                }
            );
        }
        if(this.state.nomeToggle){
            options = options.filter(
                curr => {
                    return this.props.alunosData[curr.value].nome.toString().toUpperCase().includes(this.state.nome.toString().toUpperCase());
                }
            );
        }
        this.setState({
            options: options
        })
    }
	
    render(){

        let display;
        if(this.state.choosenStudent){
            let cpf = this.props.alunosData[this.state.choosenStudent.value].cpf.toString();
            
            cpf = `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}.${cpf.substr(6, 3)}-${cpf.substr(9, 2)}`
            
            display = <Slide in={this.state.choosenStudent} direction="right">
                        <div>
                        <div className="consultaAlunoGrid3">
                            <OrdinaryDisplay 
                                title="Matrícula"
                                data={this.state.choosenStudent.value}
                            />
                            <OrdinaryDisplay 
                                title="Nome"
                                data={this.props.alunosData[this.state.choosenStudent.value].nome}
                            />
                            <OrdinaryDisplay 
                                title="CPF"
                                data={cpf}
                            />
                        </div>
                        <Link to={{ pathname: '/editorAluno', state: { inMainWindow: true, carriedState: this.state.choosenStudent}}}>
                            <Button
                                component="div"
                                variant="contained"
                                color="primary"
                                onClick={()=>{}} >
                                    Editar este aluno.
                            </Button>
                        </Link>
                      </div>
                      </Slide>
        }

        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Consulta de Alunos</h1>
                    </Typography>
                </Grow>
                <br/>
                <Grow in={true}>
                    <Typography>
                        <h3>Filtrar por:</h3>
                    </Typography>
                </Grow>
                
                <Slide in={true} direction="right">
                    <div className="consultaAlunoGrid3"> 
                        <FilterComponent 
                            id = "alunoMatricula"
                            desc= "Matrícula"
                            type="number"
                            placeholder="ex: 123"
                            value={this.state.matricula}
                            toggle={this.state.matriculaToggle}
                            onChange={(data)=>{this.fieldHandler("matricula", data)}}
                            onToggle={(data)=>{this.fieldHandler("matriculaToggle", data)}}
                        />
                        <FilterComponent 
                            id = "alunoNome"
                            desc= "Nome"
                            type="text"
                            placeholder="ex: Fulano de Tal"
                            value={this.state.nome}
                            toggle={this.state.nomeToggle}
                            onChange={(data)=>{this.fieldHandler("nome", data)}}
                            onToggle={(data)=>{this.fieldHandler("nomeToggle", data)}}
                        />
                        <FilterComponent 
                            id = "alunoCPF"
                            desc= "CPF (Somente números)"
                            placeholder="ex: 33127144865"
                            type="number"
                            value={this.state.cpf}
                            toggle={this.state.cpfToggle}
                            onChange={(data)=>{this.fieldHandler("cpf", data)}}
                            onToggle={(data)=>{this.fieldHandler("cpfToggle", data)}}
                        />
                    </div>
                </Slide>
                <br/>
                <Slide in={true} direction="right">
                    <SelectInput 
                        id="consultaAluno"
                        type="aluno"
                        isClearable
                        label="Selecione o aluno que deseja consultar: "
                        placeholder="ex: 123123: Fulano de Tal"
                        desc="As opções de aluno mudam de acordo com os filtros especificados acima. Os filtros não diferem letras maiúsculas e minúsculas. Contudo, eles são sensíveis a acentos."
                        value={this.state.choosenStudent}
                        updateState={data=>{this.fieldHandler("choosenStudent", data)}}
                        options={this.state.options}
                    />
                </Slide>
                {display}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        alunosData: state.databaseData.alunosData,
        alunosSelect: state.databaseData.alunosSelect,
    }
}

const mapDispatchToProps = dispatch => {
    return{
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaAluno);