use crate::config::ModManagerConfig;
use crate::types::{ModName, Mods};
use regex::Regex;
use std::path::{Path, PathBuf};
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

pub fn process_mod_directory(
    mod_path: &Path,
    config: &mut ModManagerConfig,
) -> Result<Mods, String> {
    let regex = Regex::new(crate::commands::VALID_MOD_REGEX).unwrap();
    let mut result = Mods::default();

    if mod_path.is_dir() {
        for entry in std::fs::read_dir(mod_path).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            if entry.file_type().map_err(|e| e.to_string())?.is_file() {
                let name = entry.file_name().to_string_lossy().into_owned();

                // Determine the user_name
                let user_name = if let Some(existing_name) = config.mod_names.get(&name) {
                    existing_name.clone()
                } else {
                    config.mod_names.insert(name.clone(), name.clone());
                    name.clone()
                };

                let mod_name = ModName {
                    user_name,
                    file_name: entry.file_name().to_string_lossy().into_owned(),
                };

                if regex.is_match(&name) {
                    result.loaded_mods.push(mod_name);
                } else if entry.path().extension().map_or(false, |ext| ext == "vpk") {
                    result.unloaded_mods.push(mod_name);
                }
            }
        }
    }

    Ok(result)
}
