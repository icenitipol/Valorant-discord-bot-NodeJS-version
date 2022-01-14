import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'
import { Client, Intents, MessageAttachment, MessageEmbed } from 'discord.js'
import { auth, getOffer, getOfferImage } from './valorant'

/*
  CONFIG
*/
const bot_token = ""
const client_id = ""
const server_id = ""

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: '9' }).setToken(bot_token);

const commands = [
  {
    name: 'store',
    description: 'Get current Valorant store',
    options: [
      {
        type: 3,
        name: "username",
        description: "riot username",
        required: true
      },
      {
        type: 3,
        name: "password",
        description: "riot password",
        required: true
      }
    ]
  }
];

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(client_id, server_id), { body: commands },);
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'store') {
    const username = interaction.options.get("username")?.value as string
    const password = interaction.options.get("password")?.value as string
    const request_user = interaction.user.username
    // const request_user_nick = interaction.user.
    const request_user_profile_image = interaction.user.avatarURL()

    await interaction.deferReply();

    try {
      const riotAuthData = await auth(username, password)
      const offers = await getOffer(riotAuthData)
      const offerImage = await getOfferImage(offers)
      const file = new MessageAttachment(offerImage, "valorant_store.png");
      const exampleEmbed = new MessageEmbed()
      .setColor('#fe676e')
      .setTitle('VALORANT STORE')
      .setImage('attachment://valorant_store.png')
      .setTimestamp()
      .setFooter({ text: `Requested By ${request_user}`, iconURL: request_user_profile_image ?? 'https://i.imgur.com/AfFp7pu.png' });
      await interaction.editReply({embeds: [exampleEmbed], files: [file]});
    }
    catch (error) {
      console.log("ERROR", error)
      await interaction.editReply(`Error, เกิดข้อผิดพลาดในคำขอของ [${request_user}] ตรวจสอบรหัสผ่าน Riot Account หรือติดต่อผู้เขียนบอทนะจ๊ะ`);
    }
  }
});

client.login(bot_token);