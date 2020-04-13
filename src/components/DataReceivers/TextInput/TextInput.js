import React from 'react';
import { Typography } from "@material-ui/core";

/**
 * 
 * @param {String} props.id Identificador único do campo de texto
 * @param {String} props.type Tipo do campo (code, text, number)
 * @param {String} props.label Título do campo de texto
 * @param {String} props.placeholder Placeholder do campo de texto
 * @param {String} props.desc Descrição do campo de texto
 * @param {String} props.value Valor do campo de texto
 * @param {Function} props.updateState Função que atualiza o campo correspondente no componente pai 
 * @param {Boolean} props.overrideClasses Indica se as classes devem ser sobrescritas pelas classes recebidas
 * @param {String} props.class Classes para serem aplicadas na div container
 */
const textInput = props => {

	return(
		<div class={`form-group`}>
			<Typography>
				<label for={props.id}>{props.label}</label>
				<input type={props.type == 'number' ? "number" : "text"}
						class="form-control" 
						id={props.id}
						aria-describedby={`${props.id}Desc`} 
						placeholder={props.placeholder}
						value={props.value}
						autoFocus={props.focus}
						onChange={(e) => {
							if (props.type == 'code')
								props.updateState(e.target.value.toUpperCase());
							else if(props.type == 'number')
								props.updateState(Number(e.target.value));
							else
								props.updateState(e.target.value);
						}}
						onBlur={props.onBlur?props.onBlur:()=>{}}
						/>
						
				<small id={`${props.id}Desc`} class="form-text text-muted">{props.desc}</small>
			</Typography>
		</div>
	);

}

export default textInput;