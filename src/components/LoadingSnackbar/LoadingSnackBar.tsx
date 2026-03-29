import {Alert, CircularProgress, Snackbar} from "@mui/material";
import {useLoadingStore} from "../../stores/useLoadingStore.ts";

function LoadingSnackBar() {
    const {isLoading, setIsLoading} = useLoadingStore();
    return (
        <Snackbar
            open={isLoading}
            onClose={() => setIsLoading(false)}
        >
            <Alert variant="filled" severity={"info"} className={"bg-gunItem! text-black!"}><CircularProgress
                sx={{color: "#000000"}}/> Loading </Alert>
        </Snackbar>
    )
}

export default LoadingSnackBar;