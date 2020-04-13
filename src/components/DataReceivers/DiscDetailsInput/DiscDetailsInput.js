import React from 'react';
import './DiscDetailsInput.css';
import { Typography } from "@material-ui/core";

/**
 * @param {String} props.id Identificador único do campo de Detalhes de Disciplina
 * @param {Object} props.disciplina Dados estáticos da disciplina
 * @param {Integer} props.nota Nota da disciplina
 * @param {String} props.type Identifica se a disciplina é cursada ou aproveitada
 * @param {String} props.semestre Semestre o qual se cursou a disciplina (APENAS PARA DISCIPLINAS CURSADAS)
 * @param {Int} props.hora Carga horária aproveitada (APENAS PARA DISCIPLINAS APROVEITADAS)
 * @param {Function} props.updateState Função que atualiza o estado do campo
 * @param {Funtions} props.hoursFix Função para ajustar as horas
 */
const discDetailsInput = props => {
	let field;
	
	if(props.type == 'cursada'){
		field = <input type="text"  
					   class="discDetailsInputSemestre"
					   id={props.id+"field"}
					   value={props.semestre}
					   onChange={(e)=>props.updateState('semestre',e.target.value)} 
					   placeholder="2018.1"
					   
					   />;
	}
	else if (props.type == 'aproveitada'){
		field = <input type="number" 
					id={props.id+"field"}
					class="discDetailsInputHoras"
					value={props.hora}
					onChange={(e)=>props.updateState('horasApr',e.target.value)} 
					placeholder="64"
					onBlur={()=>{
						if(props.onBlur) props.onBlur();
						if(props.hoursFix) props.hoursFix();
					}}
					/>;
	}

	return(
		<div className={
			"discDetailsInputDiv "+(props.type == 'cursada'? "discDetailsInputColorBlue" : "discDetailsInputColorGreen")
		}>
				<p className="discDetailsInputP">{props.disciplina.nome} - {props.disciplina.codigo} - {props.disciplina.horas}h</p>
				<br/>
				<div class="form-group form-inline">
					<label for={props.id+"nota"} className="discDetailsInputP">Nota: </label>
					<input 
						type="text" 
						id={props.id+"field"}
						class="discDetailsInputInput"
						value={props.nota}
						onChange={(e)=>{
							if(Number(e.target.value))
								props.updateState('nota',e.target.value)
							else if(!e.target.value)
								props.updateState('nota',0)
						}} 
						placeholder="10"
						onBlur={()=>{
								if(props.onBlur) props.onBlur();
								if(props.gradeFix) props.gradeFix();
							}}
						/>
					{"          ".replace(/ /g, "\u00a0")}
					<label for={props.id+"field"} className="discDetailsInputP">{props.type == 'cursada'?"Semestre letivo:":"Horas aproveitadas:"}</label>
					{field}
				</div>
		</div>
	)
}

export default discDetailsInput;