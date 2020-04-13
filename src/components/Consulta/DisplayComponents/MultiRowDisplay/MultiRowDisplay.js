import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from "@material-ui/core";
import "./MultiRowDisplay.css";


// props.mainTitle
// props.titles (array)
// props.datas (array)

export default function MultiRowDisplay (props) {

    let data = props.titles.map((curr, index) => {
        return <CardContent className="multiRowDisplayTitleCell" style={{padding: '10px'}}>
                    <Typography variant="h6" className="multiRowDisplayInlineText">
                        {curr}: {"  "}
                    </Typography>
                    <Typography className="multiRowDisplayInlineText">
                        {props.datas[index]}
                    </Typography>
                </CardContent>
    })
    return(
        <Card  className="multiRowDisplayCardContainer">
            <CardContent className="multiRowDisplayTitleContainer" style={{padding: '10px'}}>
                <Typography variant="h5">
                    {props.mainTitle}
                </Typography>
            </CardContent>
            <div className="multiRowDisplayDataContainer">
                {data}
            </div>
        </Card>
    )

}