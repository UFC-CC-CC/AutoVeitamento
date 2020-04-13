import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from "@material-ui/core";
import "./OrdinaryDisplay.css";


export default function OrdinaryDisplay (props) {

    return(
        <Card  className="ordinaryDisplayCardContainer">
            <CardContent className="ordinaryDisplayTitleContainer" style={{padding: '10px'}}>
                <Typography variant="h5">
                    {props.title}
                </Typography>
            </CardContent>
            <CardContent className="ordinaryDisplayGridContainer" style={{padding: '10px'}}>
                <Typography>
                    {props.data}
                </Typography>
            </CardContent>
        </Card>
    )

}