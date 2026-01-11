mod message;

use crate::message::ServerMessage;
use tokio::sync::{mpsc, watch};
use tokio_tungstenite::connect_async;
use futures_util::{StreamExt, SinkExt};
use serde_json;
use chrono::Local;
use cursive::{
    align::HAlign,
    event::Key,
    theme::{BorderStyle, Palette, Theme, Color, PaletteColor, ColorStyle},
    traits::*,
    views::{Dialog, EditView, ScrollView, TextView, LinearLayout, Panel},
    Cursive, CursiveExt,
};
use cursive::utils::markup::StyledString;

#[tokio::main]
async fn main() {
    let mut siv = Cursive::default();
    siv.set_theme(create_tui_theme());

    show_login_dialog(&mut siv);

    siv.run();
}


fn show_login_dialog(siv: &mut Cursive) {
    siv.add_layer(
        Dialog::new()
            .title("Login to Chat")
            .padding_lrtb(1, 1, 1, 0)
            .content(
                LinearLayout::vertical()
                    .child(TextView::new("Enter username:"))
                    .child(
                        EditView::new()
                            .content("Anonymous")
                            .with_name("username")
                            .fixed_width(20),
                    )
                    .child(TextView::new("Enter channel:"))
                    .child(
                        EditView::new()
                            .content("general")
                            .with_name("channel")
                            .fixed_width(20),
                    ),
            )
            .button("Connect", |s| {
                let username = s
                    .call_on_name("username", |v: &mut EditView| v.get_content())
                    .unwrap()
                    .to_string();

                let channel = s
                    .call_on_name("channel", |v: &mut EditView| v.get_content())
                    .unwrap()
                    .to_string();

                if username.is_empty() || channel.is_empty() {
                    s.add_layer(Dialog::info("Username and channel cannot be empty!"));
                    return;
                }

                s.pop_layer();
                start_chat(s, username, channel);
            }),
    );
}

fn start_chat(siv: &mut Cursive, username: String, channel: String) {
    let url = format!("ws://localhost:8080/ws?username={}&channel={}", username, channel);

    let (in_tx, mut in_rx) = mpsc::unbounded_channel::<ServerMessage>();
    let (out_tx, mut out_rx) = mpsc::unbounded_channel::<String>();
    let (shutdown_tx, shutdown_rx) = watch::channel(false);
    
    siv.set_user_data((shutdown_tx, out_tx));

    // Spawn WebSocket task
    let mut shutdown_rx_ws = shutdown_rx.clone();
    let in_tx_ws = in_tx.clone();

    tokio::spawn(async move {
        let (ws_stream, _) = connect_async(url).await.expect("WebSocket failed");
        let (mut write, mut read) = ws_stream.split();

        loop {
            tokio::select! {
                _ = shutdown_rx_ws.changed() => {
                    break;
                }

                Some(text) = out_rx.recv() => {
                    let payload = serde_json::json!({
                        "type": "message",
                        "content": text
                    });

                    let _ = write.send(
                        tokio_tungstenite::tungstenite::Message::Text(payload.to_string())
                    ).await;
                }

                msg = read.next() => {
                    match msg {
                        Some(Ok(msg)) if msg.is_text() => {
                            if let Ok(parsed) =
                                serde_json::from_str::<ServerMessage>(msg.to_text().unwrap())
                            {
                                let _ = in_tx_ws.send(parsed);
                            }
                        }
                        _ => break,
                    }
                }
            }
        }
    });

    // Chat Header
    let header = TextView::new("KABAW CHAT")
        .style(Color::Rgb(255, 255, 255))
        .h_align(HAlign::Center);

    // Message area
    let messages = TextView::new("").with_name("messages");
    let messages_scroll = ScrollView::new(messages)
        .scroll_strategy(cursive::view::ScrollStrategy::StickToBottom)
        .full_width();

    // Input area
    let input = EditView::new()
        .on_submit(|s, text| send_message(s, text.to_string()))
        .with_name("input")
        .full_width();

    // Help text
    let help_text = TextView::new("ESC:quit | Enter:send | Commands: /help, /clear, /logout, /quit")
        .style(Color::Rgb(255, 255, 255));

    let layout = LinearLayout::vertical()
        .child(Panel::new(header))
        .child(Dialog::around(messages_scroll).title("Messages"))
        .child(Dialog::around(input).title("Message"))
        .child(Panel::new(help_text));

    siv.add_fullscreen_layer(layout);

    // Global callbacks
    siv.add_global_callback(Key::Esc, |s| s.quit());
    siv.add_global_callback('/', |s| {
        s.call_on_name("input", |view: &mut EditView| {
            view.set_content("/");
        });
    });

    // UI receive task
    let cb_sink = siv.cb_sink().clone();
    let mut shutdown_rx_ui = shutdown_rx.clone();
    let username_clone = username.clone();

    tokio::spawn(async move {
        loop {
            tokio::select! {
                _ = shutdown_rx_ui.changed() => break,

                msg = in_rx.recv() => {
                    if let Some(msg) = msg {
                        let cb = cb_sink.clone();
                        let username = username_clone.clone();

                        let _ = cb.send(Box::new(move |s: &mut Cursive| {
                            s.call_on_name("messages", |view: &mut TextView| {
                                let mut content = StyledString::new();
                                
                                match msg.r#type.as_str() {
                                    "user_connected" => {
                                        let channel = msg.channel.clone().unwrap_or("General".into());
                                        if let Some(user_id) = &msg.user_id {
                                            content.append_styled(
                                                format!("[SYSTEM] Connected as {} to {} channel\n", username, channel),
                                                ColorStyle::title_primary(),
                                            );
                                            content.append_styled(
                                                format!("[SYSTEM] Your assigned user ID: {}\n", user_id),
                                                ColorStyle::title_primary(),
                                            );
                                        }
                                    }
                                    "system" => {
                                        content.append_styled(
                                            format!("[SYSTEM] {}\n", msg.content),
                                            ColorStyle::secondary(),
                                        );
                                    }
                                    "message" => {
                                        let user = msg.username.clone().unwrap_or("Anon".into());
                                        let ts = msg.timestamp.clone().unwrap_or_else(|| {
                                            Local::now().format("%H:%M:%S").to_string()
                                        });

                                        if user == username {
                                            content.append_plain(format!("You [{}] > {}\n", ts, msg.content));
                                        } else {
                                            content.append_styled(
                                                format!("{} [{}] > {}\n", user, ts, msg.content),
                                                ColorStyle::secondary(),
                                            );
                                        }
                                    }
                                    _ => {
                                        content.append_styled(
                                            format!("[UNKNOWN] {}\n", msg.content),
                                            ColorStyle::secondary(),
                                        );
                                    }
                                }
                                // Append the StyledString
                                view.append(content);

                            });
                        }));
                    } else {
                        break;
                    }
                }
            }
        }
    });
}

fn send_message(siv: &mut Cursive, msg: String) {
    if msg.is_empty() {
        return;
    }

    match msg.as_str() {
        "/help" => {
            siv.call_on_name("messages", |view: &mut TextView| {
                view.append(
                    "\n=== Commands ===\n/help - Show this help\n/clear - Clear messages\n/logout - Logout chat\n/quit - Exit chat\n\n",
                );
            });
        }
        "/clear" => {
            siv.call_on_name("messages", |view: &mut TextView| {
                view.set_content("");
            });
        }
        "/logout" => {
            siv.with_user_data(
                |data: &mut (watch::Sender<bool>, mpsc::UnboundedSender<String>)| {
                    let _ = data.0.send(true);
                },
            );

            while siv.pop_layer().is_some() {}
            show_login_dialog(siv);
            return;
        }
        "/quit" => {
            siv.quit();
        }
        _ => {
            siv.with_user_data(
                |data: &mut (watch::Sender<bool>, mpsc::UnboundedSender<String>)| {
                    let _ = data.1.send(msg.clone());
                },
            );
        }
    }

    siv.call_on_name("input", |view: &mut EditView| {
        view.set_content("");
    });
}

fn create_tui_theme() -> Theme {
    let mut theme = Theme::default();
    theme.shadow = true;
    theme.borders = BorderStyle::Simple;

    let mut palette = Palette::default();
    
    // Backgrounds
    palette[PaletteColor::Background] = Color::Rgb(5, 15, 30);
    palette[PaletteColor::View] = Color::Rgb(20, 20, 60);

    // Text colors
    palette[PaletteColor::Primary] = Color::Rgb(0, 255, 0);
    palette[PaletteColor::TitlePrimary] = Color::Rgb(255, 200, 0);
    palette[PaletteColor::Secondary] = Color::Rgb(0, 255, 255);
    palette[PaletteColor::Highlight] = Color::Rgb(0, 255, 255);
    palette[PaletteColor::HighlightInactive] = Color::Rgb(128, 128, 128);
    palette[PaletteColor::Shadow] = Color::Rgb(0, 0, 0);
    
    theme.palette = palette;
    theme
}
