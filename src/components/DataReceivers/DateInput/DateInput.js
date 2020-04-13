import React from 'react';
import { Typography } from "@material-ui/core";

/**
 * @param {String} props.id Identificador único do campo de data
 * @param {String} props.label Título do campo de data
 * @param {String} props.desc Descrição do campo de data
 * @param {String} props.value Valor do campo de data
 * @param {String} props.isAuto Indica se a data deve ser obtida automaticamente se não houver data recebida através de props.valu
 * @param {Function} props.updateState Função que atualiza o campo correspondente no componente pai 
 * @param {Boolean} props.overrideClasses Indica se as classes devem ser sobrescritas pelas classes recebidas
 * @param {String} props.class Classes para serem aplicadas na div container
 */

const dateInput = props => {

	if(!props.value && props.isAuto)
		props.updateState(new Date(new Date().getTime() - 10800000).toISOString().split('T')[0]);
	
	return(
		<div className={`form-group`}>
			<Typography>
				<label htmlFor={props.id}>{props.label}</label> 
				<br/>           
				<input id={props.id} 
					aria-describedby={`${props.id}Desc`}
					type="date"
					required
					class="form-control"
					value={props.value}
					onBlur={props.onBlur?props.onBlur:()=>{}}
					onChange={(e)=>props.updateState(e.target.value)}/>
				<small id={`${props.id}Desc`} class="form-text text-muted">{props.desc}</small>
			</Typography>
		</div>
	);

}


export default dateInput;