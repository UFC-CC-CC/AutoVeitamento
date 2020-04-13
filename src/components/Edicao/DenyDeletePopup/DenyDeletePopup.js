import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


const denyDeletePopup = (onConfirm, instance,conflicts) => {

    let translations = {
        sessoes: "Sessões",
        aproveitamentos: "Aproveitamentos",
        professores: "Professores",
        disciplinas: "Disciplinas",
        blocos: "Blocos de Aproveitamentos",
        configuracoes: "Configurações do Programa de Aproveitamentos"
    }

    let components = []

    for(let i in conflicts){
        if(conflicts[i].length == 0) continue

        let toBeAdded = conflicts[i].map(curr=><li>{curr}</li>);
        components.push(<div key={i}>
            <h5 style={{color: "red"}}>{translations[i]}: </h5>
            <ul style={{color: "red"}}>
                {toBeAdded}
            </ul>
        </div>)
    }

	confirmAlert({
		customUI: ({ onClose }) => {
            return (
              <div className='custom-ui alert-container'>
                <h2>Não é possível realizar essa exclusão!</h2>
                <h3>{instance} presente nas seguintes estruturas: </h3>
                <br/>
                {components}
                <button
                 class="btn btn-primary mr-md-5"
                  onClick={() => {
                    onClose();
                    onConfirm()
                }}
                >
                  Entendido.</button>
              </div>
            );
          }
	});
	
}


export default denyDeletePopup;