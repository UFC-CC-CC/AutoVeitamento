import React from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { BrowserRouter as BrowserRouter, Route, Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import RestoreIcon from '@material-ui/icons/Restore';
import SearchIcon from '@material-ui/icons/Search';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import Grow from '@material-ui/core/Grow';
import Collapse from '@material-ui/core/Collapse';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import SvgIcon from '@material-ui/core/SvgIcon';


// props.openModal
// modalId
// modalTitle
// iconSrc
// iconHeight
// linkAdd
// linkEdit
const EditorSelectionButton = props => (<Grid item>
                        <Button onClick={()=>{props.openModal(props.modalId)}} size="large" variant="contained" color="primary" style={{minWidth: '420px'}}>
                            <img src={props.iconSrc} style={{marginRight:'10px', marginLeft: '-10px', width: '24px', height: props.IconHeight+"px"}}></img>
                            {props.modalTitle}
                        </Button>
                        <Collapse in={props.modal==props.modalId}>
                            <ButtonGroup size="large" aria-label="small outlined button group" style={{minWidth: '420px'}}>
                                <Link to={{ pathname: props.linkAdd, state: { inMainWindow: true }}}>
                                    <Button style={{minHeight:'44px' ,minWidth: '210px', border: "solid #CBCBCB",borderWidth:"0px 0px 1px 1px ", borderRadius: '0px 0px 0px 4px', marginTop: '-2px'}}>
                                        <AddCircleOutlineRoundedIcon style={{marginRight:'10px', marginLeft: '-10px'}}/>
                                        Adicionar
                                    </Button>
                                </Link>
                                <Link to={{ pathname: props.linkEdit, state: { inMainWindow: true }}}>
                                    <Button style={{minHeight:'44px' ,minWidth: '210px',border: "solid #CBCBCB",borderWidth:"0px 1px 1px 0px ", borderRadius: '0px 0px 4px 0px', marginTop: '-2px'}}>
                                        <EditIcon style={{marginRight:'10px', marginLeft: '-10px'}}/>
                                        Editar
                                    </Button>   
                                </Link>
                            </ButtonGroup>
                        </Collapse>
</Grid>);

export default EditorSelectionButton;