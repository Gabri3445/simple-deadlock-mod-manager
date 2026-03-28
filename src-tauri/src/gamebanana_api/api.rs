//https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid=657822&fields=Files().aFiles()&return_keys=1

use crate::gamebanana_api::types::FilesResponse;

pub async fn get_mod_files(mod_id: &str) -> Result<FilesResponse, String> {
    let body = reqwest::get(&format!("https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid={}&fields=Files().aFiles()&return_keys=1", mod_id))
        .await
        .map_err(|_e| String::from("Error while downloading files"))?
        .text()
        .await.
        map_err(|_e| String::from("Error while downloading files"))?;
    let data: FilesResponse =
        serde_json::from_str(&body).map_err(|_e| String::from("Error while downloading files"))?;
    Ok(data)
}

pub async fn download_mod(url: &str) -> Result<Vec<u8>, String> {
    let data = reqwest::get(url)
        .await
        .map_err(|_e| String::from("Error while downloading files"))?
        .bytes()
        .await
        .map_err(|_e| String::from("Error while downloading files"))?;
    Ok(data.to_vec())
}
