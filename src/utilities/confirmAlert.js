import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import checked from "../images/White_check.svg.png";
import "../styles/alertStyles.css";

const willContinue = (updateState, inMainWindow) => {
	confirmAlert({
		customUI: ({ onClose }) => {

			setTimeout(()=>{
				if(inMainWindow){
					updateState(true);
					onClose();
				}
				else{
					window.require('electron').remote.getCurrentWindow().close();
				}
			}, 1000);
			
			return (
			  <div className='custom-ui alert-container text-center alertCustomContainer'>
				<img className="alertCustomImage" src={checked} alt="Sucesso!"/>
			  </div>
			);
		  }
	});
	
}


export default willContinue;