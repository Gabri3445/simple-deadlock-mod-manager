use serde::{Deserialize, Serialize};

#[derive(Default, Deserialize, Serialize)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct ModManagerConfig {
    deadlock_path: String,
}
