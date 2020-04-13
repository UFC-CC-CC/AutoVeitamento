import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import SelectInput from "../../DataReceivers/SelectInput/SelectInput";
import FilterComponent from "../FilterComponent/FilterComponent";
import FilterSelect from "../FilterSelect/FilterSelect";
import Slide from '@material-ui/core/Slide';
import "./ConsultaCurso.css";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import OrdinaryDisplay from "../DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";
import FilterSelectMulti from "../FilterSelectMulti/FilterSelectMulti";
import MultiRowDisplay from "../DisplayComponents/MultiRowDisplay/MultiRowDisplay";

class ConsultaCurso extends Component {

    state = {
        choosenCourse: null,
        nome: "",
        nomeToggle: false,
        codigo: "",
        codigoToggle: false,
        sigla: "",
        siglaToggle: false,
        options: this.props.cursosSelect
    }

    fieldHandler = (field,data) => {
        this.setState({
            [field]: data
        }, this.filterOptions);
    }

    filterOptions = () => {
        let options = this.props.cursosSelect;

        if(this.state.siglaToggle){
            options = options.filter(
                curr => {
                    return this.props.cursosData[curr.value].sigla.toUpperCase().includes(this.state.sigla.toUpperCase())
                }
            );
        }

        if(this.state.nomeToggle){
            options = options.filter(
                curr => {
                    return this.props.cursosData[curr.value].nome.toUpperCase().includes(this.state.nome.toUpperCase())
                }
            );
        }

        if(this.state.codigoToggle){
            options = options.filter(
                curr => {
                    return curr.value.toString().toUpperCase().includes(this.state.codigo.toString().toUpperCase());
                }
            );
        }

        this.setState({
            options: options
        })
    }
	
    render(){

        let display;      
        if(this.state.choosenCourse){
            display = <Slide in={this.state.choosenCourse} direction="right">
                        <div>
                        <div className="consultaCursoGrid3">
                            <OrdinaryDisplay
                                title="Codigo"
                                data={this.state.choosenCourse.value}
                            />
                            <OrdinaryDisplay
                                title="Sigla"
                                data={this.props.cursosData[this.state.choosenCourse.value].sigla}
                            />
                            <OrdinaryDisplay
                                title="Nome"
                                data={this.props.cursosData[this.state.choosenCourse.value].nome}
                            />
                            
                        </div>
                        
                        <Link to={{ pathname: '/editorCurso', state: { inMainWindow: true, carriedState: this.state.choosenCourse}}}>
                            <Button
                                component="div"
                                variant="contained"
                                color="primary"
                                onClick={()=>{}} >
                                    Editar este curso.
                            </Button>
                        </Link>
                    </div>
                      </Slide>
        }

        let filters = <div className="consultaCursoGrid3">
                        <FilterComponent 
                            id ="cursoSigla"
                            desc="Código"
                            type="number"
                            placeholder="ex: 90"
                            value={this.state.codigo}
                            toggle={this.state.codigoToggle}
                            onChange={(data)=>{this.fieldHandler("codigo", data)}}
                            onToggle={(data)=>{this.fieldHandler("codigoToggle", data)}}
                        />
                        <FilterComponent 
                            id ="cursoSigla"
                            desc="Sigla"
                            type="text"
                            placeholder="ex: CC"
                            value={this.state.sigla}
                            toggle={this.state.siglaToggle}
                            onChange={(data)=>{this.fieldHandler("sigla", data)}}
                            onToggle={(data)=>{this.fieldHandler("siglaToggle", data)}}
                        />
                        <FilterComponent 
                            id ="cursoNome"
                            desc="Nome"
                            type="text"
                            placeholder="ex: Ciências"
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
                        <h1>Consulta de Cursos</h1>
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
                        id="consultaCurso"
                        type="curso"
                        isClearable
                        label="Selecione o curso que deseja consultar: "
                        placeholder="Código: Sigla - Nome"
                        desc="As opções de cursos mudam de acordo com os filtros especificados acima. Os filtros não diferem letras maiúsculas e minúsculas. Contudo, eles são sensíveis a acentos."
                        value={this.state.choosenCourse}
                        updateState={data=>{this.fieldHandler("choosenCourse", data)}}
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
        cursosData: state.databaseData.cursosData,
        cursosSelect: state.databaseData.cursosSelect
    }
}

const mapDispatchToProps = dispatch => {
    return{
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaCurso);