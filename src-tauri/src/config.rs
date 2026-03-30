use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Mutex;

/*
todo: could link each mod to a gamebanana link to check for updates
another hashmap with <file name, gamebanana link>
if the mod is not linked the value should be ""
 */
#[derive(Default, Deserialize, Serialize, Clone)]
pub struct ModManagerConfig {
    #[serde(default = "v1_version_default")]
    pub version: String,
    pub deadlock_path: String,
    pub mod_names: HashMap<String, String>,
}

fn v1_version_default() -> String {
    "1".to_string()
}

pub struct ConfigState {
    pub config_path: PathBuf,
    pub cache_path: PathBuf,
    pub config: Mutex<ModManagerConfig>,
}

pub fn save_config(
    config_state: &ConfigState,
) -> Result<ModManagerConfig, Box<dyn std::error::Error>> {
    let config = config_state.config.lock().map_err(|_| {
        log::error!("Config lock is poisoned.");
        "couldn't acquire config lock"
    })?;
    if let Some(parent) = config_state.config_path.parent() {
        std::fs::create_dir_all(parent).map_err(|_| {
            log::error!("Could not create parent directory for config path");
            "Could not create parent directory for config path"
        })?;
    }
    let json = serde_json::to_string_pretty(&*config).map_err(|_| {
        log::error!("Could not serialize config");
        "Could not serialize config"
    })?;
    std::fs::write(&config_state.config_path, json).map_err(|_| {
        log::error!("Could not write config file");
        "Could not write config file"
    })?;
    Ok(config.clone())
}

pub fn load_config() -> Result<ModManagerConfig, Box<dyn std::error::Error>> {
    let mut config_path = PathBuf::new();
    let mut cache_path = PathBuf::new();
    if let Some(proj_dirs) = ProjectDirs::from("", "sdmm", "sdmm") {
        config_path = proj_dirs.config_dir().to_path_buf().join("config.json");
        std::fs::create_dir_all(proj_dirs.config_dir().to_path_buf()).map_err(|_| {
            log::error!("Could not create config dir");
            "Could not create config dir"
        })?;
        log::info!(
            "{}",
            format!("Config located at {:?}", config_path.to_string_lossy())
        );
        cache_path = proj_dirs.cache_dir().to_path_buf();
        log::info!(
            "{}",
            format!("Cache dir located at {:?}", cache_path.to_string_lossy())
        );
        if cache_path.exists() {
            std::fs::remove_dir_all(&cache_path).map_err(|_| {
                log::error!("Could not remove cache dir");
                "Could not remove cache dir"
            })?;
        }
        std::fs::create_dir_all(&cache_path).map_err(|_| {
            log::error!("Could not create cache dir");
            "Could not create cache dir"
        })?;
    }
    if !config_path.exists() {
        log::warn!("Config does not exist, creating default config");
        let default_config = ModManagerConfig::default();
        save_config(&ConfigState {
            config_path,
            cache_path,
            config: Mutex::new(default_config.clone()),
        })?;
        return Ok(default_config);
    }
    let contents = std::fs::read_to_string(&config_path).map_err(|_| {
        log::error!("Could not read config file");
        "Could not read config file"
    })?;
    let config = serde_json::from_str::<ModManagerConfig>(&contents).map_err(|_| {
        log::error!("Could not parse config file");
        "Could not parse config file"
    })?;
    Ok(config)
}
