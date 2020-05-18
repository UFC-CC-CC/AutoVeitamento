import React, {Component} from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import objOpe from './../../../utilities/objOpe';
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import "../dataReceiverStyles.css";

/**
 * 
 * @param {String} props.id Identificador único do select
 * @param {String} props.type Tipo do dado
 * @param {String} props.inst Se o dado for um bloco, de qual instituição ele veio
 * @param {Boolean} props.isCreatable Indica se o select suporta ou não a criação de novos dados
 * @param {Boolean} props.isUnique Indica se as opções devem excluir valores já selecionados
 * @param {String} props.label Título do select
 * @param {String} props.placeholder Placeholder do select
 * @param {String} props.desc Descrição do select
 * @param {String} props.value Valor do select no formato {value: value, label: label}
 * @param {Function} props.updateState Função que atualiza o campo correspondente no componente pai 
 * @param {String} props.link Link para a criação do dado novo
 * @param {String} props.linkText Texto do link para a criação do dado novo
 * @param {Object} props.options Opções para o select
 * @param {String} props.excludedOptions Opções a serem excluídas
 * @param {Boolean} props.overrideClasses Indica se as classes devem ser sobrescritas pelas classes recebidas
 * @param {String} props.class Classes para serem aplicadas na div container
 * @param {String} props.selectClass Classes para serem aplicadas no select
 * @param {Object} props.autoData Dado de preenchimento automatico do link
 */
class SelectMulti extends Component{
	
	state = {
		awaiting: false
	}

	handleChange = (inputValue) => {
		this.props.updateState(inputValue);
	}
	
	// Retorna um objeto com as options excluindo as options já selecionadas
	processOptions = () => {
		return this.props.isUnique ? objOpe.excludeOptions(this.props.options, this.props.excludedOptions) : this.props.options;
	}

	// Verifica se cada bloco pode ou não estar disponível para seleção
	isBlockConflitant = block => {
		if(!this.props.inst || !this.props.type=="bloco")
			return false
		let isOk = true;

		try{
			for(let i in this.props.value)
			if(this.props.blocosData[this.props.inst][block.value]){
				for(let j in this.props.blocosData[this.props.inst][block.value].cursadas){
					if(this.props.blocosData[this.props.inst][this.props.value[i].value].cursadas.indexOf(this.props.blocosData[this.props.inst][block.value].cursadas[j]) != -1)
						return true
					if(this.props.blocosData[this.props.inst][this.props.value[i].value].aproveitadas.indexOf(this.props.blocosData[this.props.inst][block.value].cursadas[j]) != -1)
						return true
				}
				for(let j in this.props.blocosData[this.props.inst][block.value].aproveitadas){
					if(this.props.blocosData[this.props.inst][this.props.value[i].value].cursadas.indexOf(this.props.blocosData[this.props.inst][block.value].aproveitadas[j]) != -1)
						return true
					if(this.props.blocosData[this.props.inst][this.props.value[i].value].aproveitadas.indexOf(this.props.blocosData[this.props.inst][block.value].aproveitadas[j]) != -1)
						return true
				}
			}			
		}
		catch(e){
			alert("Por favor, verifique a integridade do bloco de aproveitamento que foi inserido.")
			return false
		}
		
		return false
	}

	prepareForData = ()=>{
		window.open(this.props.link,this.props.link,'_blank');
		this.setState({awaiting: true});
		//this.props.pushToStack(this.props.id, this.props.link, this.props.autoData, this.props.type);
	}


	render(){
		if(this.state.awaiting && this.props.isCreatable && this.props.stack[this.props.type]){

			let willAdd = true;
			for(let i = 0; i < this.props.value.length; i++)
				if(this.props.value[i].value == this.props.stack[this.props.type].value)
					willAdd = false
			
			if(willAdd){
				if(!this.isBlockConflitant(this.props.stack[this.props.type])){
					this.props.updateState(this.props.value.concat(this.props.stack[this.props.type]));
				}	
				this.setState({awaiting: false})
				this.props.popStack(this.props.type)
			}
		}
			

		let renderedSelect = <Select
							isMulti
							id={this.props.id}
							placeholder={this.props.placeholder}
							aria-describedby={`${this.props.id}Desc`} 
							value={this.props.value}
							selectValue={this.props.value}
							onChange={this.handleChange}
							onChange={(inputValue)=>{this.props.updateState(inputValue, ()=>{})}}
							options={this.processOptions()}
							onBlur={this.props.onBlur?this.props.onBlur:()=>{}}
							class={this.props.selectClass}
							isClearable={false}
							isOptionDisabled={this.isBlockConflitant}
						/>;

	if(this.props.isCreatable){
		renderedSelect = <CreatableSelect
							isMulti
							id={this.props.id}
							placeholder={this.props.placeholder}
							aria-describedby={`${this.props.id}Desc`} 
							value={this.props.value}
							selectValue={this.props.value}
							onChange={(inputValue)=>{this.props.updateState(inputValue)}}
							options={this.processOptions()}
							formatCreateLabel={(abc) =><div className="newWindow">{this.props.linkText}:{abc}</div>}
							class={this.props.selectClass}
							onCreateOption={this.prepareForData}
							onBlur={this.props.onBlur?this.props.onBlur:()=>{}}
							isClearable={false}
							isOptionDisabled={this.isBlockConflitant}
						/>;
	}
	return(
		<div class={this.props.overrideClasses ? this.props.class : `form-group ${this.props.class}`}>
			{this.props.label?<label for={this.props.id}>{this.props.label}</label>: <></>}
			{renderedSelect}
			<small id={`${this.props.id}Desc`} class="form-text text-muted">{this.props.desc}</small>
		</div>
	);

	}
	
}

const mapStateToProps = state => {
	return {
		disciplinasData: state.databaseData.disciplinasData,
		blocosData: state.databaseData.blocosData,
		stack: state.stack,
		newData: state.newData
	}
}

const mapDispatchToProps = dispatch => {
	return{
		resetNewData: ()=> dispatch({type: actionTypes.RESET_NEW_DATA}),
		pushToStack: (id, route, data)=> dispatch({type: actionTypes.PUSH_STACK, payload: {id: id, route: route, data: data}}),
		popStack: (type)=>dispatch({type: actionTypes.POP_STACK, payload: {type: type}})
	}
}



export default connect(mapStateToProps, mapDispatchToProps)(SelectMulti);