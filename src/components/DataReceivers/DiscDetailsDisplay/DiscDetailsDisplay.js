import React from 'react';
import './DiscDetailsDisplay.css';
import { Typography } from "@material-ui/core";

/**
 * @param {String} props.id Identificador único do campo de Detalhes de Disciplina
 * @param {Object} props.disciplina Dados estáticos da disciplina
 * @param {Integer} props.nota Nota da disciplina
 * @param {String} props.type Identifica se a disciplina é cursada ou aproveitada
 * @param {String} props.semestre Semestre o qual se cursou a disciplina (APENAS PARA DISCIPLINAS CURSADAS)
 * @param {Int} props.hora Carga horária aproveitada (APENAS PARA DISCIPLINAS APROVEITADAS)
 */
const discDetailsDisplay = props => {
	let field;
	
	if(props.type == 'cursada'){
		field = <p className="discDetailsDisplayP"><b>Semestre Letivo: </b>{props.semestre}</p>
	}
	else if (props.type == 'aproveitada'){
		field = <p className="discDetailsDisplayP"><b>Horas Aproveitadas: </b>{props.hora}</p>;
	}

	return(
		<div className={
			"discDetailsDisplayDiv "+(props.type == 'cursada'? "discDetailsDisplayColorBlue" : "discDetailsDisplayColorGreen")
		}>
			<Typography>
				<p className="discDetailsDisplayP">{props.disciplina.nome} - {props.disciplina.codigo} - {props.disciplina.horas}h</p>
				<p className="discDetailsDisplayP"><b>Nota: </b>{props.nota}</p>
				{field}
			</Typography>
		</div>
	)
}

export default discDetailsDisplay;