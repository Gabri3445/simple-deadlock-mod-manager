use serde::{Deserialize, Serialize};

#[derive(Default, Deserialize, Serialize)]
pub struct ModManagerConfig {
    deadlock_path: String,
}
