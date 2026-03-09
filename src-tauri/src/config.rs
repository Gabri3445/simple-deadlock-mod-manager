use serde::{Deserialize, Serialize};
use std::env::home_dir;
use std::path::PathBuf;
use std::sync::Mutex;

pub const CONFIG_PATH: &str = ".config/dmm/config.json";

#[derive(Default, Deserialize, Serialize, Clone)]
pub struct ModManagerConfig {
    pub deadlock_path: String,
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
    //add versioning
    let path = home_dir()
        .ok_or("Unable to locate home directory")?
        .join(CONFIG_PATH);
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
