use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
pub struct FilesResponse {
    #[serde(rename = "Files().aFiles()")]
    pub files: HashMap<String, FileEntry>,
}

#[derive(Debug, Deserialize)]
pub struct FileEntry {
    #[serde(rename = "_idRow", default)]
    pub id_row: String,

    #[serde(rename = "_sFile", default)]
    pub file: String,

    #[serde(rename = "_nFilesize", default)]
    pub filesize: u64,

    #[serde(rename = "_tsDateAdded", default)]
    pub date_added: u64,

    #[serde(rename = "_nDownloadCount", default)]
    pub download_count: u64,

    #[serde(rename = "_sDownloadUrl", default)]
    pub download_url: String,

    #[serde(rename = "_sMd5Checksum", default)]
    pub md5_checksum: String,

    #[serde(rename = "_sAnalysisState", default)]
    pub analysis_state: String,

    #[serde(rename = "_sAnalysisResult", default)]
    pub analysis_result: String,

    #[serde(rename = "_sAnalysisResultVerbose", default)]
    pub analysis_result_verbose: String,

    #[serde(rename = "_sAvState", default)]
    pub av_state: String,

    #[serde(rename = "_sAvResult", default)]
    pub av_result: String,

    #[serde(rename = "_bIsArchived", default)]
    pub is_archived: bool,

    #[serde(rename = "_bHasContents", default)]
    pub has_contents: bool,

    #[serde(rename = "_sVersion", default)]
    pub version: String,

    #[serde(rename = "_sDescription", default)]
    pub description: String,
}
