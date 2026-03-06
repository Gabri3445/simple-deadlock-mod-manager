import Button from "../Button/Button.tsx";

function TopBar() {
    return (
        <div className="w-full bg-topbar p-4 flex justify-between">
            <h1 className="text-3xl block font-bold">Deadlock Mod Manager</h1>
            <div className="flex gap-4">
                <Button>Load Mod</Button>
                <Button>Options</Button>
                <Button>Apply</Button>
            </div>
        </div>
    )
}

export default TopBar;