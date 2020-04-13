import React, {useState} from "react"
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
import EditorSelectionButton from "./EditorSelectionButton/EditorSelectionButton";

const EditorSelectionScreen = props => {

    const [modal, openModal] = useState('none');

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
                        <h1>Adicionar/Editar Dados do Programa</h1>
                    </Typography>
                </Grid>
                <EditorSelectionButton 
                    modal={modal}
                    modalId="blocos"
                    modalTitle="Blocos de Aproveitamento"
                    openModal={openModal}
                    iconSrc={blocoIcon}
                    iconHeight="18"
                    linkAdd="/cadastroBloc"
                    linkEdit="/editorBloc"
                />
                <EditorSelectionButton 
                    modal={modal}
                    modalId="disciplinas"
                    modalTitle="Disciplinas"
                    openModal={openModal}
                    iconSrc={disciplineIcon}
                    iconHeight="18"
                    linkAdd="/cadastroDisc"
                    linkEdit="/editorDisc"
                />
                <EditorSelectionButton 
                    modal={modal}
                    modalId="alunos"
                    modalTitle="Alunos"
                    openModal={openModal}
                    iconSrc={alunoIcon}
                    iconHeight="18"
                    linkAdd="/cadastroAluno"
                    linkEdit="/editorAluno"
                />
                <EditorSelectionButton 
                    modal={modal}
                    modalId="institution"
                    modalTitle="Instituições de Ensino"
                    openModal={openModal}
                    iconSrc={institutionIcon}
                    iconHeight="24"
                    linkAdd="/cadastroInst"
                    linkEdit="/editorInst"
                />
                <EditorSelectionButton 
                    modal={modal}
                    modalId="professor"
                    modalTitle="Professores"
                    openModal={openModal}
                    iconSrc={professorIcon}
                    iconHeight="24"
                    linkAdd="/cadastroProfessor"
                    linkEdit="/editorProfessor"
                />
                <EditorSelectionButton 
                    modal={modal}
                    modalId="unit"
                    modalTitle="Unidades de Lotação"
                    openModal={openModal}
                    iconSrc={unitIcon}
                    iconHeight="24"
                    linkAdd="/cadastroUnidade"
                    linkEdit="/editorUnidade"
                />
                <EditorSelectionButton 
                    modal={modal}
                    modalId="course"
                    modalTitle="Cursos"
                    openModal={openModal}
                    iconSrc={courseIcon}
                    iconHeight="24"
                    linkAdd="/cadastroCurso"
                    linkEdit="/editorCurso"
                />
                <EditorSelectionButton 
                    modal={modal}
                    modalId="city"
                    modalTitle="Cidades"
                    openModal={openModal}
                    iconSrc={cityIcon}
                    iconHeight="24"
                    linkAdd="/cadastroCidade"
                    linkEdit="/editorCidade"
                />

            </Grid>
            </Grow>
    );

}   

export default EditorSelectionScreen;