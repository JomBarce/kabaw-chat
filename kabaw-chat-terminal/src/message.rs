use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServerMessage {
    pub r#type: String,
    pub username: Option<String>,
    pub user_id: Option<String>,
    pub content: String,
    pub timestamp: Option<String>,
    pub channel: Option<String>,
}
