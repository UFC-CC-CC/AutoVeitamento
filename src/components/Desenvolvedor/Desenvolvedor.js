import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link } from "react-router-dom";

export default class Desenvolvedor extends Component {
    render(){
        return(
            <div>
                <h3>ಠ‿↼</h3>
                <h3>Bem vindo João Batista!</h3>
                <Link to={{ pathname: '/cadastroDisc', state: { inMainWindow: true }}} >
                    <button class="btn btn-primary">Teste de Cadastro de Disciplina</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/cadastroInst', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Cadastro de Instituição</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/cadastroBloc', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Cadastro de Bloco de Aproveitamento</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/editorDisc', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Edição de Disciplina</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/editorInst', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Edição de Instituição</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/editorBloc', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Edição de Bloco de Aproveitamento</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/cadastroAluno', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Cadastro de Aluno</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/editorAluno', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Edição de Aluno</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/cadastroUnidade', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Cadastro de Unidade de Lotação</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/editorUnidade', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Edição de Unidade de Lotação</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/cadastroProfessor', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Cadastro de Professor</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/editorProfessor', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Edição de Professor</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/cadastroCidade', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Cadastro de Cidade</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/editorCidade', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Edição de Cidade</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/cadastroCurso', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Cadastro de Curso</button>
                </Link>
                <br />
                <br />
                <Link to={{ pathname: '/editorCurso', state: { inMainWindow: true }}}>
                    <button class="btn btn-primary">Teste de Edição de Curso</button>
                </Link>
                <br />
            </div>
        );
    }
}