import Button from "../Button/Button.tsx";
import {useModsStore} from "../../stores/useModsStore.ts";
import {ModTabVariant} from "../ModTab/ModTab.tsx";

enum ButtonType {
    LEFT,
    RIGHT
}

function LoadModButtons() {
    const {selectedMods, changeModLoadStatus} = useModsStore();
    const onClick = (buttonType: ButtonType) => {
        if (selectedMods.length === 0) {
            return;
        }
        if (buttonType === ButtonType.LEFT && selectedMods[0].variant === ModTabVariant.UnloadedMods
            ||
            buttonType === ButtonType.RIGHT && selectedMods[0].variant === ModTabVariant.LoadedMods) {
            return;
        }
        changeModLoadStatus(selectedMods);
    }
    return (
        <div className="h-full flex justify-center items-center bottom-0">
            <div className="flex flex-col gap-2 fixed">
                <Button onClick={() => onClick(ButtonType.LEFT)}>&lt;&lt;</Button>
                <Button onClick={() => onClick(ButtonType.RIGHT)}>&gt;&gt;</Button>
            </div>
        </div>
    )
}

export default LoadModButtons;