import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {ShowAppDialogContext} from "../contexts/contexts";
import {useContext} from "react";

export default function AppChoiceDialog(props) {
  const { component, title } = props;

  const createNew = ()=>{
      props.createNew();
  };

  const createOld = ()=>{
      props.createOld();
  };

  // console.log({component})

  const { handleShowAppDialog, showAppDialog } = useContext(ShowAppDialogContext);

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth="xs"
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
          <Button color="error" onClick={() => handleShowAppDialog()}>
            Cancel
          </Button>
            <Button color="error" onClick={() => {
                createNew();
                handleShowAppDialog();
            }}>
            CREATE NEW
          </Button>
           <Button onClick={()=> {
               createOld();
               handleShowAppDialog();
           }
           } autoFocus>
            CREATE OLD
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
