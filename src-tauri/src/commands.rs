// Command registry for Deadlock Mod Manager
// This module contains all Tauri commands organized in a maintainable way

const DEADLOCK_APP_ID: u32 = 1422450;

/// Get the path to the Deadlock game installation directory
#[tauri::command]
pub fn get_deadlock_path() -> Result<String, String> {
    let steam_dir = steamlocate::SteamDir::locate().map_err(|e| e.to_string())?;
    match steam_dir.find_app(DEADLOCK_APP_ID) {
        Ok(Some((deadlock, library))) => {
            let app_dir = library.resolve_app_dir(&deadlock);
            Ok(app_dir.to_str().unwrap().to_string())
        }
        Ok(None) => Err("Deadlock not found".to_string()),
        Err(e) => Err(format!("Failed to find Steam app: {}", e)),
    }
}
