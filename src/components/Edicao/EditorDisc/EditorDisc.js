import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import TextInput from '../../DataReceivers/TextInput/TextInput';
import SelectInput from '../../DataReceivers/SelectInput/SelectInput';
import * as actionTypes from '../../../actions/actionTypes';
import willContinue from '../../../utilities/confirmAlert';
import objOpe from "../../../utilities/objOpe";
import denyDeletePopup from "../DenyDeletePopup/DenyDeletePopup";
import confirmDeletePopup from "../ConfirmDeletePopup/ConfirmDeletePopup";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

class EditorDisc extends Component {

    state = {
        disc: null,
        inst: null,
        newInst: null,
        name: "",
        code: "",
        hours: 0,
        newName: "",
        newCode: "",
        newHours: 0,
        isProcessingData: false
    }

    componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.disc == null && this.props.location&&this.props.location.state&&this.props.location.state.carriedState&&this.props.location.state.carriedInst){
            this.instituicaoHandler(this.props.location.state.carriedInst, () => 
                this.disciplinaHandler(this.props.location.state.carriedState)
            );
        }
    }

    restrictionChecker = () => {

        if(this.state.inst.value == this.state.newInst.value && this.state.code == this.state.newCode && this.state.hours == this.state.newHours)
            return false;

        let conflicts = [];

        for(let i in this.props.blocosData)
            for(let j in this.props.blocosData[i])
                if(this.props.blocosData[i][j].cursadas.indexOf(this.state.code) != -1 || this.props.blocosData[i][j].aproveitadas.indexOf(this.state.code) != -1 )
                    conflicts.push(i+": "+this.props.blocosData[i][j].label);

        if(conflicts.length == 0)
            return false;

        return conflicts
    }

    fieldHandler = (field, data) => this.setState({[field]: data});

    disciplinaHandler = (data) => this.setState({
        disc: data,
        name: this.props.disciplinasData[this.state.inst.value][data.value].nome,
        newName: this.props.disciplinasData[this.state.inst.value][data.value].nome,
        code: data.value,
        newCode: data.value,
        hours: this.props.disciplinasData[this.state.inst.value][data.value].horas,
        newHours: this.props.disciplinasData[this.state.inst.value][data.value].horas,
    });
    
    instituicaoHandler = (data, callback) => this.setState({
        inst: {...data},
        newInst: {...data},
        disc: null,
        name: "",
        code: "",
        hours: 0,
        newName: "",
        newCode: "",
        newHours: 0,
    }, callback);

    // checa nas blocos retornando um objeto com as labels dos conflitos
	isDeleteOk = () => {
		let conflitos = {
            blocos: []
		}

        for(let i in this.props.blocosData[this.state.inst.value])
            if(this.props.blocosData[this.state.inst.value][i].cursadas.indexOf(this.state.code) != -1 || this.props.blocosData[this.state.inst.value][i].aproveitadas.indexOf(this.state.code) != -1)
                conflitos.blocos.push(this.props.blocosData[this.state.inst.value][i].label)
            
		return (conflitos.blocos.length == 0)?false:conflitos;
	}

	checkIsDeleteOk = () => {
		let conflicts = this.isDeleteOk();
		if (conflicts) denyDeletePopup(()=>{}, "Disciplina", conflicts);
		else confirmDeletePopup(this.deleteDisc);
	}

	deleteDisc = () => {
		this.props.deleteOnFile({
			name: 'disciplinasData',
			type: 'data',
            id: this.state.code,
            specifier: this.state.inst.value
        });
        
		this.props.deleteOnFile({
			name: 'disciplinasSelect',
			type: 'select',
			id: this.state.code,
            specifier: this.state.inst.value
		});
		willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
	}

    checkExistence = () =>{
        if(this.state.inst.value == this.state.newInst.value && this.state.code == this.state.newCode) return false;

        if(this.props.disciplinasData[this.state.newInst.value] && this.props.disciplinasData[this.state.newInst.value][this.state.newCode]){
            return true;
        } 
        
        return false
    }

    isEmpty = () => this.state.code && (this.state.newName == "" || this.state.newCode == "" || this.state.newHours <= 0);

    isEqual = () => (this.state.code == this.state.newCode && this.state.name == this.state.newName && this.state.hours == this.state.newHours && this.state.inst.value == this.state.newInst.value);


    editDisc= () => {

        this.setState({isProcessingData: true}, ()=>{
            this.props.updateFile({
                name: 'disciplinasSelect',
                type: 'select',
                data: {
                    value: this.state.newCode,
                    label: `${this.state.newCode}: ${this.state.newName} (${this.state.newHours}h)`
                },
                prevId: this.state.code,
                specifier: this.state.newInst.value,
                prevSpecifier: this.state.inst.value
            });
    
            this.props.updateFile({
                name: 'disciplinasData',
                type: 'data',
                data: {
                    nome:this.state.newName,
                    codigo: this.state.newCode,
                    horas:this.state.newHours
                },
                id: this.state.newCode,
                prevId: this.state.code,
                specifier: this.state.newInst.value,
                prevSpecifier: this.state.inst.value
            });

            willContinue((data)=>{this.fieldHandler('backToMain', data)}, this.props.location&&this.props.location.state?this.props.location.state.inMainWindow:false);
        });
        
    }

    render(){
        if(this.state.backToMain) return(<Redirect to="/"/>);

        let warning;
        let isOk;

        
        if(this.state.inst && this.state.disc){
            let conflicts = this.restrictionChecker();

            isOk  = !(!this.isEqual() && !this.isEmpty() && ((this.checkExistence() && this.state.code != this.state.newCode) || conflicts) )
            
            if(!isOk && conflicts){
                warning = 
                    <Typography>
                        <h3 style={{color: "red"}}>Não é possível editar ou excluir essa disciplina, pois ela já está sendo utilizada nos seguintes blocos de aproveitamento: </h3>
                        <ul style={{color: "red"}}>
                            {conflicts.map(curr => <li>{curr}</li>)}
                        </ul>
                        <h3 style={{color: "red"}}>Favor, exclua ou edite esses blocos, removendo a disciplina atual, para então editá-la ou excluí-la</h3>
                    </Typography>
                
            }

            else if(!this.state.isProcessingData && !isOk && this.checkExistence() && this.state.code != this.state.newCode){
                warning = <Typography>
                        <h3 style={{color: "red"}}>Esse código já está sendo usado nessa instituição de ensino!</h3>
                    </Typography>
            }
        }


        let renderedComponents = [];
        if(this.state.inst)
            renderedComponents.push(<Slide in={this.state.inst} direction="right">
            <div>
            <SelectInput
                id="disciplina"
                key="disciplinas"
                label="Disciplina:"
                placeholder="Código: Nome da disciplina ( Carga Horária )"
                desc="Selecione a Disciplina a ser editada."
                value={this.state.disc}
                updateState={this.disciplinaHandler}
                options={this.props.disciplinasSelect[this.state.inst.value]}
            />
            </div>
        </Slide>);

        if(this.state.inst && this.state.disc)
            renderedComponents.push(<Slide in={this.state.inst && this.state.disc} direction="right">
                <div>
                <Typography style={{textAlign: "center"}}>
                    <h3>É possível editar os campos abaixo: </h3>
                </Typography>
                <SelectInput
                    id="novaInstituicao"
                    key="novaInstituicao"
                    type="instituicoes"
                    label="Instituição de Ensino:"
                    placeholder="Código: Nome da Instituição de Ensino"
                    desc="Selecione a nova Instituição de Ensino a qual a Disciplina a ser editada pertencerá."
                    value={this.state.newInst}
                    updateState={(data)=>this.fieldHandler('newInst', data)}
                    options={this.props.instituicoesSelect}
                    isCreatable
                    link="/cadastroInstituicao"
                    linkText="Cadastrar nova Instituição de Ensino"
                />
                <TextInput
                    id="nomeDisciplina"
                    key="nomeDisciplina"
                    type="text"
                    label="Nome:"
                    placeholder="ex: Cálculo Integral e Diferencial I"
                    desc="Nome completo da Disciplina."
                    value={this.state.newName}
                    updateState={(data)=>this.fieldHandler('newName', data)}
                />
                <TextInput
                    id="codigoDisciplina"
                    key="codigoDisciplina"
                    type="code"
                    label="Código:"
                    placeholder="ex: CB0534"
                    desc="Novo código identificador da Disciplina de acordo com sua Instituição de Ensino de Origem."
                    value={this.state.newCode}
                    updateState={(data)=>this.fieldHandler('newCode', data)}
                />
                <TextInput
                    id="horasDisciplina"
                    key="horasDisciplina"
                    type="number"
                    label="Carga Horária:"
                    placeholder="ex: 96"
                    desc="Nova Carga Horária da Discplina de acordo com sua Instituição de Ensino de Origem."
                    value={this.state.newHours}
                    updateState={(data)=>this.fieldHandler('newHours', data)}
                />
                </div>
            </Slide>);
        
        let submit;

        if(this.state.inst && this.state.disc)
            submit = <Slide in={this.state.inst && this.state.disc} direction="right">
            <div>
                <Button
                    component="div"
                    variant="contained"
                    color="primary"
                    disabled={this.isEqual() || this.isEmpty() || !isOk}
                    onClick={()=>{this.editDisc()}} >
                        Salvar Alterações
                </Button>
                <Slide in={!isOk} direction="right">
                    <div>
                        {warning}
                    </div>
                </Slide>
                <br/>
                <Button
                    component="div"
                    variant="contained"
                    color="secondary"
                    onClick={()=>{this.checkIsDeleteOk()}} >
                        Excluir esta Disciplina
                </Button>
            </div>
        </Slide>

        return(
            <div style={{textAlign: "left", margin: "40px 100px 100px 100px"}}>
                <Grow in={true}>
                    <Typography style={{textAlign: "center"}}>
                        <h1>Edição de Disciplinas</h1>
                    </Typography>
                </Grow>

                <form>
                    <br/>
                    <Slide in={true} direction="right">
                        <div> 
                        <SelectInput
                            id="instituicao"
                            key="instituicao"
                            label="Instituição de Ensino:"
                            placeholder="Sigla: Nome da Instituição de Ensino"
                            desc="Selecione a Instituição de Ensino a qual a Disciplina a ser editada pertence."
                            value={this.state.inst}
                            updateState={this.instituicaoHandler}
                            options={this.props.instituicoesSelect}
                            focus
                        />
                        </div>
                    </Slide>
                    {renderedComponents}
                </form>
                {submit}
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
        blocosSelect: state.databaseData.blocosSelect,
        blocosData: state.databaseData.blocosData
    }
}

const mapDispatchToProps = dispatch => {
    return{
        updateFile: (pyld) => dispatch(
            {
                type: actionTypes.EDIT_ON_FILE,
                payload: {...pyld}
            }
        ),
		updateFileMultipleData: (pyld) => dispatch(
			{
				type: actionTypes.REPLACE_FILE,
				payload: {...pyld}
			}
		),
		deleteOnFile: (pyld) => dispatch(
			{
				type: actionTypes.DELETE_ON_FILE,
				payload: {...pyld}
			}
		)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorDisc);