import {Textfit} from "react-textfit";

function FileSelect({filePath, setChecked, index}: {
    filePath: string,
    index: number,
    setChecked: (checked: boolean, index: number) => void
}) {
    return (
        <div className="flex pl-2 gap-2 border border-gray-400 p-2 rounded-md bg-gray-800">
            <input className="h-6 w-6 " type="checkbox" onChange={(e) => setChecked(e.target.checked, index)}/>
            <Textfit mode={"single"}>{filePath}</Textfit>
        </div>
    )
}

export default FileSelect;