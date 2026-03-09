import {Modal} from "@mui/material";
import Button from "../Button/Button.tsx";

function Options({isOpen, onClose}: { isOpen: boolean, onClose: () => void }) {
    return (
        <Modal onClose={onClose} open={isOpen}>
            <div className="absolute top-1/2 left-1/2 -translate-1/2 w-2/4 h-2/3 bg-darkBlue rounded-md">
                <div className="mx-8 h-full">
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="text-white mt-8 text-3xl font-extrabold">
                                Options
                            </div>
                            <div className="mt-8 text-xl">
                                <label className="block mb-2">
                                    Deadlock Path
                                </label>
                                <div className="flex">
                                    <div className="bg-gray-800 grow mr-20"><input className="text-lg m-1 w-full"/>
                                    </div>
                                    <Button>
                                        Auto-Detect
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="ml-auto mb-8 text-2xl">
                            <Button>Apply</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default Options;