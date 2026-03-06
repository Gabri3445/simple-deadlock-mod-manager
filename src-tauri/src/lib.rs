// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // This macro automatically discovers all #[tauri::command] functions from imported modules
        .invoke_handler(tauri::generate_handler![commands::get_deadlock_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
