# Simple Deadlock Mod Manager

A lightweight mod manager for **Deadlock**.

## Features

- [x] Load `.vpk` mod files
- [x] Assign custom names to mods
- [x] Automatic **Deadlock** path detection
- [x] Automatically fixes/updates `gameinfo.gi` to keep it valid
- [x] Enable and disable mods easily
- [x] Deleting mods
- [x] Drag and drop
- [ ] Load `.vpk` files directly from `.zip` or `.rar` archives
- [ ] Download mods directly from **GameBanana**


## Not Planned

- Automatic mod updates (Please see [Deadlock Mod Loader](https://github.com/Tylevo/DeadlockModManager) or [Deadlock Mod Manager](https://github.com/deadlock-mod-manager/deadlock-mod-manager) if you want your mods to update automatically)

## Usage

- Open the options menu to set the path to your deadlock installation.
- Make sure the gameinfo.gi file is valid.
- Use the **Add Mod** button in the top right or drag and drop the file anywhere in the window.
- (Optional) Double-click the names to change them
- Select the mods you wish to load and use the `>>` button to load them and the `<<` button to unload them
- Click **Apply**

**Attention: Almost everytime deadlock is updated, the gameinfo.gi file becomes invalid, make sure to validate it and make it valid if needed**

This app is still early in development and while it should not mess anything up, I would recommend backing up your mods every so often. <br>
If deadlock fails to start due to a corrupt gameinfo.gi file simply verify the integrity of the game files through steam. (Make sure to revalidate the file if you want mods to load)<br>
If the mod manager fails to start, try deleting the config file located at `$HOME/.config/sddm/config.json`



## Platform Support

- **Linux:** Tested
- **Windows:** Not tested, but should work.

## Tech stack
- ![Tauri](https://img.shields.io/badge/Tauri-000000?logo=tauri)
- ![Rust](https://img.shields.io/badge/Rust-000000?logo=rust)
- ![React](https://img.shields.io/badge/React-000000?logo=react)
- ![Vite](https://img.shields.io/badge/Vite-000000?logo=vite)
- ![Tailwind](https://img.shields.io/badge/Tailwind-000000?logo=tailwindcss)
- ![Mui](https://img.shields.io/badge/MaterialUI-000000?logo=mui)
- ![Zustand](https://img.shields.io/badge/Zustand-000000)


## Building from source
Please see https://v2.tauri.app/start/prerequisites/

You might need to set `NO_STRIP=TRUE` if you're building an AppImage.
```shell
git clone https://github.com/Gabri3445/simple-deadlock-mod-manager.git # Clone the repo
cd simple-deadlock-mod-manager
pnpm i # Install packages
cd src-tauri
cargo install tauri-typegen
cargo tauri-typegen generate # generate types
cd ..
pnpm tauri build
```
