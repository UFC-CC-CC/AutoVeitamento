import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actionTypes from '../../actions/actionTypes';
import CreatableSelect from 'react-select/lib/Creatable';
import SelectMulti from '../DataReceivers/SelectMulti/SelectMulti';

class Ajuda extends Component {

    openNewWindow = ()=>{
        window.open("/newWindow", '_blank', "testando=true");
    }

    backupFunctionDemo = (backupPath) => {
        alert("This will perform the backup for you now!");

        let copyFile = (copyPath, fileName) => {
            const electron = window.require('electron');
            const fs = electron.remote.require('fs');

            fs.copyFile(`${copyPath}${fileName}`, `src/database/${fileName}`, (err) => {
            }); 
        }

        copyFile('Backups/'+backupPath+'/', 'configuracoes.json');
        copyFile('Backups/'+backupPath+'/', 'stack.json');
        copyFile('Backups/'+backupPath+'/', 'sessions.json');
        copyFile('Backups/'+backupPath+'/', 'selectedInst.json');
        copyFile('Backups/'+backupPath+'/', 'selectedProf.json');
        copyFile('Backups/'+backupPath+'/', 'alunosData.json');
        copyFile('Backups/'+backupPath+'/', 'alunosSelect.json');
        copyFile('Backups/'+backupPath+'/', 'aproveitamentosData.json');
        copyFile('Backups/'+backupPath+'/', 'aproveitamentosSelect.json');
        copyFile('Backups/'+backupPath+'/', 'blocosData.json');
        copyFile('Backups/'+backupPath+'/', 'blocosSelect.json');
        copyFile('Backups/'+backupPath+'/', 'cidadesData.json');
        copyFile('Backups/'+backupPath+'/', 'cidadesSelect.json');
        copyFile('Backups/'+backupPath+'/', 'cursosData.json');
        copyFile('Backups/'+backupPath+'/', 'cursosSelect.json');
        copyFile('Backups/'+backupPath+'/', 'disciplinasData.json');
        copyFile('Backups/'+backupPath+'/', 'disciplinasSelect.json');
        copyFile('Backups/'+backupPath+'/', 'instituicoesData.json');
        copyFile('Backups/'+backupPath+'/', 'instituicoesSelect.json');
        copyFile('Backups/'+backupPath+'/', 'professoresData.json');
        copyFile('Backups/'+backupPath+'/', 'professoresSelect.json');
        copyFile('Backups/'+backupPath+'/', 'unidadesData.json');
        copyFile('Backups/'+backupPath+'/', 'unidadesSelect.json');
    }

    render(){
        return(
            <div>
                <button onClick={()=>this.backupFunctionDemo('16-1-2020-1579190407993')}>Restore Backup</button>
            </div>
        );
    }
}

export default withRouter(Ajuda);