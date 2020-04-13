import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from "@material-ui/core";
import "./BlockDisplay.css";

export default function BlockDisplay (props) {

    return(
        <Card  className="blockDisplayCardContainer">
            <CardContent className="blockDisplayGridContainer">
                <div>
                    {props.origin.map( curr =>  <Typography variant="h5"> {curr} </Typography>)}
                </div>
                
                <Typography variant="h5" style={{fontSize: "35px"}}>→</Typography>

                <div>
                    {props.destiny.map( curr =>  <Typography variant="h5"> {curr} </Typography>)}
                </div>
            </CardContent>
        </Card>
    )

}