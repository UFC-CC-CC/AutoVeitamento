import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from "@material-ui/core";
import "./OneLineDisplay.css";


export default function OneLineDisplay (props) {

    return(
        <Card  className="oneLineDisplayCardContainer">
            <CardContent className="oneLineDisplayTitleContainer" style={{padding: '10px'}}>
                <Typography variant="h5" className="oneLineInlineBlock">
                    {props.title}:{"    "}
                </Typography>
                <Typography className="oneLineInlineBlock">
                    {props.data}
                </Typography>
            </CardContent>
        </Card>
    )

}