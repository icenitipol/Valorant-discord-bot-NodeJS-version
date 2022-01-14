# Valorant store checker - Discord Bot
Discord bot that shows your daily Valorant store by using the ingame API.
written using NodeJS<br>
Based on original python version by [staciax](https://github.com/staciax/Valorant-store-checker-discord-bot)

## Screenshot

![image](https://i.imgur.com/gj5usTI.gif)
![image](https://i.imgur.com/gkAKFZW.png)

## Usage

| Command                       | Action                                                                                                     |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `store`  | Shows my daily store |

## Prerequisites

* [NodeJS 14+](https://nodejs.org/en/)

## Installations

* Install dependencies
```
open terminal in the repository path
```
```
npm install
```
* Edit token, clientid at index.ts file
* Run the bot
```
npm run build
```
```
-using nodemon -> nodemon index.js
```
```
-using pm2 -> pm2 start index.js --name valorantbot
```

## Special thanks

### [Valorant Client API](https://github.com/RumbleMike/ValorantClientAPI) by [RumbleMike](https://github.com/RumbleMike)
for providing a great API about Valorant!

### [Valorant-API.com](https://valorant-api.com/)
for every skin names and images!

### [Valorant Font](https://www.dafont.com/valorant.font)
for a very cool font