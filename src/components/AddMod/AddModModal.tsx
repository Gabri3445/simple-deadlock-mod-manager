import {useErrorStore} from "../../stores/useErrorStore.ts";
import {Modal} from "@mui/material";
import Button from "../Button/Button.tsx";

function AddModModal({modalOpen, setModalOpen}: { modalOpen: boolean, setModalOpen: (open: boolean) => void }) {
    const {setVisible, setError} = useErrorStore();

    return (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4 bg-darkBlue rounded-md min-w-160 min-h-100 flex flex-col">
                <div className="mt-8 mx-8">
                    <div className="font-bold text-3xl">Add a mod</div>
                </div>
                <div className="flex-1 flex flex-col gap-4 mx-8 mt-8 ">
                    <div className="text-xl flex h-fit justify-between w-full">
                        Pick a .vpk or .zip/.rar file
                        <Button>Browse</Button>
                    </div>
                    <div className="text-xl mb-2">
                        Download from GameBanana
                        <div className="flex">
                            <div className="bg-gray-800 grow mr-2">
                                <input className="text-lg m-1 w-full mr-" type={"text"}/>
                            </div>
                            <Button>Download</Button>
                        </div>

                    </div>
                </div>
                <div className="mb-4 mx-4 flex justify-between">
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                </div>
            </div>
        </Modal>
    )
}

export default AddModModal;