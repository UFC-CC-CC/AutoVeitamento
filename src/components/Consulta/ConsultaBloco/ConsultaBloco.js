import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import SelectInput from "../../DataReceivers/SelectInput/SelectInput";
import FilterComponent from "../FilterComponent/FilterComponent";
import FilterSelect from "../FilterSelect/FilterSelect";
import Slide from '@material-ui/core/Slide';
import "./ConsultaBloco.css";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import OrdinaryDisplay from "../DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";
import FilterSelectMulti from "../FilterSelectMulti/FilterSelectMulti";
import MultiRowDisplay from "../DisplayComponents/MultiRowDisplay/MultiRowDisplay";

class ConsultaBloco extends Component {

    state = {
        choosenInst: null,
        choosenBlock: null,
        parecerista: null,
        pareceristaToggle: false, 
        solicitador: null,
        solicitadorToggle: false, 
        obs: '',
        obsToggle: false,
        date: null,
        dateToggle: false,
        origem: [],
        origemToggle: false,
        destino: [],
        destinoToggle: false,
        options: []
    }

    fieldHandler = (field,data) => {
        if(field === 'choosenInst')
            this.setState({
                [field]: data,
                destino: [],
                destinoToggle: false
            }, this.filterOptions);

        this.setState({
            [field]: data
        }, this.filterOptions);
    }

    filterOptions = () => {
        let options = this.props.blocosSelect[this.state.choosenInst.value];
        if(!options)
            options = [];



        if(this.state.solicitadorToggle){
            options = options.filter(
                curr => {
                    return this.props.blocosData[this.state.choosenInst.value][curr.value].solicitador == this.state.solicitador.value;
                }
            );
        }
        if(this.state.pareceristaToggle){
            options = options.filter(
                curr => {
                    return this.props.blocosData[this.state.choosenInst.value][curr.value].parecerista == this.state.parecerista.value;
                }
            );
        }
        if(this.state.obsToggle){
            options = options.filter(
                curr => {
                    return this.props.blocosData[this.state.choosenInst.value][curr.value].obs.toUpperCase().includes(this.state.obs.toUpperCase());
                }
            );
        }
        if(this.state.dateToggle){
            options = options.filter(
                curr => {
                    return this.props.blocosData[this.state.choosenInst.value][curr.value].data.toUpperCase() == this.state.date.toUpperCase();
                }
            );
        }
        if(this.state.origemToggle){
            options = options.filter(
                curr => {
                    for(let i in this.state.origem){
                        if(this.props.blocosData[this.state.choosenInst.value][curr.value].cursadas.indexOf(this.state.origem[i].value) == -1)
                            return false
                    }
                    return true;
                }
            );
        }
        if(this.state.destinoToggle){
            options = options.filter(
                curr => {
                    for(let i in this.state.destino){
                        if(this.props.blocosData[this.state.choosenInst.value][curr.value].aproveitadas.indexOf(this.state.destino[i].value) == -1)
                            return false
                    }
                    return true;
                }
            );
        }
        this.setState({
            options: options
        })
    }
	
    render(){

        let display;      
        if(this.state.choosenBlock){
            let block = this.props.blocosData[this.state.choosenInst.value][this.state.choosenBlock.value];
            let pareceristaDisplay = block.parecerista?
            <MultiRowDisplay 
                mainTitle="Parecerista"
                titles={["SIAPE", "Nome", "Unidade de Lotação"]}
                datas={[this.props.professoresData[block.parecerista].siape, this.props.professoresData[block.parecerista].nome, this.props.professoresData[block.parecerista].dep]}
            />: 
            <OrdinaryDisplay
                title="Parecerista"
                data="Este bloco não possui parecerista"
            />


            let originTitles = []
            let originDatas = block.cursadas.map(curr => {
                originTitles.push(curr); 
                return this.props.disciplinasData[this.state.choosenInst.value][curr].nome + " (" + this.props.disciplinasData[this.state.choosenInst.value][curr].horas + "h)"; 
            });

            let destinyTitles = []
            let destinyDatas = block.aproveitadas.map(curr => {
                destinyTitles.push(curr); 
                return this.props.disciplinasData[this.props.configuracoes.instituicaoSelect.value][curr].nome + " (" + this.props.disciplinasData[this.props.configuracoes.instituicaoSelect.value][curr].horas + "h)"; 
            });

            display = <Slide in={this.state.choosenBlock} direction="right">
                        <div>
                            <div className="consultaBlocoGrid2">
                                <MultiRowDisplay 
                                    mainTitle="Solicitador"
                                    titles={["SIAPE", "Nome", "Unidade de Lotação"]}
                                    datas={[this.props.professoresData[block.solicitador].siape, this.props.professoresData[block.solicitador].nome, this.props.professoresData[block.solicitador].dep]}
                                />
                                {pareceristaDisplay}
                                <MultiRowDisplay 
                                    mainTitle="Disciplinas Cursadas"
                                    titles={originTitles}
                                    datas={originDatas}
                                />
                                <MultiRowDisplay 
                                    mainTitle="Disciplinas Aproveitadas"
                                    titles={destinyTitles}
                                    datas={destinyDatas}
                                />
                                <OrdinaryDisplay
                                    title="Data"
                                    data={block.data.replace(new RegExp('\\-', 'g'), '/')}
                                />
                                <OrdinaryDisplay
                                    title="Observações"
                                    data={block.obs?block.obs:"Este bloco não possui observações"}
                                />
                                
                            </div>
                            <Link to={{ pathname: '/editorBloc', state: { inMainWindow: true, carriedState: this.state.choosenBlock, carriedInst: this.state.choosenInst}}}>
                                <Button
                                    component="div"
                                    variant="contained"
                                    color="primary"
                                    onClick={()=>{}} >
                                        Editar este Bloco de Aproveitamento.
                                </Button>
                            </Link>
                        </div>
                      </Slide>
        }

        let filters;
        if(this.state.choosenInst){
            filters = <div className="consultaBlocoGrid3">
                        <FilterSelect
                            id = "blocoSolicitador"
                            desc= "Solicitador"
                            placeholder="SIAPE: Nome"
                            value={this.state.solicitador}
                            toggle={this.state.solicitadorToggle}
                            onChange={(data)=>{this.fieldHandler("solicitador", data)}}
                            onToggle={(data)=>{this.fieldHandler("solicitadorToggle", data)}}
                            options={this.props.professoresSelect}
                        />
                        <FilterSelect
                            id = "blocoParecerista"
                            desc= "Parecerista"
                            placeholder="SIAPE: Nome"
                            value={this.state.parecerista}
                            toggle={this.state.pareceristaToggle}
                            onChange={(data)=>{this.fieldHandler("parecerista", data)}}
                            onToggle={(data)=>{this.fieldHandler("pareceristaToggle", data)}}
                            options={this.props.professoresSelect}
                        />
                        <FilterComponent 
                            id = "blocoData"
                            desc= "Data"
                            type="date"
                            value={this.state.date}
                            toggle={this.state.dateToggle}
                            onChange={(data)=>{this.fieldHandler("date", data)}}
                            onToggle={(data)=>{this.fieldHandler("dateToggle", data)}}
                        />
                        <FilterSelectMulti
                            id = "blocoOrigem"
                            desc= "Disciplinas Cursadas"
                            placeholder="Código: Nome da disciplina"
                            value={this.state.origem}
                            toggle={this.state.origemToggle}
                            onChange={(data)=>{this.fieldHandler("origem", data)}}
                            onToggle={(data)=>{this.fieldHandler("origemToggle", data)}}
                            options={this.props.disciplinasSelect[this.state.choosenInst.value]}
                            inst={this.state.choosenInst.value}
                        />
                        <FilterSelectMulti
                            id = "blocoDestino"
                            desc= "Disciplinas Aproveitadas"
                            placeholder="Código: Nome da disciplina"
                            value={this.state.destino}
                            toggle={this.state.destinoToggle}
                            onChange={(data)=>{this.fieldHandler("destino", data)}}
                            onToggle={(data)=>{this.fieldHandler("destinoToggle", data)}}
                            options={this.props.disciplinasSelect[this.props.configuracoes.instituicaoSelect.value]}
                        />
                        <FilterComponent 
                            id = "blocoObs"
                            desc= "Observações"
                            type="text"
                            placeholder="ex: Um observação do bloco aqui"
                            value={this.state.obs}
                            toggle={this.state.obsToggle}
                            onChange={(data)=>{this.fieldHandler("obs", data)}}
                            onToggle={(data)=>{this.fieldHandler("obsToggle", data)}}
                        />
                      </div>

        }

        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Consulta de Blocos</h1>
                    </Typography>
                </Grow>
                <br/>
                <Slide in={true} direction="right">
                    <SelectInput
                        id="instituicao"
                        type="instituicoes"
                        label="Instituição de Ensino:"
                        placeholder="Código: Nome da Instituição"
                        desc="Selecione a Instituição de Ensino a qual o Bloco de Aproveitamento a ser consultado pertence."
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
                        id="consultaAluno"
                        type="aluno"
                        isClearable
                        label="Selecione o bloco que deseja consultar: "
                        placeholder="CURSADAS aproveitando APROVEITADAS"
                        desc="As opções de blocos mudam de acordo com os filtros especificados acima. Os filtros não diferem letras maiúsculas e minúsculas. Contudo, eles são sensíveis a acentos."
                        value={this.state.choosenBlock}
                        updateState={data=>{this.fieldHandler("choosenBlock", data)}}
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
        blocosData: state.databaseData.blocosData,
        blocosSelect: state.databaseData.blocosSelect,
        professoresData: state.databaseData.professoresData,
        professoresSelect: state.databaseData.professoresSelect,
        disciplinasData: state.databaseData.disciplinasData,
        disciplinasSelect: state.databaseData.disciplinasSelect,
        configuracoes: state.preferences
    }
}

const mapDispatchToProps = dispatch => {
    return{
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaBloco);