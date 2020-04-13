import React, {Component} from "react";
import { BrowserRouter as BrowserRouter, Route, Link } from "react-router-dom";

export default class FileTester extends Component {
	state = {}


	changeJSON = ()=>{
		const electron = window.require('electron');
		const fs = electron.remote.require('fs');
		
		let newJSON = {
			c: 789,
			d: 101112
		}
		fs.writeFileSync("./src/database/tester.json", JSON.stringify(newJSON, null, 4));
	}

	readJSON=()=>{
		const electron = window.require('electron');
		const fs = electron.remote.require('fs');

		fs.readFile("./src/database/tester.json", (err, data) => {
			if (err) throw err;
			this.setState(JSON.parse(data));
		});
	}

    render(){
        return(
            <div>
				{JSON.stringify({...this.state})}
				<button onClick={()=>{this.changeJSON()}}>Change that thang!</button>
				<button onClick={()=>{this.readJSON()}}>Read that thang!</button>
            </div>
        );
    }
}