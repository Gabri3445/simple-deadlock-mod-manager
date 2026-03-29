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
    let config = config_state
        .config
        .lock()
        .map_err(|_| "couldn't acquire config lock")?;
    if let Some(parent) = config_state.config_path.parent() {
        std::fs::create_dir_all(parent)?;
    }
    let json = serde_json::to_string_pretty(&*config)?;
    std::fs::write(&config_state.config_path, json)?;
    Ok(config.clone())
}

pub fn load_config() -> Result<ModManagerConfig, Box<dyn std::error::Error>> {
    let mut config_path = PathBuf::new();
    let mut cache_path = PathBuf::new();
    if let Some(proj_dirs) = ProjectDirs::from("", "sdmm", "sdmm") {
        config_path = proj_dirs.config_dir().to_path_buf().join("config.json");
        std::fs::create_dir_all(proj_dirs.config_dir().to_path_buf())?;
        cache_path = proj_dirs.cache_dir().to_path_buf();
        std::fs::remove_dir_all(&cache_path)?;
        std::fs::create_dir_all(&cache_path)?;
    }
    if !config_path.exists() {
        let default_config = ModManagerConfig::default();
        save_config(&ConfigState {
            config_path,
            cache_path,
            config: Mutex::new(default_config.clone()),
        })?;
        return Ok(default_config);
    }
    let contents = std::fs::read_to_string(&config_path)?;
    let config = serde_json::from_str::<ModManagerConfig>(&contents)?;
    Ok(config)
}
