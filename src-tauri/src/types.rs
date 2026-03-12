use serde::{Deserialize, Serialize};

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

#[derive(Deserialize, Serialize)]
pub enum Operation {
    LoadMods,
    UnloadMods,
}
