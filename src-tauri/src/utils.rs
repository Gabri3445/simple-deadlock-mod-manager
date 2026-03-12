use crate::config::ModManagerConfig;
use crate::types::ModName;
use std::path::PathBuf;
use std::sync::MutexGuard;

pub fn update_config_mod_name(
    config: &mut MutexGuard<ModManagerConfig>,
    mod_name: &ModName,
    new_name: String,
) {
    if config.mod_names.remove(&mod_name.file_name).is_some() {
        if mod_name.file_name == mod_name.user_name {
            config.mod_names.insert(new_name.clone(), new_name);
        } else {
            config
                .mod_names
                .insert(new_name, mod_name.user_name.clone());
        }
    }
}

//basic way to check if the path is valid
pub fn is_deadlock_path_valid(deadlock_path: &String) -> bool {
    let gameinfo_path = PathBuf::from(deadlock_path)
        .join("game")
        .join("citadel")
        .join("gameinfo.gi");
    gameinfo_path.exists()
}
