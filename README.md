
# Valorant store checker - Discord Bot

Discord bot that shows your daily Valorant store by using the ingame API.

Written in Typescript, run on NodeJS

Based on original Python version by [staciax](https://github.com/staciax/Valorant-store-checker-discord-bot)

  

# The Difference Between This and StaciaX version

- Use `NodeJS` instead of `Python3`

- Have ability to dynamically add user to looping list (which reset if the bot restart or server restart)

- Skin image aspect ratio is original (no stretching)

- Used Valorant fonts for the final image

- Not saving any user data

- Still unfinished, have some bugs, bad error handling (ha)

  

## Screenshot

![image](https://i.imgur.com/gkAKFZW.png)

  

## Usage

| Command | Parameter | Action |

| :------------------- | :--------------------------- | :--------------------------- |

| `/store` | `username`, `password` | Shows my daily store (Based on staciax version) |

| `/valoloop` | `username`, `password` | Shows my daily store, also add the user to looping list |

| `/valolist` | | Shows users in the looping list |

| `/valoshop` | `username` | Shows my daily store, only username required, work only if user already use /valoloop function |

  

## Prerequisites

*  [NodeJS 14+ ( with NPM )](https://nodejs.org/en/)

  

## Installations

### 1) Install dependencies

- Open terminal in the repository path

- run the command `npm install`

### 2) Edit the config in

- go to `index.ts` file and edit the config at the top

### 3) Compile the project

- Open terminal in the repository path

- run the command `npm run build`

### 4) Run the Bot

- if using NodeJS -> `node src/index.js`

- if using [Nodemon](https://www.npmjs.com/package/nodemon) -> `nodemon src/index.js`

- if using [PM2](https://pm2.keymetrics.io/) -> `pm2 start src/index.js --name valorantbot`

  

## Special thanks

### [Valorant Client API](https://github.com/RumbleMike/ValorantClientAPI) by [RumbleMike](https://github.com/RumbleMike)

For providing a great API about Valorant!

### [Valorant-API.com](https://valorant-api.com/)

For every skin names and images!

### [Valorant Font](https://www.dafont.com/valorant.font)

For a very cool font