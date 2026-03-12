import {Alert, Snackbar} from "@mui/material";
import {useErrorStore} from "../../stores/useErrorStore.ts";

function ErrorSnackbar() {
    const {error, visible, setVisible} = useErrorStore();
    return (
        <Snackbar
            autoHideDuration={6000}
            open={visible}
            onClose={() => setVisible(false)}
        >
            <Alert variant="filled" severity={"error"}>{error}</Alert>
        </Snackbar>
    )
}

export default ErrorSnackbar;