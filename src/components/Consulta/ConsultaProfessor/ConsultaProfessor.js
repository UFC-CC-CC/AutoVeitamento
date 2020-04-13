import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import SelectInput from "../../DataReceivers/SelectInput/SelectInput";
import FilterComponent from "../FilterComponent/FilterComponent";
import FilterSelect from "../FilterSelect/FilterSelect";
import Slide from '@material-ui/core/Slide';
import "./ConsultaProfessor.css";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import OrdinaryDisplay from "../DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";
import FilterSelectMulti from "../FilterSelectMulti/FilterSelectMulti";
import MultiRowDisplay from "../DisplayComponents/MultiRowDisplay/MultiRowDisplay";

class ConsultaProfessor extends Component {

    state = {
        choosenProf: null,
        nome: "",
        nomeToggle: false,
        siape: "",
        siapeToggle: false,
        dep: null,
        depToggle: false,
        options: this.props.professoresSelect
    }

    fieldHandler = (field,data) => {
        this.setState({
            [field]: data
        }, this.filterOptions);
    }

    filterOptions = () => {
        let options = this.props.professoresSelect;

        if(this.state.siapeToggle){
            options = options.filter(
                curr => {
                    return curr.value.toString().toUpperCase().includes(this.state.siape.toUpperCase())
                }
            );
        }

        if(this.state.nomeToggle){
            options = options.filter(
                curr => {
                    return this.props.professoresData[curr.value].nome.toUpperCase().includes(this.state.nome.toUpperCase())
                }
            );
        }
        
        if(this.state.depToggle){
            options = options.filter(
                curr => {
                    return this.props.professoresData[curr.value].dep.toUpperCase().includes(this.state.dep.value.toUpperCase())
                }
            );
        }

        this.setState({
            options: options
        })
    }
	
    render(){

        let display;      

        
        if(this.state.choosenProf){
            display = <Slide in={this.state.choosenProf} direction="right">
                        <div>
                            <div className="consultaProfessorGrid3">
                                <OrdinaryDisplay
                                    title="Sigla"
                                    data={this.state.choosenProf.value}
                                />
                                <OrdinaryDisplay
                                    title="Nome"
                                    data={this.props.professoresData[this.state.choosenProf.value].nome}
                                />
                                <OrdinaryDisplay
                                    title="Unidade de Lotação"
                                    data={`${this.props.professoresData[this.state.choosenProf.value].dep} - ${this.props.unidadesData[this.props.professoresData[this.state.choosenProf.value].dep]}`}
                                />
                            </div>
                            <Link to={{ pathname: '/editorProfessor', state: { inMainWindow: true, carriedState: this.state.choosenProf}}}>
                                <Button
                                    component="div"
                                    variant="contained"
                                    color="primary"
                                    onClick={()=>{}} >
                                        Editar este Professor.
                                </Button>
                            </Link>
                      </div>
                    </Slide>
        }

        let filters = <div className="consultaProfessorGrid3">
                        
                        <FilterComponent 
                            id ="ProfessorSiape"
                            desc="SIAPE"
                            type="text"
                            placeholder="ex: 123456"
                            value={this.state.siape}
                            toggle={this.state.siapeToggle}
                            onChange={(data)=>{this.fieldHandler("siape", data)}}
                            onToggle={(data)=>{this.fieldHandler("siapeToggle", data)}}
                        />
                        <FilterComponent 
                            id ="ProfessorNome"
                            desc="Nome"
                            type="text"
                            placeholder="ex: Fulano de Tal"
                            value={this.state.nome}
                            toggle={this.state.nomeToggle}
                            onChange={(data)=>{this.fieldHandler("nome", data)}}
                            onToggle={(data)=>{this.fieldHandler("nomeToggle", data)}}
                        />
                        <FilterSelect
                            id = "ProfessorDep"
                            desc= "Unidade de Lotação"
                            placeholder="Sigla: Nome da Unidade"
                            value={this.state.dep}
                            toggle={this.state.depToggle}
                            onChange={(data)=>{this.fieldHandler("dep", data)}}
                            onToggle={(data)=>{this.fieldHandler("depToggle", data)}}
                            options={this.props.unidadesSelect}
                        />
                        
                        
                      </div>


        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Consulta de Professores</h1>
                    </Typography>
                </Grow>
                <br/>
                <Grow in={true}>
                    <Typography>
                        <h3>Filtrar por:</h3>
                    </Typography>
                </Grow>
                <Slide in={true} direction="right">
                    <div>
                        {filters}
                    </div>
                </Slide>
                <br/>
                <Slide in={true} direction="right">
                    <SelectInput 
                        id="consultaProfessor"
                        type="Professor"
                        isClearable
                        label="Selecione a Professor que deseja consultar: "
                        placeholder="Siape: Nome do Professor"
                        desc="As opções de professores mudam de acordo com os filtros especificados acima. Os filtros não diferem letras maiúsculas e minúsculas. Contudo, eles são sensíveis a acentos."
                        value={this.state.choosenProf}
                        updateState={data=>{this.fieldHandler("choosenProf", data)}}
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
        unidadesData: state.databaseData.unidadesData,
        unidadesSelect: state.databaseData.unidadesSelect,
        professoresData: state.databaseData.professoresData,
        professoresSelect: state.databaseData.professoresSelect
    }
}

const mapDispatchToProps = dispatch => {
    return{
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaProfessor);