import React, {Component} from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import objOpe from './../../../utilities/objOpe';
import { BrowserRouter as BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import "../dataReceiverStyles.css";
import { Typography } from "@material-ui/core";

/**
 * 
 * @param {String} props.id Identificador único do select
 * @param {String} props.type Tipo de dado
 * @param {Boolean} props.isCreatable Indica se o select suporta ou não a criação de novos dados
 * @param {Boolean} props.isClearable
 * @param {Boolean} props.isUnique Indica se as opções devem excluir valores já selecionados
 * @param {Boolean} props.isMulti
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
class SelectInput extends Component{

	state = {
		awaiting: false
	}

	render(){
		if(this.props.isCreatable && this.props.stack[this.props.type] && this.state.awaiting && !this.props.value){
			this.props.updateState(this.props.stack[this.props.type]);
			this.props.popStack(this.props.type)
	}
		// Retorna um objeto com as options excluindo as options já selecionadas
		const processOptions = () => {
			return this.props.isUnique ? objOpe.excludeOptions(this.props.options, this.props.excludedOptions) : this.props.options;
		}

		const prepareForData = ()=>{
			window.open(this.props.link,this.props.link,'_blank');
			this.props.updateState(null);
			this.setState({awaiting: true});
			//this.props.pushToStack(this.props.id, this.props.link, this.props.autoData, this.props.type);
		}


		let renderedSelect = <Select
								id={this.props.id}
								placeholder={this.props.placeholder}
								aria-describedby={`${this.props.id}Desc`} 
								value={this.props.value}
								isMulti={this.props.isMulti}
								onChange={(inputValue)=>{this.props.updateState(inputValue)}}
								options={processOptions()}
								isDisabled={this.props.disabled}
								class={this.props.selectClass}
								autoFocus={this.props.focus}
								onBlur={this.props.onBlur?this.props.onBlur:()=>{}}
								isClearable={this.props.isClearable}
							/>;

		

		if(this.props.isCreatable){
			renderedSelect = <CreatableSelect
			id={this.props.id}
			placeholder={this.props.placeholder}
			aria-describedby={`${this.props.id}Desc`} 
			value={this.props.value}
			onChange={(inputValue)=>{this.props.updateState(inputValue)}}
			options={processOptions()}
			formatCreateLabel={(abc) =>{
				return <div className="newWindow">{this.props.linkText}:{abc}</div>	
			}}
			isDisabled={this.props.disabled}
			class={this.props.selectClass}
			onCreateOption={prepareForData}
			autoFocus={this.props.focus}
			onBlur={this.props.onBlur?this.props.onBlur:()=>{}}
			isClearable={this.props.isClearable}
		/>;
		}
		return(
			<div class={this.props.overrideClasses ? this.props.class : `form-group ${this.props.class}`}>
				<Typography>
					<label for={this.props.id}>{this.props.label}</label>
				{renderedSelect}
				<small id={`${this.props.id}Desc`} class="form-text text-muted">{this.props.desc}</small>
				</Typography>
			</div>
		);
	}

}

const mapStateToProps = state => {
	return {
		stack: state.stack,
		newData: state.newData
	}
}

const mapDispatchToProps = dispatch => {
	return{
		resetNewData: ()=> dispatch({type: actionTypes.RESET_NEW_DATA}),
		pushToStack: (id, route, data)=> dispatch({type: actionTypes.PUSH_STACK, payload: {id: id, route: route, data: data}}),
		popStack: (type)=>dispatch({type: actionTypes.POP_STACK, payload:{type: type}})
	}
}



export default connect(mapStateToProps, mapDispatchToProps)(SelectInput);