// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use crate::config::{load_config, ConfigState, CONFIG_PATH};
use std::env::home_dir;
use std::sync::Mutex;
use tauri::Manager;

mod commands;
mod config;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let config = load_config()?;
            let path = home_dir()
                .ok_or("Unable to locate home directory")?
                .join(CONFIG_PATH);
            app.manage(ConfigState {
                path,
                config: Mutex::new(config),
            });
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_deadlock_path,
            commands::load_config_command,
            commands::change_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
