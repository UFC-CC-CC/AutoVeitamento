import React, {Component} from "react";
import "./Seletor.css";
import { BrowserRouter as BrowserRouter, Route, Link } from "react-router-dom";
import {connect} from 'react-redux';
import * as actionTypes from '../../actions/actionTypes';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import RestoreIcon from '@material-ui/icons/Restore';
import SearchIcon from '@material-ui/icons/Search';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import Grow from '@material-ui/core/Grow';

class Seletor extends Component {

    state = {
        grade: 0.0
    }
    
    fieldHandler = (data) => this.setState({grade: data});

    componentDidMount(){
        this.props.resetStack();
        this.props.resetSelectedInst();
        this.props.resetSelectedProf();
    }
    render(){
        return(
            <Grow in={true}>
            <Grid
                container
                direction="column"
                alignItems="center"
                justify="space-between"
                style={{ position:'absolute', top: '40px', minHeight: '85vh'}}
            >
                <Grid item>
                    <Typography>
                        <h1>AutoVeitamento UFC</h1>
                    </Typography>
                </Grid>
                
                <Grid item>
                    <Link to={{ pathname: '/aprov', state: { inMainWindow: true }}}>
                        <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                            <AddCircleOutlineRoundedIcon style={{marginRight:'10px', marginLeft: '-10px'}}/>
                            Realizar novo Aproveitamento
                        </Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to={{ pathname: '/sessoes', state: { inMainWindow: true }}}>
                        <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                            <RestoreIcon style={{marginRight:'10px', marginLeft: '-10px'}}/>
                            Continuar Sessão de Aproveitamento
                        </Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to={{ pathname: '/consultaAproveitamento', state: { inMainWindow: true }}}>
                        <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                            <SearchIcon style={{marginRight:'10px', marginLeft: '-10px'}}/>
                            Consultar Aproveitamento Consolidado
                        </Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to={{ pathname: '/consulta', state: { inMainWindow: true }}}>
                        <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                            <FindInPageIcon style={{marginRight:'10px', marginLeft: '-10px'}}/>
                            Consultar Dados do Programa
                        </Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to={{ pathname: '/edicao', state: { inMainWindow: true }}}>
                        <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                            <EditIcon style={{marginRight:'10px', marginLeft: '-10px'}}/>
                            Adicionar/Editar Dados do Programa
                        </Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to={{ pathname: '/config', state: { inMainWindow: true }}}>
                        <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                            <SettingsIcon style={{marginRight:'10px', marginLeft: '-10px'}}/>
                            Configurações
                        </Button>
                    </Link>
                </Grid>
                
            </Grid>
            </Grow>
        );
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        resetStack: ()=>dispatch({type: actionTypes.RESET_STACK}),
        resetSelectedInst: ()=>dispatch({type: actionTypes.RESET_SELECTED_INST}),
        resetSelectedProf: ()=>dispatch({type: actionTypes.RESET_SELECTED_PROF})
    }
}

export default connect(null, mapDispatchToProps)(Seletor);



/*

                <h2 class="seletor_text">ಠ_ಠ</h2>
                <h2 class="seletor_text">Quem é você?</h2>
                <Link to="/coord"><button type="button" class="btn btn-outline-primary">Coordenador</button></Link>
                <Link to="/dev"><button type="button" class="btn btn-outline-primary">Desenvolvedor</button></Link>
                <Link to="/config"><button type="button" class="btn btn-outline-primary">Configurações</button></Link>
*/