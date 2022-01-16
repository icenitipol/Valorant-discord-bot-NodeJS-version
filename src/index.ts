import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'
import { Client, Intents, MessageEmbed } from 'discord.js'
import { getOfferMessage } from './valorant'
import { commands } from './commands'

/*+---------------------+
--- TYPES
+---------------------+*/
type userData = {
	user: string,
	pass: string,
	request: string,
	request_icon: string
}; // types for 7AM loop data (reset if restart server/ *not storing user data to the server for a safety reason)

/*+---------------------+
--- CONFIG
+---------------------+*/
const bot_token = "" //token from discord bot dev.
const client_id = "" //client id from discord dev.
const server_id = "" //discord server/guild id
const channel_id = "" //channel id for the bot to send info automatically daily //required for the looping function to work properly

/*+---------------------+
--- INITIALIZE
+---------------------+*/
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: '9' }).setToken(bot_token);

let userloop: userData[] = [];
let thisDayRunAlready = false

console.log('Started refreshing application (/) commands.');
rest.put(Routes.applicationGuildCommands(client_id, server_id), { body: commands },).then(() => {
	console.log('Successfully reloaded application (/) commands.');
}).catch((err) => {
	console.log('Failed to reload application (/) commands.', err);
}) //update the server / command settings for this bot

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
}); //on ready function

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	/*+---------------------+
	--- Original /store Command from staciax
	+---------------------+*/
	if (interaction.commandName === 'store') {
		const username = interaction.options.get("username")?.value as string
		const password = interaction.options.get("password")?.value as string
		const request_user = interaction.user.username
		const request_user_profile_image = interaction.user.avatarURL() ?? undefined
		await interaction.deferReply();
		try {
			const msg = await getOfferMessage(username, password, request_user, request_user_profile_image)
			await interaction.editReply(msg);
		}
		catch (error) {
			console.log("ERROR", error)
			await interaction.editReply(`Error, เกิดข้อผิดพลาดในคำขอของ [${request_user}] ตรวจสอบรหัสผ่าน Riot Account หรือติดต่อผู้เขียนบอทนะจ๊ะ`);
		}
	}

	/*+---------------------+
	--- new /valoloop Command to assign user/pass to a looping list that automatically look up valorant shop every 7.30 AM (can be change)
	+---------------------+*/
	if (interaction.commandName === 'valoloop') {
		const username = interaction.options.get("username")?.value as string
		const password = interaction.options.get("password")?.value as string
		const request_user = interaction.user.username
		const request_user_profile_image = interaction.user.avatarURL() ?? undefined
		await interaction.deferReply();
		try {
			const msg = await getOfferMessage(username, password, request_user, request_user_profile_image)
			await interaction.editReply(msg);
			userloop.push({
				pass: password,
				user: username,
				request: request_user,
				request_icon: request_user_profile_image ?? "https://i.imgur.com/AfFp7pu.png"
			})
		}
		catch (error) {
			console.log("ERROR", error)
			await interaction.editReply(`Error, เกิดข้อผิดพลาดในคำขอของ [${request_user}] ตรวจสอบรหัสผ่าน Riot Account หรือติดต่อผู้เขียนบอทนะจ๊ะ`);
		}
	}

	/*+---------------------+
	--- new /valolist command to lookup registered user for looping everyday
	+---------------------+*/
	if (interaction.commandName === 'valolist') {
		const request_user = interaction.user.username
		const request_user_profile_image = interaction.user.avatarURL()
		const exampleEmbed = new MessageEmbed()
			.setColor('#fe676e')
			.setTitle('VALORANT STORE LOOPING LIST')
			.addField("LIST", JSON.stringify(userloop.map(e => e.user)))
			.addField("Today Sent", "" + thisDayRunAlready)
			.addField("Time", new Date().getHours() + ":" + new Date().getMinutes())
			.setTimestamp()
			.setFooter({ text: `Requested By ${request_user}`, iconURL: request_user_profile_image ?? 'https://i.imgur.com/AfFp7pu.png' });
		interaction.reply({ embeds: [exampleEmbed] })
	}

	/*+---------------------+
	--- new /valoshop to just require username, since server remembered password for that user in looping list (reset if server restart)
	+---------------------+*/
	if (interaction.commandName === 'valoshop') {
		const username = interaction.options.get("username")?.value as string
		const request_user = interaction.user.username
		const request_user_profile_image = interaction.user.avatarURL() ?? undefined
		let password = ""
		userloop.forEach(e => {
			if (e.user == username) password = e.pass
		})
		if (!password) return interaction.reply(`Error, ไม่พบชื่อผู้ใช้ในระบบ (ตรวจสอบด้วยคำสั่ง /valolist)`);
		await interaction.deferReply();
		try {
			const msg = await getOfferMessage(username, password, request_user, request_user_profile_image)
			await interaction.editReply(msg);
		}
		catch (error) {
			console.log("ERROR", error)
			await interaction.editReply(`Error, เกิดข้อผิดพลาดในคำขอของ [${request_user}] ตรวจสอบรหัสผ่าน Riot Account หรือติดต่อผู้เขียนบอทนะจ๊ะ`);
		}
	}
}); //command handler function

client.login(bot_token);

setInterval(() => {
	const hr = new Date().getHours()
	const mn = new Date().getMinutes()

	if (hr >= 7 && mn >= 30 && hr < 8) { //fetch data at 7:30AM
		if (!thisDayRunAlready) { 
			thisDayRunAlready = true; //change state so it only run once
			const channel: any = client.channels.cache.get(channel_id);
			userloop.forEach(async e => {
				try {
					const msg = await getOfferMessage(e.user, e.pass, e.request, e.request_icon)
					channel.send(msg);
				}
				catch (error) {
					console.log("ERROR", error)
					channel.send(`Error, เกิดข้อผิดพลาดในคำขอของ [${e.request}, ACC:${e.user}] กรุณาติดต่อเจ้งของบอท`);
				}
			})
		}
	}
	if (hr >= 12) { //reset the looping day after 12:00AM
		thisDayRunAlready = false;
	}
}, 10000) // everyday looping function

setInterval(() => {
	console.log("HR:", new Date().getHours(), "MN:", new Date().getMinutes(), "ThisDayRunStatus:", thisDayRunAlready)
}, 60000) // time logging / debug log