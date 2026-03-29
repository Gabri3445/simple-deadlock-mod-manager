//https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid=657822&fields=Files().aFiles()&return_keys=1

use crate::gamebanana_api::types::FilesResponse;
use futures_util::StreamExt;
use serde::Serialize;
use tauri::{AppHandle, Emitter};

pub async fn get_mod_files(mod_id: &str) -> Result<FilesResponse, String> {
    let body = reqwest::get(&format!("https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid={}&fields=Files().aFiles()&return_keys=1", mod_id))
        .await
        .map_err(|_e| String::from("Error while downloading files"))?
        .text()
        .await
        .map_err(|_e| String::from("Error while downloading files"))?;
    let data: FilesResponse =
        serde_json::from_str(&body).map_err(|_e| String::from("Error while downloading files"))?;
    Ok(data)
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DownloadProgress {
    downloaded: u64,
    total: u64,
    progress_percent: f64,
}

pub async fn download_mod(url: &str, app: AppHandle) -> Result<Vec<u8>, String> {
    let response = reqwest::get(url)
        .await
        .map_err(|_e| String::from("Error while downloading files"))?;
    let size = response
        .content_length()
        .ok_or(String::from("Failed to get content length"))?;
    let mut stream = response.bytes_stream();
    let mut downloaded: u64 = 0;
    let mut data: Vec<u8> = Vec::new();

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|_| "Error while downloading files")?;

        downloaded += chunk.len() as u64;
        data.extend_from_slice(&chunk);
        let progress = (downloaded as f64 / size as f64) * 100.0;

        app.emit(
            "download-progress",
            DownloadProgress {
                progress_percent: progress,
                downloaded,
                total: size,
            },
        )
        .map_err(|_| "Failed to emit progress")?;
    }

    Ok(data.to_vec())
}
