import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import SelectInput from "../../DataReceivers/SelectInput/SelectInput";
import FilterComponent from "../FilterComponent/FilterComponent";
import FilterSelect from "../FilterSelect/FilterSelect";
import Slide from '@material-ui/core/Slide';
import "./ConsultaInstituicao.css";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import OrdinaryDisplay from "../DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";
import FilterSelectMulti from "../FilterSelectMulti/FilterSelectMulti";
import MultiRowDisplay from "../DisplayComponents/MultiRowDisplay/MultiRowDisplay";

class ConsultaInstituicao extends Component {

    state = {
        choosenInst: null,
        nome: "",
        nomeToggle: false,
        sigla: "",
        siglaToggle: false,
        options: this.props.instituicoesSelect
    }

    fieldHandler = (field,data) => {
        this.setState({
            [field]: data
        }, this.filterOptions);
    }

    filterOptions = () => {
        let options = this.props.instituicoesSelect;

        if(this.state.siglaToggle){
            options = options.filter(
                curr => {
                    return curr.value.toUpperCase().includes(this.state.sigla.toUpperCase());
                }
            );
        }

        if(this.state.nomeToggle){
            options = options.filter(
                curr => {
                    return this.props.instituicoesData[curr.value].toUpperCase().includes(this.state.nome.toUpperCase());
                }
            );
        }

        this.setState({
            options: options
        })
    }
	
    render(){

        let display;      
        if(this.state.choosenInst){
            display = <Slide in={this.state.choosenInst} direction="right">
                    <div>
                        <div className="consultaInstGrid2">
                            <OrdinaryDisplay
                                title="Sigla"
                                data={this.state.choosenInst.value}
                            />
                            <OrdinaryDisplay
                                title="Nome"
                                data={this.props.instituicoesData[this.state.choosenInst.value]}
                            />
                        </div>
                    
                        <Link to={{ pathname: '/editorInst', state: { inMainWindow: true, carriedState: this.state.choosenInst}}}>
                            <Button
                                component="div"
                                variant="contained"
                                color="primary"
                                onClick={()=>{}} >
                                    Editar esta Instituição de Ensino.
                            </Button>
                        </Link>
                    </div>
                </Slide>
        }

        let filters = <div className="consultaInstGrid2">
                        <FilterComponent 
                            id ="instSigla"
                            desc="Sigla"
                            type="text"
                            placeholder="ex: UFC"
                            value={this.state.sigla}
                            toggle={this.state.siglaToggle}
                            onChange={(data)=>{this.fieldHandler("sigla", data)}}
                            onToggle={(data)=>{this.fieldHandler("siglaToggle", data)}}
                        />
                        <FilterComponent 
                            id ="instNome"
                            desc="Nome"
                            type="text"
                            placeholder="ex: Universidade Federal"
                            value={this.state.nome}
                            toggle={this.state.nomeToggle}
                            onChange={(data)=>{this.fieldHandler("nome", data)}}
                            onToggle={(data)=>{this.fieldHandler("nomeToggle", data)}}
                        />
                      </div>


        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Consulta de Instituicões de Ensino</h1>
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
                        id="consultaInstituicao"
                        type="disciplina"
                        isClearable
                        label="Selecione a instituição de ensino que deseja consultar: "
                        placeholder="Sigla: Nome da Instituicao de Ensino"
                        desc="As opções de instituições mudam de acordo com os filtros especificados acima. Os filtros não diferem letras maiúsculas e minúsculas. Contudo, eles são sensíveis a acentos."
                        value={this.state.choosenInst}
                        updateState={data=>{this.fieldHandler("choosenInst", data)}}
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
        instituicoesData: state.databaseData.instituicoesData,
        instituicoesSelect: state.databaseData.instituicoesSelect,
        disciplinasData: state.databaseData.disciplinasData,
        disciplinasSelect: state.databaseData.disciplinasSelect,
        configuracoes: state.preferences
    }
}

const mapDispatchToProps = dispatch => {
    return{
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaInstituicao);