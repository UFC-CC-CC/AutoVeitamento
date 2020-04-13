import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import willContinue from '../../../utilities/confirmAlert';


const confirmDeletePopup = (onConfirm) => {

	confirmAlert({
		customUI: ({ onClose }) => {
            return (
              <div className='custom-ui alert-container'>
                <h2>Você tem certeza que deseja realizar essa exclusão?</h2>
                <h3>Essa ação <b>NÃO</b> poderá ser desfeita!</h3>
                <br/>
                <button
                 class="btn btn-primary mr-md-5"
                  onClick={() => {
                    onClose();
                }}
                >
                  Não, me enganei</button>
                <button
                 class="btn btn-danger mr-md-5"
                  onClick={() => {
                    onClose();
                    onConfirm();
                }}
                >Sim, realize a exclusão</button>
              </div>

            );
          }
	});
	
}


export default confirmDeletePopup;