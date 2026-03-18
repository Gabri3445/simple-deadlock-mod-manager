import {Textfit} from "react-textfit";

function FileSelect({filePath, setChecked}: { filePath: string, setChecked: (checked: boolean) => void }) {
    return (
        <div className="flex pl-2 gap-2 border border-gray-400 p-2 rounded-md">
            <input className="h-6 w-6 " type="checkbox" onChange={(e) => setChecked(e.target.checked)}/>
            <Textfit mode={"single"}>{filePath}</Textfit>
        </div>
    )
}

export default FileSelect;