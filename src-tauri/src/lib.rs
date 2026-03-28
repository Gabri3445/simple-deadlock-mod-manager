// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use crate::config::{load_config, ConfigState};
use directories::ProjectDirs;
use std::sync::Mutex;
use tauri::Manager;

mod commands;
mod config;
mod gamebanana_api;
mod types;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if let Some(proj_dirs) = ProjectDirs::from("", "sdmm", "sdmm") {
                let config_dir = proj_dirs.config_dir().join("config.json");
                let cache_dir = proj_dirs.cache_dir();
                let config = load_config()?;
                app.manage(ConfigState {
                    config_path: config_dir,
                    cache_path: cache_dir.to_path_buf(),
                    config: Mutex::new(config),
                });
            };

            /*
            let path = home_dir()
                .ok_or("Unable to locate home directory")?
                .join(CONFIG_PATH);
            app.manage(ConfigState {
                path,
                config: Mutex::new(config),
            });*/
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_auto_detect_deadlock_path,
            commands::get_config,
            commands::change_path,
            commands::list_mods,
            commands::check_gameinfo_validity,
            commands::make_config_valid,
            commands::change_mod_name,
            commands::apply_changes,
            commands::copy_mod_to_game,
            commands::delete_mod,
            commands::process_compressed_file,
            commands::download_mod_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
