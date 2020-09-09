const { Client, Util } = require("discord.js");
const { TOKEN, PREFIX } = require("./config");

const client = new Client({ disableEveryone: true });

client.on("warn", console.warn);
client.on("error", console.error);

client.on("ready", () => {
  console.log("READY")
  client.user.setActivity("Not doing much...", {type: "WATCHING"})
});

client.on("disconnect", () => console.log("DISCONNECTED"));
client.on("reconnecting", () => console.log("RECONNECTING"));

client.on("guildMemberAdd", member => {
    let channel = member.guild.channels.cache.find(ch => ch.name === 
        "new-members");
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);
});

client.on("message", async msg => { 
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    switch (command) {
        case "ping":
            msg.channel.send("Pong");
            break;
        case "avatar":
            msg.reply(msg.author.displayAvatarURL());
            break;
    }
});

client.login(TOKEN);