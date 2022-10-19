import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {ShowAppDialogContext} from "../contexts/contexts";
import {useContext} from "react";

export default function ItemListConfirmationDialog(props) {
    const {component, title} = props;

    const confirm = () => {
        props.confirm();
    };


    // console.log({component})

    const {handleShowAppDialog, showAppDialog} = useContext(ShowAppDialogContext);

    return (
        <div>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={showAppDialog}
                onClose={() => handleShowAppDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {component}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {props.onlyCancel ?
                        <Button color="error" onClick={() => handleShowAppDialog()} autoFocus>
                            CANCEL
                        </Button> :
                        <>
                            <Button color="error" onClick={() => handleShowAppDialog()}>
                                CANCEL
                            </Button>
                            <Button onClick={() => {
                                confirm();
                                handleShowAppDialog();
                            }
                            } autoFocus>
                                CONFIRM
                            </Button>
                        </>}
                </DialogActions>
            </Dialog>
        </div>
    );
}
