import {copyModToGame, processCompressedFile} from "../generated";


interface ProcessFilesArguments {
    files: string[];
    setFileSelectModalOpen?: (modalOpen: boolean) => void;
    setFilePaths?: (fileNames: string[]) => void;
}

export default async function processFiles({files, setFilePaths, setFileSelectModalOpen}: ProcessFilesArguments) {
    if (files.length === 0) {
        throw new Error("No files found.");
    }
    const extensions = files.map(file => {
        const parts = file.split('.');
        return parts.length > 1 ? parts.pop()?.toLowerCase() : null;
    });
    if (extensions.length > 0) {
        for (let i = 0; i < files.length; i++) {
            if (extensions[i] === "vpk") {
                await copyModToGame({path: files[i]});
            } else {
                switch (extensions[i]) {
                    case "zip": {
                        const filePaths = await processCompressedFile({path: files[i], fType: "Zip"});
                        if (filePaths.length === 1) {
                            await copyModToGame({path: filePaths[1]});
                        } else {
                            if (setFileSelectModalOpen && setFilePaths) {
                                setFileSelectModalOpen(true);
                                setFilePaths(filePaths);
                            }
                        }
                        return;
                    }
                    case "rar": {
                        const filePaths = await processCompressedFile({path: files[i], fType: "Rar"});
                        if (filePaths.length === 1) {
                            await copyModToGame({path: filePaths[1]});
                        } else {
                            if (setFileSelectModalOpen && setFilePaths) {
                                setFileSelectModalOpen(true);
                                setFilePaths(filePaths);
                            }
                        }
                        return;
                    }
                    default:
                        throw new Error(`Unknown extension "${extensions[i]}"`);
                }
            }
        }
    }
}