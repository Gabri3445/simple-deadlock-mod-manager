use crate::config::{save_config, ConfigState, ModManagerConfig};
use regex::Regex;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::State;

const DEADLOCK_APP_ID: u32 = 1422450;

/// Get the path to the Deadlock game installation directory
#[tauri::command]
pub fn get_deadlock_path() -> Result<String, String> {
    let steam_dir = steamlocate::SteamDir::locate().map_err(|e| e.to_string())?;
    match steam_dir.find_app(DEADLOCK_APP_ID) {
        Ok(Some((deadlock, library))) => {
            let app_dir = library.resolve_app_dir(&deadlock);
            Ok(app_dir.to_string_lossy().into_owned())
        }
        Ok(None) => Err("Deadlock not found".to_string()),
        Err(e) => Err(format!("Failed to find Steam app: {}", e)),
    }
}

#[tauri::command]
pub fn load_config_command(state: State<ConfigState>) -> Result<ModManagerConfig, String> {
    Ok(state.config.lock().map_err(|e| e.to_string())?.clone())
}

#[tauri::command]
pub fn change_path(path: String, state: State<ConfigState>) -> Result<String, String> {
    let mut config = state.config.lock().map_err(|e| e.to_string())?;
    config.deadlock_path = path.clone();
    save_config(&ConfigState {
        path: state.path.clone(),
        config: Mutex::new(config.clone()),
    })
    .map_err(|e| e.to_string())?;
    Ok(path)
}

//TODO: temp function for testing, this should either return two lists for loaded and unloaded mods or have two different functions
#[tauri::command]
pub fn list_mods(state: State<ConfigState>) -> Result<Vec<String>, String> {
    let config = state.config.lock().map_err(|e| e.to_string())?;
    let mod_path = PathBuf::from(config.deadlock_path.clone()) //TODO: make sure to create the addons directory if it does not exist
        .join("game")
        .join("citadel")
        .join("addons");
    let mut result: Vec<String> = Vec::new();
    let regex = Regex::new(r"^pak\d\d_dir\.vpk").unwrap();
    if mod_path.is_dir() {
        for entry in std::fs::read_dir(&mod_path).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let name = entry.file_name().to_string_lossy().into_owned();
            if regex.is_match(&name) {
                result.push(name);
            }
        }
    }
    Ok(result)
}
