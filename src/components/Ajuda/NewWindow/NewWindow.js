import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import CreatableSelect from 'react-select/lib/Creatable';
import SelectMulti from '../../DataReceivers/SelectMulti/SelectMulti';
class NewWindow extends Component {

    openNewWindow = ()=>{
        window.open("/cadastroAluno", '_blank');
    }

    render(){
        return(
            <div>
                <h1>{this.props.location.state.testando}</h1>
            </div>
        );
    }
}

export default withRouter(NewWindow);