import {Alert, Snackbar} from "@mui/material";
import {useLoadingStore} from "../../stores/useLoadingStore.ts";

function LoadingSnackBar() {
    const {isLoading, setIsLoading} = useLoadingStore();
    return (
        <Snackbar
            autoHideDuration={6000}
            open={isLoading}
            onClose={() => setIsLoading(false)}
        >
            <Alert variant="filled" severity={"info"}>Loading</Alert>
        </Snackbar>
    )
}

export default LoadingSnackBar;