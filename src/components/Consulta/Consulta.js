import React, {Component} from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { BrowserRouter as BrowserRouter, Route, Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import RestoreIcon from '@material-ui/icons/Restore';
import SearchIcon from '@material-ui/icons/Search';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import Grow from '@material-ui/core/Grow';
import Collapse from '@material-ui/core/Collapse';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import blocoIcon from "../../images/graduation-hat.svg";
import alunoIcon from "../../images/student.svg";
import professorIcon from "../../images/professor.svg";
import disciplineIcon from "../../images/discipline.svg";
import institutionIcon from "../../images/institution.svg";
import unitIcon from "../../images/unit.svg"; 
import courseIcon from "../../images/course.svg"; 
import cityIcon from "../../images/city.svg"; 
import SvgIcon from '@material-ui/core/SvgIcon';
import {connect} from 'react-redux';
import SelectInput from "../DataReceivers/SelectInput/SelectInput";
import ConsultaAluno from "./ConsultaAluno/ConsultaAluno";

class Consulta extends Component {

    state = {
        choosenType: null,
        renderedComponent: <></>
    }

    selectPage = (data) => {
        let renderedComponent;
        switch(data.value){
            case "stu":
                renderedComponent = <ConsultaAluno />;
                break;
            case "block":
                renderedComponent = <h1>Bloco de Aproveitamento</h1>;
                break;
            case "city":
                renderedComponent = <h1>Cidade</h1>;
                break;
            case "courses":
                renderedComponent = <h1>Curso</h1>;
                break;  
            case "discs":
                renderedComponent = <h1>Disciplina</h1>;
                break;
            case "insts":
                renderedComponent = <h1>Instituição</h1>;
                break;
            case "professors":
                renderedComponent = <h1>Professor</h1>;
                break;
            case "units":
                renderedComponent = <h1>Unidade de Lotação</h1>;
                break;
            default:
                renderedComponent = <></>
        }
        this.setState({
            choosenType: data,
            renderedComponent: renderedComponent
        })
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
                            <h1>Consultar Dados do Programa</h1>
                        </Typography>
                    </Grid>
                    
                    <Grid item>
                        <Link to="/consultaBloco">
                            <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                                <img src={blocoIcon} style={{marginRight:'10px', marginLeft: '-10px', width: '24px', height: "16.72px"}} />
                                Blocos de Aproveitamento
                            </Button>
                        </Link>
                    </Grid>
                    
                    <Grid item>
                        <Link to="/consultaDisciplina">
                            <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                                <img src={disciplineIcon} style={{marginRight:'10px', marginLeft: '-10px', width: '24px', height: "24px"}} />
                                Disciplinas
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link to="/consultaAluno">
                            <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                                <img src={alunoIcon} style={{marginRight:'10px', marginLeft: '-10px', width: '24px', height: "24.22px"}} />
                                Alunos
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link to="/consultaInstituicao">
                            <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                                <img src={institutionIcon} style={{marginRight:'10px', marginLeft: '-10px', width: '24px', height: "23.98px"}} />
                                Instituições de Ensino
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link to="/consultaProfessor">
                            <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                                <img src={professorIcon} style={{marginRight:'10px', marginLeft: '-10px', width: '24px', height: "24px"}} />
                                Professores
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link to="/consultaUnidade">
                            <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                                <img src={unitIcon} style={{marginRight:'10px', marginLeft: '-10px', width: '24px', height: "24px"}} />
                                Unidades de Lotação
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link to="/consultaCurso">
                            <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                                <img src={courseIcon} style={{marginRight:'10px', marginLeft: '-10px', width: '24px', height: "32.86px"}} />
                                Cursos
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link to="/consultaCidade">
                            <Button size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                                <img src={cityIcon} style={{marginRight:'10px', marginLeft: '-10px', width: '24px', height: "26.34px"}} />
                                Cidades
                            </Button>
                        </Link>
                    </Grid>
                    
                </Grid>
            </Grow>
        );
    }
}

const mapStateToProps = state => {
    return{
    }
}

const mapDispatchToProps = dispatch => {
    return{
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Consulta);