import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from "@material-ui/core";
import "./SuperBlockCardComponent.css";
import MultiRowDisplay from "../../../Consulta/DisplayComponents/MultiRowDisplay/MultiRowDisplay";
import OrdinaryDisplay from "../../../Consulta/DisplayComponents/OrdinaryDisplay/OrdinaryDisplay";

// blockTitle
// blockDate
// blockSol{siape, nome, dep}
// blockPar{siape, nome, dep}
// blockObs
// blockOrigin
// blockDestiny
export default function SuperBlockCardComponent (props) {

    let parecerista = <OrdinaryDisplay
                            title="Parecerista"
                            data="Este bloco não possui parecerista"
                        />
    
    if(props.blockPar && props.blockPar.siape){
        parecerista = <MultiRowDisplay
                        mainTitle="Parecerista"
                        titles={["SIAPE", "Nome", "Unidade de Lotação"]}
                        datas={[props.blockPar.siape, props.blockPar.nome, props.blockPar.dep]}
                    />  
    }

    let discOrigem = props.blockOrigin.map( curr => 
    <MultiRowDisplay
        key={curr.id} 
        mainTitle={curr.disciplina.codigo}
        titles={["Nome", "Carga Horária Cursada", "Semestre Letivo", "Nota"]}
        datas={[curr.disciplina.nome, curr.disciplina.horas, curr.semestre, curr.nota]}
    />);

    let discDestino = props.blockDestiny.map( curr => 
        <MultiRowDisplay
            key={curr.id} 
            mainTitle={curr.disciplina.codigo}
            titles={["Nome", "Carga Horária Aproveitada","Nota"]}
            datas={[curr.disciplina.nome, curr.hora, curr.nota]}
        />);
    

    return(
        <Card className="superBlockCardComponentContainer">
            <CardContent className="superBlockCardComponentTitlesContainer">
                <Typography variant="h5">
                    {props.blockTitle}
                </Typography>
                <Typography variant="h6">
                    Cadastrado em {props.blockDate}
                </Typography>
            </CardContent>
            <CardContent className="superBlockCardComponentGrid3">
                <MultiRowDisplay
                    mainTitle="Solicitador"
                    titles={["SIAPE", "Nome", "Unidade de Lotação"]}
                    datas={[props.blockSol.siape, props.blockSol.nome, props.blockSol.dep]}
                />
                {parecerista}
                <OrdinaryDisplay
                    title="Observações"
                    data={props.blockObs?props.blockObs:"Este bloco não possui observações"}
                />
            </CardContent>
            <CardContent className="superBlockCardComponentGrid2">
                <div className="superBlockCardComponentFlexColumn">
                    {discOrigem}
                </div>
                <div className="superBlockCardComponentFlexColumn">
                    {discDestino}
                </div>
            </CardContent>

        </Card>
    )

}