import Button from "../Button/Button.tsx";

function LoadModButtons() {
    return (
        <div className="h-full flex justify-center items-center sticky bottom-0">
            <div className="flex flex-col gap-2">
                <Button>&lt;&lt;</Button>
                <Button>&gt;&gt;</Button>
            </div>
        </div>
    )
}

export default LoadModButtons;