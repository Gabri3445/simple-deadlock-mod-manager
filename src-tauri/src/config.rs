use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::env::home_dir;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use directories::ProjectDirs;

/*
todo: could link each mod to a gamebanana link to check for updates
another hashmap with <file name, gamebanana link>
if the mod is not linked the value should be ""
 */
//add versioning
#[derive(Default, Deserialize, Serialize, Clone)]
pub struct ModManagerConfig {
    pub deadlock_path: String,
    pub mod_names: HashMap<String, String>,
}

pub struct ConfigState {
    pub path: PathBuf,
    pub config: Mutex<ModManagerConfig>,
}

pub fn save_config(
    config_state: &ConfigState,
) -> Result<ModManagerConfig, Box<dyn std::error::Error>> {
    let config = config_state
        .config
        .lock()
        .map_err(|_| "couldn't acquire config lock")?;
    if let Some(parent) = config_state.path.parent() {
        std::fs::create_dir_all(parent)?;
    }
    let json = serde_json::to_string_pretty(&*config)?;
    std::fs::write(&config_state.path, json)?;
    Ok(config.clone())
}

pub fn load_config() -> Result<ModManagerConfig, Box<dyn std::error::Error>> {
    let mut path = PathBuf::new();
    if let Some(proj_dirs) = ProjectDirs::from("", "sdmm", "sdmm") {
        path = proj_dirs.config_dir().to_path_buf().join("config.json");
    }
    if !path.exists() {
        let default_config = ModManagerConfig::default();
        save_config(&ConfigState {
            path,
            config: Mutex::new(default_config.clone()),
        })?;
        return Ok(default_config);
    }
    let contents = std::fs::read_to_string(&path)?;
    let config = serde_json::from_str::<ModManagerConfig>(&contents)?;
    Ok(config)
}
