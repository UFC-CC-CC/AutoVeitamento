import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import SelectInput from "../../DataReceivers/SelectInput/SelectInput";
import FilterComponent from "../FilterComponent/FilterComponent";
import FilterSelect from "../FilterSelect/FilterSelect";
import Slide from '@material-ui/core/Slide';
import "./ConsultaDisciplina.css";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import OrdinaryDisplay from "../DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";
import FilterSelectMulti from "../FilterSelectMulti/FilterSelectMulti";
import MultiRowDisplay from "../DisplayComponents/MultiRowDisplay/MultiRowDisplay";

class ConsultaDisciplina extends Component {

    state = {
        choosenInst: null,
        choosenDisc: null,
        nome: "",
        nomeToggle: false,
        codigo: "",
        codigoToggle: false,
        horas: "",
        horasToggle: false,
    }

    fieldHandler = (field,data) => {
        this.setState({
            [field]: data
        }, this.filterOptions);
    }

    filterOptions = () => {
        let options = this.props.disciplinasSelect[this.state.choosenInst.value];

        if(this.state.codigoToggle){
            options = options.filter(
                curr => {
                    return this.props.disciplinasData[this.state.choosenInst.value][curr.value].codigo.toUpperCase().includes(this.state.codigo.toUpperCase());
                }
            );
        }

        if(this.state.nomeToggle){
            options = options.filter(
                curr => {
                    return this.props.disciplinasData[this.state.choosenInst.value][curr.value].nome.toUpperCase().includes(this.state.nome.toUpperCase());
                }
            );
        }

        if(this.state.horasToggle){
            options = options.filter(
                curr => {
                    return this.props.disciplinasData[this.state.choosenInst.value][curr.value].horas.toString().toUpperCase().includes(this.state.horas.toString().toUpperCase());
                }
            );
        }
        
        this.setState({
            options: options
        })
    }
	
    render(){

        let display;      
        if(this.state.choosenDisc){
            let disc = this.props.disciplinasData[this.state.choosenInst.value][this.state.choosenDisc.value]
            display = <Slide in={this.state.choosenDisc} direction="right">
                        <div>
                        <div className="consultaDiscGrid3">
                            <OrdinaryDisplay
                                title="Código"
                                data={disc.codigo}
                            />
                            <OrdinaryDisplay
                                title="Nome"
                                data={disc.nome}
                            />
                            <OrdinaryDisplay
                                title="Carga Horária"
                                data={disc.horas+" h"}
                            />
                        </div>
                            <Link to={{ pathname: '/editorDisc', state: { inMainWindow: true, carriedState: this.state.choosenDisc, carriedInst: this.state.choosenInst}}}>
                                <Button
                                    component="div"
                                    variant="contained"
                                    color="primary"
                                    onClick={()=>{}} >
                                        Editar esta Disciplina.
                                </Button>
                            </Link>
                        </div>
                      </Slide>
        }

        let filters;
        if(this.state.choosenInst){
            filters = <div className="consultaDiscGrid3">
                        <FilterComponent 
                            id ="discCodigo"
                            desc="Código"
                            type="text"
                            placeholder="ex: CB0535"
                            value={this.state.codigo}
                            toggle={this.state.codigoToggle}
                            onChange={(data)=>{this.fieldHandler("codigo", data)}}
                            onToggle={(data)=>{this.fieldHandler("codigoToggle", data)}}
                        />
                        <FilterComponent 
                            id ="discNome"
                            desc="Nome"
                            type="text"
                            placeholder="ex: Cálculo Integral"
                            value={this.state.nome}
                            toggle={this.state.nomeToggle}
                            onChange={(data)=>{this.fieldHandler("nome", data)}}
                            onToggle={(data)=>{this.fieldHandler("nomeToggle", data)}}
                        />
                        <FilterComponent 
                            id ="discHoras"
                            desc="Horas"
                            type="number"
                            placeholder="ex: 96"
                            value={this.state.horas}
                            toggle={this.state.horasToggle}
                            onChange={(data)=>{this.fieldHandler("horas", data)}}
                            onToggle={(data)=>{this.fieldHandler("horasToggle", data)}}
                        />
                      </div>

        }

        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Consulta de Disciplinas</h1>
                    </Typography>
                </Grow>
                <br/>
                <Slide in={true} direction="right">
                    <SelectInput
                        id="instituicao"
                        type="instituicoes"
                        label="Instituição de Ensino:"
                        placeholder="Código: Nome da Instituição"
                        desc="Selecione a Instituição de Ensino a qual a Disciplina a ser consultada pertence."
                        value={this.state.choosenInst}
                        updateState={(data)=>this.fieldHandler("choosenInst", data)}
                        options={this.props.instituicoesSelect}
                    />
                </Slide>
                <Grow in={this.state.choosenInst}>
                    <Typography>
                        <h3>Filtrar por:</h3>
                    </Typography>
                </Grow>
                <Slide in={this.state.choosenInst} direction="right">
                    <div>
                        {filters}
                    </div>
                </Slide>
                <br/>
                <Slide in={this.state.choosenInst} direction="right">
                    <SelectInput 
                        id="consultaDisciplina"
                        type="disciplina"
                        isClearable
                        label="Selecione a disciplina que deseja consultar: "
                        placeholder="Código: Nome da Disciplina (Carga horária)"
                        desc="As opções de disciplinas mudam de acordo com os filtros especificados acima. Os filtros não diferem letras maiúsculas e minúsculas. Contudo, eles são sensíveis a acentos."
                        value={this.state.choosenDisc}
                        updateState={data=>{this.fieldHandler("choosenDisc", data)}}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaDisciplina);