use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
struct FilesResponse {
    #[serde(rename = "Files().aFiles()")]
    files: HashMap<String, FileEntry>,
}

#[derive(Debug, Deserialize)]
struct FileEntry {
    #[serde(rename = "_idRow")]
    id_row: String,

    #[serde(rename = "_sFile")]
    file: String,

    #[serde(rename = "_nFilesize")]
    filesize: u64,

    #[serde(rename = "_tsDateAdded")]
    date_added: u64,

    #[serde(rename = "_nDownloadCount")]
    download_count: u64,

    #[serde(rename = "_sDownloadUrl")]
    download_url: String,

    #[serde(rename = "_sMd5Checksum")]
    md5_checksum: String,

    #[serde(rename = "_sAnalysisState")]
    analysis_state: String,

    #[serde(rename = "_sAnalysisResult")]
    analysis_result: String,

    #[serde(rename = "_sAnalysisResultVerbose")]
    analysis_result_verbose: String,

    #[serde(rename = "_sAvState")]
    av_state: String,

    #[serde(rename = "_sAvResult")]
    av_result: String,

    #[serde(rename = "_bIsArchived")]
    is_archived: bool,

    #[serde(rename = "_bHasContents")]
    has_contents: bool,

    #[serde(rename = "_sVersion")]
    version: String,

    #[serde(rename = "_sDescription")]
    description: String,
}
