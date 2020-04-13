import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import SelectInput from "../../DataReceivers/SelectInput/SelectInput";
import FilterComponent from "../FilterComponent/FilterComponent";
import FilterSelect from "../FilterSelect/FilterSelect";
import Slide from '@material-ui/core/Slide';
import "./ConsultaUnidade.css";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import OrdinaryDisplay from "../DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";
import FilterSelectMulti from "../FilterSelectMulti/FilterSelectMulti";
import MultiRowDisplay from "../DisplayComponents/MultiRowDisplay/MultiRowDisplay";

class ConsultaUnidade extends Component {

    state = {
        choosenUnit: null,
        nome: "",
        nomeToggle: false,
        sigla: "",
        siglaToggle: false,
        nprof: "",
        nprofToggle: false,
        options: this.props.unidadesSelect
    }

    fieldHandler = (field,data) => {
        this.setState({
            [field]: data
        }, this.filterOptions);
    }

    filterOptions = () => {
        let options = this.props.unidadesSelect;

        if(this.state.siglaToggle){
            options = options.filter(
                curr => {
                    return curr.value.toUpperCase().includes(this.state.sigla.toUpperCase())
                }
            );
        }

        if(this.state.nomeToggle){
            options = options.filter(
                curr => {
                    return this.props.unidadesData[curr.value].toUpperCase().includes(this.state.nome.toUpperCase())
                }
            );
        }
        
        if(this.state.nprofToggle){
            options = options.filter(
                curr => {
                    let professoresLotados = 0;
                    for(let i in this.props.professoresData){
                        if(this.props.professoresData[i].dep == curr.value)
                            professoresLotados ++;
                    }
                    return professoresLotados >= this.state.nprof
                }
            );
        }

        this.setState({
            options: options
        })
    }
	
    render(){

        let display;      

        
        if(this.state.choosenUnit){
            let professoresLotados = 0;
            for(let i in this.props.professoresData){
                if(this.props.professoresData[i].dep == this.state.choosenUnit.value)
                    professoresLotados ++;
            }
            display = <Slide in={this.state.choosenUnit} direction="right">
                    <div>
                        <div className="consultaUnidadeGrid3">
                            <OrdinaryDisplay
                                title="Sigla"
                                data={this.state.choosenUnit.value}
                            />
                            <OrdinaryDisplay
                                title="Nome"
                                data={this.props.unidadesData[this.state.choosenUnit.value]}
                            />
                            <OrdinaryDisplay
                                title="N° de Professores Lotados"
                                data={professoresLotados}
                            />
                        </div>
                        <Link to={{ pathname: '/editorUnidade', state: { inMainWindow: true, carriedState: this.state.choosenUnit}}}>
                            <Button
                                component="div"
                                variant="contained"
                                color="primary"
                                onClick={()=>{}} >
                                    Editar esta Unidade de Lotação.
                            </Button>
                        </Link>
                      </div>
                    </Slide>
        }

        let filters = <div className="consultaUnidadeGrid3">
                        
                        <FilterComponent 
                            id ="UnidadeSigla"
                            desc="Sigla"
                            type="text"
                            placeholder="ex: DC"
                            value={this.state.sigla}
                            toggle={this.state.siglaToggle}
                            onChange={(data)=>{this.fieldHandler("sigla", data)}}
                            onToggle={(data)=>{this.fieldHandler("siglaToggle", data)}}
                        />
                        <FilterComponent 
                            id ="UnidadeNome"
                            desc="Nome"
                            type="text"
                            placeholder="ex: Departamento de Computação"
                            value={this.state.nome}
                            toggle={this.state.nomeToggle}
                            onChange={(data)=>{this.fieldHandler("nome", data)}}
                            onToggle={(data)=>{this.fieldHandler("nomeToggle", data)}}
                        />
                        <FilterComponent 
                            id ="UnidadeProfessores"
                            desc="N° mínimo de professores"
                            type="text"
                            placeholder="ex: 12"
                            value={this.state.nprof}
                            toggle={this.state.nprofToggle}
                            onChange={(data)=>{this.fieldHandler("nprof", data)}}
                            onToggle={(data)=>{this.fieldHandler("nprofToggle", data)}}
                        />

                      </div>


        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Consulta de Unidades</h1>
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
                        id="consultaUnidade"
                        type="Unidade"
                        isClearable
                        label="Selecione a unidade que deseja consultar: "
                        placeholder="Sigla: Nome da Unidade"
                        desc="As opções de unidades mudam de acordo com os filtros especificados acima. Os filtros não diferem letras maiúsculas e minúsculas. Contudo, eles são sensíveis a acentos."
                        value={this.state.choosenUnit}
                        updateState={data=>{this.fieldHandler("choosenUnit", data)}}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaUnidade);