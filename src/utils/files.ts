import {copyModToGame} from "../generated";

export default async function processFiles(files: string[]) {
    if (files.length === 0) {
        throw new Error("No files found.");
    }
    const extensions = files.map(file => {
        const parts = file.split('.');
        return parts.length > 1 ? parts.pop() : null;
    });
    if (extensions.length > 0) {
        for (let i = 0; i < files.length; i++) {
            if (extensions[i] === "vpk") {
                await copyModToGame({path: files[i]});
            } else if (extensions[i] === "zip" || extensions[i] === "rar") {
                //todo: rust command
            }
        }
    }
}