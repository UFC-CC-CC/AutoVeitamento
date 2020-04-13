import React from 'react';
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import "./FilterComponent.css";

/**
 * @param {String} props.id Identificador único do campo de data
 * @param {String} props.desc Descrição do filtro
 * @param {String} props.type Tipo do input
 * @param {String} props.value Valor do campo de filtro
 * @param {String} props.toggle Valor do ativador (checkbox)
 * @param {String} props.onToggle Função para ativar ou desativar o filtro
 * @param {String} props.onChange Função para registrar alterações no campo
 * @param {String} props.placeholder Placeholder do campo
 */

const filterComponent = props => {

	return(
		<Card className="form-group filterComponentContainer">
			<CardContent>
				<FormControlLabel
					control={<Checkbox
						checked={props.toggle}
						onChange={e => props.onToggle(e.target.checked)}
						color="primary"
						inputProps={{
						'aria-label': 'primary checkbox',
						}}
					/>}
					label={props.desc}
				/>
				<input onClick={ () => {if(!props.toggle){ props.onToggle(true) }} } 
				onChange={ e => {
					if(!props.toggle)
						props.onToggle(true)
					if(!e.target.value)
						props.onToggle(false)
					props.onChange(e.target.value)
				}} value={props.value} type={props.type} placeholder={props.placeholder} class="form-control"/>
			</CardContent>
		</Card>
	);

}


export default filterComponent;