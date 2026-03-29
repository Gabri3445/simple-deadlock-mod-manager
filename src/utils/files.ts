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
                        const vpkFilePaths = await processCompressedFile({path: files[i], fType: "Zip"});
                        if (vpkFilePaths.length === 1) {
                            await copyModToGame({path: vpkFilePaths[0], userName: getFileName(files[i])});
                        } else {
                            if (setFileSelectModalOpen && setFilePaths) {
                                setFileSelectModalOpen(true);
                                setFilePaths(vpkFilePaths);
                            }
                        }
                        break;
                    }
                    case "rar": {
                        const vpkFilePaths = await processCompressedFile({path: files[i], fType: "Rar"});
                        if (vpkFilePaths.length === 1) {
                            await copyModToGame({path: vpkFilePaths[0], userName: getFileName(files[i])},);
                        } else {
                            if (setFileSelectModalOpen && setFilePaths) {
                                setFileSelectModalOpen(true);
                                setFilePaths(vpkFilePaths);
                            }
                        }
                        break;
                    }
                    case "7z": {
                        const vpkFilePaths = await processCompressedFile({path: files[i], fType: "SevenZ"});
                        if (vpkFilePaths.length === 1) {
                            await copyModToGame({path: vpkFilePaths[0], userName: getFileName(files[i])},);
                        } else {
                            if (setFileSelectModalOpen && setFilePaths) {
                                setFileSelectModalOpen(true);
                                setFilePaths(vpkFilePaths);
                            }
                        }
                        break;
                    }
                    default:
                        throw `Unknown extension "${extensions[i]}"`
                }
            }
        }
    }
}

export function getFileName(filePath: string) {
    return (filePath.split(/[/\\]/).pop() || '').replace(/\.[^/.]+$/, '');
}