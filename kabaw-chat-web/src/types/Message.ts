export interface ServerMessage {
  type: 'message' | 'system' | 'user_connected';
  username?: string;
  user_id?: string;
  content?: string;
  timestamp?: string;
  channel?: string;
}
