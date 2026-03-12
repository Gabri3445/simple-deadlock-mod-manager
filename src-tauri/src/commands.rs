use crate::config::{save_config, ConfigState, ModManagerConfig};
use rand::Rng;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::fs::DirEntry;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use tauri::State;

const DEADLOCK_APP_ID: u32 = 1422450;

//From https://deadlocker.net/install-guide
const FILESYSTEM_BLOCK_CONTENTS: &str = r#"FileSystem
{
	//
	// The code that loads this file automatically does a few things here:
	//
	// 1. For each "Game" search path, it adds a "GameBin" path, in <dir>\bin
	// 2. For each "Game" search path, it adds another "Game" path in front of it with _<language> at the end.
	//    For example: c:\hl2\cstrike on a french machine would get a c:\hl2\cstrike_french path added to it.
	// 3. If no "Mod" key, for the first "Game" search path, it adds a search path called "MOD".
	// 4. If no "Write" key, for the first "Game" search path, it adds a search path called "DEFAULT_WRITE_PATH".
	//

	//
	// Search paths are relative to the exe directory\..\
	//
	SearchPaths
	{
		// These are optional language paths. They must be mounted first, which is why there are first in the list.
		// *LANGUAGE* will be replaced with the actual language name. If not running a specific language, these paths will not be mounted
		Game_Language		citadel_*LANGUAGE*

		Mod                 citadel
		Write               citadel
		Game                citadel/addons
		Game                citadel
		Mod                 core
		Write               core
		Game                core
		AddonRoot           citadel_addons
		OfficialAddonRoot   citadel_community_addons
	}
}"#;

const VALID_MOD_REGEX: &str = r"^pak\d\d_dir\.vpk";

#[derive(Default, Deserialize, Serialize, Clone)]
pub struct Mods {
    pub loaded_mods: Vec<ModName>,
    pub unloaded_mods: Vec<ModName>,
}

#[derive(Default, Deserialize, Serialize, Clone)]
pub struct ModName {
    pub file_name: String,
    pub user_name: String,
}

//basic way to check if the path is valid
fn is_deadlock_path_valid(deadlock_path: &String) -> bool {
    let gameinfo_path = PathBuf::from(deadlock_path)
        .join("game")
        .join("citadel")
        .join("gameinfo.gi");
    return gameinfo_path.exists();
}

/// Get the path to the Deadlock game installation directory
#[tauri::command]
pub fn get_auto_detect_deadlock_path() -> Result<String, String> {
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
pub fn get_config(state: State<ConfigState>) -> Result<ModManagerConfig, String> {
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

#[tauri::command]
pub fn list_mods(state: State<ConfigState>) -> Result<Mods, String> {
    let result: Mods;
    {
        let mut config = state.config.lock().map_err(|e| e.to_string())?;
        if !is_deadlock_path_valid(&config.deadlock_path) {
            return Err("Deadlock path is not valid".to_string());
        }
        if config.deadlock_path.is_empty() {
            return Err("Deadlock path not set".to_string());
        }

        let mod_path = PathBuf::from(config.deadlock_path.clone())
            .join("game")
            .join("citadel")
            .join("addons");
        std::fs::create_dir_all(&mod_path).map_err(|e| e.to_string())?;

        // Call the new function to get the Mods struct
        let mods = process_mod_directory(&mod_path, &mut config)?;
        result = mods;
    }
    save_config(&state).map_err(|e| e.to_string())?;
    Ok(result)
}

fn process_mod_directory(mod_path: &Path, config: &mut ModManagerConfig) -> Result<Mods, String> {
    let regex = Regex::new(VALID_MOD_REGEX).unwrap();
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

#[tauri::command]
pub fn check_gameinfo_validity(state: State<ConfigState>) -> Result<bool, String> {
    let config = state.config.lock().map_err(|e| e.to_string())?;
    let gameinfo_path = PathBuf::from(config.deadlock_path.clone())
        .join("game")
        .join("citadel")
        .join("gameinfo.gi");
    if gameinfo_path.is_file() {
        let contents = std::fs::read_to_string(&gameinfo_path).map_err(|e| e.to_string())?;
        return Ok(contents.contains(FILESYSTEM_BLOCK_CONTENTS));
    }
    Err(format!(
        "Gameinfo file does not exist at: {:?}",
        gameinfo_path
    ))
}

#[tauri::command]
pub fn make_config_valid(state: State<ConfigState>) -> Result<(), String> {
    let config = state.config.lock().map_err(|e| e.to_string())?;
    if !is_deadlock_path_valid(&config.deadlock_path) {
        return Err("Deadlock path is not valid".to_string());
    }
    let gameinfo_path = PathBuf::from(config.deadlock_path.clone())
        .join("game")
        .join("citadel")
        .join("gameinfo.gi");
    if gameinfo_path.is_file() {
        let contents = std::fs::read_to_string(&gameinfo_path).map_err(|e| e.to_string())?;

        if let Some(start_idx) = contents.find("FileSystem") {
            // Count braces to find the end of the block
            let mut brace_count = 0;
            let mut in_block = false;
            let mut end_idx = start_idx;

            for (i, c) in contents[start_idx..].char_indices() {
                if c == '{' {
                    brace_count += 1;
                    in_block = true;
                } else if c == '}' {
                    brace_count -= 1;
                }

                if in_block && brace_count == 0 {
                    end_idx = start_idx + i + 1;
                    break;
                }
            }

            // Replace the block
            let mut new_contents = String::new();
            new_contents.push_str(&contents[..start_idx]);
            new_contents.push_str(FILESYSTEM_BLOCK_CONTENTS);
            new_contents.push_str(&contents[end_idx..]);

            std::fs::write(gameinfo_path, new_contents).map_err(|e| e.to_string())?;
            return Ok(());
        }
        return Err("Gameinfo file does not contain filesystem".to_string());
    }
    Err(format!(
        "Gameinfo file does not exist at: {:?}",
        gameinfo_path
    ))
}

#[tauri::command]
pub fn change_mod_name(
    state: State<ConfigState>,
    mut user_name: String,
    file_name: String,
) -> Result<String, String> {
    {
        let mut config = state.config.lock().map_err(|e| e.to_string())?;
        if !config.mod_names.contains_key(&file_name) {
            return Err("File name is not valid".to_string());
        }
        if user_name == "" {
            user_name = file_name.clone();
        }
        let mod_name = config
            .mod_names
            .entry(file_name.clone())
            .or_insert(file_name);
        *mod_name = user_name.clone();
    }
    save_config(&state).map_err(|e| e.to_string())?;
    Ok(user_name)
}

pub enum Operation {
    LoadMods,
    UnloadMods,
}

/*
Todo:
This function takes in the which mods should be changed.
It will then rename mods that have been unloaded to ****pak**_dir.vpk
If the user has not specified a custom name for it then rename them to the new file name (****pak**_dir.vpk) else keep the user name for it
For mods that have been loaded it will rename them to pak**dir.vpk
Again if they do not have a custom name (check by comparing the user name and the file name) just rename to the new name or keep the custom one
Finally it should save the config with the modified file names
*/
#[tauri::command]
pub fn apply_changes(
    mods: Vec<ModName>,
    operation: Operation,
    state: State<ConfigState>,
) -> Result<Mods, String> {
    let mut discovered_mods = Mods::default();
    {
        let mut config = state.config.lock().map_err(|e| e.to_string())?;
        if !is_deadlock_path_valid(&config.deadlock_path) {
            return Err("Deadlock path is not valid".to_string());
        }
        if config.deadlock_path == "" {
            return Err("Deadlock path not set".to_string());
        }
        let mod_path = PathBuf::from(config.deadlock_path.clone())
            .join("game")
            .join("citadel")
            .join("addons");
        let mut mods_dir_entries = Vec::<DirEntry>::new();
        if mod_path.is_dir() {
            for entry in std::fs::read_dir(&mod_path).map_err(|e| e.to_string())? {
                let entry = entry.map_err(|e| e.to_string())?;
                if let Some(extension) = entry.path().extension() {
                    if extension == "vpk" {
                        mods_dir_entries.push(entry);
                    }
                }
            }
        }
        match operation {
            Operation::LoadMods => {
                //rename file to pak**_dir.vpk
                //check first available number (todo mod load order)
                for mod_to_load in mods {
                    for entry in &mods_dir_entries {
                        if mod_to_load.file_name == entry.file_name().to_string_lossy().to_string()
                        {
                            let mut pak_number = 1;
                            loop {
                                let new_name =
                                    mod_path.join(format!("pak{:02}_dir.vpk", pak_number));
                                if !new_name.exists() {
                                    std::fs::rename(entry.path(), new_name)
                                        .map_err(|e| e.to_string())?;
                                    break;
                                }
                                pak_number += 1;
                            }
                        }
                    }
                }
            }
            Operation::UnloadMods => {
                //add random 4 numbers to start
                let mut rng = rand::thread_rng();
                for mod_to_unload in mods {
                    for entry in &mods_dir_entries {
                        if mod_to_unload.file_name
                            == entry.file_name().to_string_lossy().to_string()
                        {
                            let random_prefix = rng.gen_range(0..9999);
                            let new_name = mod_path.join(format!(
                                "{}_{}",
                                random_prefix,
                                entry.file_name().to_string_lossy()
                            ));
                            std::fs::rename(entry.path(), new_name).map_err(|e| e.to_string())?;
                        }
                    }
                }
            }
        }
        discovered_mods = process_mod_directory(&mod_path, &mut config)?;
    }
    save_config(&state).map_err(|e| e.to_string())?;
    Ok(discovered_mods)
}
