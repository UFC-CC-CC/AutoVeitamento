import { BrowserRouter as BrowserRouter, Route, Switch, } from "react-router-dom";
import React, {Component} from "react";
import Seletor from "../Seletor/Seletor";
import Coordenador from "../Coordenador/Coordenador";
import Desenvolvedor from '../Desenvolvedor/Desenvolvedor';
import Sobre from "../Sobre/Sobre";
import Ajuda from "../Ajuda/Ajuda";
import Error404 from "../Error404/Error404";
import Aproveitamento from "../Aproveitamento/Aproveitamento";
import NavBar from "../NavBar/NavBar";
import ResultadoAproveitamento from "../Aproveitamento/ResultadoAproveitamento/ResultadoAproveitamento";
import CadastroDisc from "../Cadastro/CadastroDisc/CadastroDisc";
import CadastroInst from "../Cadastro/CadastroInst/CadastroInst";
import CadastroBloc from "../Cadastro/CadastroBloc/CadastroBloc";
import EditorDisc from "../Edicao/EditorDisc/EditorDisc";
import EditorInst from "../Edicao/EditorInst/EditorInst";
import PaginaCriador from "../Sobre/PaginaCriador";
import EditorBloc from "../Edicao/EditorBloc/EditorBloc";
import CadastroAluno from "../Cadastro/CadastroAluno/CadastroAluno";
import EditorAluno from "../Edicao/EditorAluno/EditorAluno";
import CadastroUnidade from "../Cadastro/CadastroUnidade/CadastroUnidade";
import EditorUnidade from "../Edicao/EditorUnidade/EditorUnidade";
import CadastroProfessor from "../Cadastro/CadastroProfessor/CadastroProfessor";
import EditorProfessor from "../Edicao/EditorProfessor/EditorProfessor";
import FileTester from "../Desenvolvedor/FileTester/FileTester";
import CadastroCidade from "../Cadastro/CadastroCidade/CadastroCidade";
import EditorCidade from "../Edicao/EditorCidade/EditorCidade";
import CadastroCurso from "../Cadastro/CadastroCurso/CadastroCurso";
import EditorCurso from "../Edicao/EditorCurso/EditorCurso";
import Configuracao from "../Configuracao/Configuracao";
import EditorConfiguracao from "../Configuracao/EditorConfiguracao/EditorConfiguracao";
import ConsultaAproveitamento from "../Aproveitamento/ConsultaAproveitamento/ConsultaAproveitamento";
import Sessions from "../Sessions/Sessions";
import NewWindow from "../Ajuda/NewWindow/NewWindow";
import CadastroDiscDestino from "../Cadastro/CadastroDisc/CadastroDiscDestino";
import Consulta from "../Consulta/Consulta";
import EditorSelectionScreen from "../EditorSelectionScreen/EditorSelectionScreen";
import ConsultaAluno from "../Consulta/ConsultaAluno/ConsultaAluno";
import ConsultaBloco from "../Consulta/ConsultaBloco/ConsultaBloco";
import ConsultaDisciplina from "../Consulta/ConsultaDisciplina/ConsultaDisciplina";
import ConsultaInstituicao from "../Consulta/ConsultaInstituicao/ConsultaInstituicao";
import ConsultaCurso from "../Consulta/ConsultaCurso/ConsultaCurso";
import ConsultaCidade from "../Consulta/ConsultaCidade/ConsultaCidade";
import ConsultaUnidade from "../Consulta/ConsultaUnidade/ConsultaUnidade";
import ConsultaProfessor from "../Consulta/ConsultaProfessor/ConsultaProfessor";
import RestaurarBackup from "../Configuracao/RestaurarBackup/RestaurarBackup";


export default class Router extends Component {

    render(){
        return(
                <Switch>
                    <Route path="/" exact component={Seletor} />
                    <Route path="/sobre" component={Sobre} />
                    <Route path="/ajuda" component={Ajuda} />
                    <Route path="/paginaCriador" component={PaginaCriador} />                    
                    <Route path="/coord" component={Coordenador} />
                    <Route path="/aprov/" component={Aproveitamento} />
                    <Route path="/dev/" component={Desenvolvedor} />
                    <Route path="/cadastroDisc/" component={CadastroDisc} />
                    <Route path="/cadastroDiscDestino/" component={CadastroDiscDestino} />
                    <Route path="/cadastroInst/" component={CadastroInst} />
                    <Route path="/cadastroBloc/" component={CadastroBloc} />
                    <Route path="/editorDisc/" component={EditorDisc} />
                    <Route path="/editorInst/" component={EditorInst} />
                    <Route path="/editorBloc/" component={EditorBloc} />
                    <Route path="/cadastroAluno/" component={CadastroAluno} />
                    <Route path="/editorAluno/" component={EditorAluno} />
                    <Route path="/consultaAluno/" component={ConsultaAluno} />
                    <Route path="/cadastroUnidade/" component={CadastroUnidade} />
                    <Route path="/editorUnidade/" component={EditorUnidade} />
                    <Route path="/cadastroProfessor/" component={CadastroProfessor} />
                    <Route path="/editorProfessor/" component={EditorProfessor} />
                    <Route path="/cadastroCidade/" component={CadastroCidade} />
                    <Route path="/editorCidade/" component={EditorCidade} />
                    <Route path="/cadastroCurso/" component={CadastroCurso} />
                    <Route path="/editorCurso/" component={EditorCurso} />
                    <Route path="/config/" component={Configuracao} />
                    <Route path="/editorConfig/" component={EditorConfiguracao} />
                    <Route path="/restaurarBackup/" component={RestaurarBackup} />
                    <Route path="/consultaAproveitamento/" component={ConsultaAproveitamento} />
                    <Route path="/sessoes/" component={Sessions} />
                    <Route path="/tester/" component={FileTester} />
                    <Route path="/newWindow/" component={NewWindow} />
                    <Route path="/consulta/" component={Consulta} />
                    <Route path="/edicao/" component={EditorSelectionScreen} />
                    <Route path="/consultaBloco/" component={ConsultaBloco} />
                    <Route path="/consultaDisciplina/" component={ConsultaDisciplina} />
                    <Route path="/consultaInstituicao/" component={ConsultaInstituicao} />
                    <Route path="/consultaCurso/" component={ConsultaCurso} />
                    <Route path="/consultaCidade/" component={ConsultaCidade} />
                    <Route path="/consultaUnidade/" component={ConsultaUnidade} />
                    <Route path="/consultaProfessor/" component={ConsultaProfessor} />
                    <Route component={Error404} />
                </Switch>
        );
    }
}