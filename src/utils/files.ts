import {CompressedFileType, copyModToGame, processCompressedFile} from "../generated";


interface ProcessFilesArguments {
    files: string[];
    setFileSelectModalOpen?: (modalOpen: boolean) => void;
    setFilePaths?: (fileNames: string[]) => void;
}

async function getVpkFilesFromCompressedFile(files: string[], i: number, setFileSelectModalOpen: ((modalOpen: boolean) => void) | undefined, mergedPaths: string[], fType: CompressedFileType) {
    let vpkFilePaths = await processCompressedFile({path: files[i], fType});
    if (vpkFilePaths.length === 1) {
        await copyModToGame({path: vpkFilePaths[0], userName: getFileName(files[i])});
    } else {
        if (setFileSelectModalOpen) {
            setFileSelectModalOpen(true);
            mergedPaths = mergedPaths.concat(vpkFilePaths);
        }
    }
    return mergedPaths;
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
        let mergedPaths: string[] = [];
        for (let i = 0; i < files.length; i++) {
            if (extensions[i] === "vpk") {
                await copyModToGame({path: files[i]});
            } else {
                switch (extensions[i]) {
                    case "zip": {
                        mergedPaths = await getVpkFilesFromCompressedFile(files, i, setFileSelectModalOpen, mergedPaths, "Zip");
                        break;
                    }
                    case "rar": {
                        mergedPaths = await getVpkFilesFromCompressedFile(files, i, setFileSelectModalOpen, mergedPaths, "Rar");
                        break;
                    }
                    case "7z": {
                        mergedPaths = await getVpkFilesFromCompressedFile(files, i, setFileSelectModalOpen, mergedPaths, "SevenZ");
                        break;
                    }
                    default:
                        throw `Unknown extension "${extensions[i]}"`
                }
            }
        }
        if (setFilePaths) {
            setFilePaths(mergedPaths);
        }
    }
}

export function getFileName(filePath: string) {
    return (filePath.split(/[/\\]/).pop() || '').replace(/\.[^/.]+$/, '');
}