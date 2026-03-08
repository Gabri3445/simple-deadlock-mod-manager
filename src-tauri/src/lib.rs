// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use crate::config::ModManagerConfig;
use std::env::home_dir;
use std::fs::{create_dir_all, read_to_string, write};
use std::sync::Mutex;
use tauri::Manager;

mod commands;
mod config;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let path = home_dir().unwrap().join(".config/dmm/config.json");
            println!("{}", path.display());
            if path.exists() {
                let contents = read_to_string(path).unwrap();
                let config = serde_json::from_str::<ModManagerConfig>(&contents)?;
                app.manage(Mutex::new(config));
                return Ok(());
            }
            if let Some(parent) = path.parent() {
                create_dir_all(parent)?;
            }
            write(
                path,
                serde_json::to_string_pretty(&ModManagerConfig::default())?,
            )?;
            app.manage(Mutex::new(ModManagerConfig::default()));
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        // This macro automatically discovers all #[tauri::command] functions from imported modules
        .invoke_handler(tauri::generate_handler![commands::get_deadlock_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
