# Valorant store checker - Discord Bot
Discord bot that shows valorant your daily store by using the Ingame API.
written using Python and the [Pycord](https://github.com/Pycord-Development/pycord) library <br>

Tutorial : [Youtube](https://youtu.be/gYjzEuJh3Ms)

## Screenshot

![image](https://i.imgur.com/gj5usTI.gif)
![image](https://i.imgur.com/gkAKFZW.png)

## Usage

| Command                       | Action                                                                                                     |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `store`  | Shows my daily store |

## Prerequisites

* [NodeJS 14+](https://nodejs.org/en/)
* [Git](https://git-scm.com/download)

## Installations

* Install requirements
```
npm install
```
* Edit token, clientid at index.ts file
```
* Run the bot
```
npm run build

-using nodemon -> nodemon index.js
-using pm2 -> pm2 start index.js --name valorantbot
```

## Special thanks

### [Valorant Client API](https://github.com/RumbleMike/ValorantClientAPI) by [RumbleMike](https://github.com/RumbleMike)
for providing a great API about Valorant!

### [Valorant-API.com](https://valorant-api.com/)
for every skin names and images!