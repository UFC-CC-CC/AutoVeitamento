import React from 'react';
import { Typography } from "@material-ui/core";

/**
 * 
 * @param {String} props.id Identificador único do campo de cpf
 * @param {String} props.label Título do campo de cpf
 * @param {String} props.value Valor do campo de texto
 * @param {Function} props.updateState Função que atualiza o campo correspondente no componente pai 
 * @param {Function} props.updateValidity Função que atualiza o campo de validez do cpf para true ou false
 * @param {Boolean} props.overrideClasses Indica se as classes devem ser sobrescritas pelas classes recebidas
 * @param {String} props.class Classes para serem aplicadas na div container
 */
 
const textInput = props => {

	const handleCPFInput = (e) => {

		let cpfString = e.target.value;
		let cpfPurified = "";

		for(let i = 0; i< cpfString.length; i++){
			if((/^\d+$/.test(cpfString[i])) && cpfPurified.length < 11) cpfPurified += cpfString[i];
		}

		props.updateState(cpfPurified);
		validateCpf(cpfPurified);
	}

	const validateCpf = (cpf) => {
		let isValid = true;

        let firstVal = ((cpf[0] * 10 + cpf[1] * 9 + cpf[2] * 8 + cpf[3] * 7 + cpf[4] * 6 + cpf[5] * 5 + cpf[6] * 4 + cpf[7] * 3 + cpf[8] * 2)*10)%11;
        if(firstVal == 10) firstVal = 0;

        if(firstVal != cpf[9]) isValid = false;

        let secondVal = ((cpf[0] * 11 + cpf[1] * 10 + cpf[2] * 9 + cpf[3] * 8 + cpf[4] * 7 + cpf[5] * 6 + cpf[6] * 5 + cpf[7] * 4 + cpf[8] * 3 + cpf[9] * 2)*10)%11;
        if(secondVal == 10) secondVal = 0;

        if(secondVal != cpf[10]) isValid = false;
    
        if(cpf[0] == cpf[1] && cpf[1] == cpf[2] && cpf[2] == cpf[3] && cpf[3] == cpf[4] && cpf[4] == cpf[5] && cpf[5] == cpf[6] && cpf[6] == cpf[7] && cpf[7] == cpf[8] && cpf[8] == cpf[9] && cpf[9] == cpf[10]) return false
		
        props.updateValidity(isValid);
	}

	const getMask = () => {
		let mask = "";
		for(let i = 0; i< props.value.length; i++){
			if(i == 3 || i ==  6) mask += "."
			
			if(i == 9) mask += "-"
			
			mask += props.value[i]
		}

		return mask;
	}

	
	return(
		<div class={props.overrideClasses ? props.class : `form-group ${props.class}`}>
			<Typography>
				<label for={props.id}>{props.label}</label>
				<input type="text"
						class="form-control" 
						id={props.id}
						aria-describedby={`${props.id}Desc`} 
						placeholder="ex: 64568673046"
						value={props.value}
						onChange={(e) => handleCPFInput(e)}/>
				<p id={`${props.id}Desc`} class="form-text text-muted">{getMask()}</p>
			</Typography>
		</div>
	);

}

export default textInput;