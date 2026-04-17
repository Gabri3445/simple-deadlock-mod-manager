import {Modal} from "@mui/material";
import {useModManageStore} from "../../../stores/useModManageStore.ts";
import Button from "../../Button/Button.tsx";

function ManageModModal() {

    const {modManageModalOpen, fileName, userName, setModManageModalOpen} = useModManageStore();

    const onCloseModal = () => {
        setModManageModalOpen(false);
    }

    const onApply = () => {
        setModManageModalOpen(false);
    }

    return (
        <Modal open={modManageModalOpen} onClose={onCloseModal}>
            <div
                className="absolute top-1/2 left-1/2 -translate-1/2 w-2/4 h-2/3 bg-darkBlue rounded-md min-w-160 min-h-30 flex flex-col">
                <div className="mt-8 ml-8 text-3xl font-extrabold">
                    Manage Mod
                </div>
                <div className="mx-8 mt-8 text-xl grow">
                    <div className="flex gap-2">
                        <label>File Name</label>
                        <div className="bg-gray-800 grow">{fileName}</div>
                    </div>
                    <div className="flex gap-2 mt-8">
                        <label>User Name</label>
                        <div className="bg-gray-800 grow">{userName}</div>
                    </div>
                    <div className="flex gap-2 mt-8">
                        <label>GameBanana Link</label>
                        <div className="bg-gray-800 grow">WIP</div>
                    </div>
                    <div className="flex gap-2 mt-8">
                        <Button>Delete Mod</Button>
                    </div>
                </div>
                <div className="flex w-full justify-between px-8 mb-8 text-xl">
                    <Button onClick={onCloseModal}>Close</Button>
                    <Button onClick={onApply}>Apply</Button>
                </div>
            </div>
        </Modal>
    )
}

export default ManageModModal;