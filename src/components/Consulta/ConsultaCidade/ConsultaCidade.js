import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import SelectInput from "../../DataReceivers/SelectInput/SelectInput";
import FilterComponent from "../FilterComponent/FilterComponent";
import FilterSelect from "../FilterSelect/FilterSelect";
import Slide from '@material-ui/core/Slide';
import "./ConsultaCidade.css";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import OrdinaryDisplay from "../DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";
import FilterSelectMulti from "../FilterSelectMulti/FilterSelectMulti";
import MultiRowDisplay from "../DisplayComponents/MultiRowDisplay/MultiRowDisplay";

class ConsultaCidade extends Component {

    state = {
        choosenCity: null,
        nome: "",
        nomeToggle: false,
        estado: "",
        estadoToggle: false,
        sigla: "",
        siglaToggle: false,
        options: this.props.cidadesSelect
    }

    fieldHandler = (field,data) => {
        this.setState({
            [field]: data
        }, this.filterOptions);
    }

    filterOptions = () => {
        let options = this.props.cidadesSelect;

        if(this.state.siglaToggle){
            options = options.filter(
                curr => {
                    return this.props.cidadesData[curr.value].sigla.toUpperCase().includes(this.state.sigla.toUpperCase())
                }
            );
        }

        if(this.state.nomeToggle){
            options = options.filter(
                curr => {
                    return this.props.cidadesData[curr.value].nome.toUpperCase().includes(this.state.nome.toUpperCase())
                }
            );
        }

        if(this.state.estadoToggle){
            options = options.filter(
                curr => {
                    return this.props.cidadesData[curr.value].estado.toUpperCase().includes(this.state.estado.toUpperCase())
                }
            );
        }

        this.setState({
            options: options
        })
    }
	
    render(){

        let display;      
        if(this.state.choosenCity){
            display = <Slide in={this.state.choosenCity} direction="right">
                        <div>
                            <div className="consultaCidadeGrid3">
                                <OrdinaryDisplay
                                    title="Sigla"
                                    data={this.props.cidadesData[this.state.choosenCity.value].sigla}
                                />
                                <OrdinaryDisplay
                                    title="Nome"
                                    data={this.props.cidadesData[this.state.choosenCity.value].nome}
                                />
                                <OrdinaryDisplay
                                    title="Estado"
                                    data={this.props.cidadesData[this.state.choosenCity.value].estado}
                                />
                            </div>
                            <Link to={{ pathname: '/editorCidade', state: { inMainWindow: true, carriedState: this.state.choosenCity}}}>
                                <Button
                                    component="div"
                                    variant="contained"
                                    color="primary"
                                    onClick={()=>{}} >
                                        Editar esta cidade.
                                </Button>
                            </Link>
                        </div>
                      </Slide>
        }

        let filters = <div className="consultaCidadeGrid3">
                        
                        <FilterComponent 
                            id ="cidadeSigla"
                            desc="Sigla"
                            type="text"
                            placeholder="ex: FOR"
                            value={this.state.sigla}
                            toggle={this.state.siglaToggle}
                            onChange={(data)=>{this.fieldHandler("sigla", data)}}
                            onToggle={(data)=>{this.fieldHandler("siglaToggle", data)}}
                        />
                        <FilterComponent 
                            id ="cidadeNome"
                            desc="Nome"
                            type="text"
                            placeholder="ex: Fortaleza"
                            value={this.state.nome}
                            toggle={this.state.nomeToggle}
                            onChange={(data)=>{this.fieldHandler("nome", data)}}
                            onToggle={(data)=>{this.fieldHandler("nomeToggle", data)}}
                        />
                        <FilterComponent 
                            id ="cidadeEstado"
                            desc="Estado"
                            type="text"
                            placeholder="ex: CE"
                            value={this.state.estado}
                            toggle={this.state.estadoToggle}
                            onChange={(data)=>{this.fieldHandler("estado", data)}}
                            onToggle={(data)=>{this.fieldHandler("estadoToggle", data)}}
                        />
                        
                      </div>


        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Consulta de Cidades</h1>
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
                        id="consultaCidade"
                        type="cidade"
                        isClearable
                        label="Selecione a cidade que deseja consultar: "
                        placeholder="Sigla: Cidade - Estado"
                        desc="As opções de cidades mudam de acordo com os filtros especificados acima. Os filtros não diferem letras maiúsculas e minúsculas. Contudo, eles são sensíveis a acentos."
                        value={this.state.choosenCity}
                        updateState={data=>{this.fieldHandler("choosenCity", data)}}
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
        cidadesData: state.databaseData.cidadesData,
        cidadesSelect: state.databaseData.cidadesSelect
    }
}

const mapDispatchToProps = dispatch => {
    return{
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaCidade);