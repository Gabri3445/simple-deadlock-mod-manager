// Command registry for Deadlock Mod Manager
// This module contains all Tauri commands organized in a maintainable way

use crate::config::{ConfigState, ModManagerConfig};
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
    let mut config = state.config.lock().unwrap();
    config.deadlock_path = path.clone();
    Ok(path)
}
