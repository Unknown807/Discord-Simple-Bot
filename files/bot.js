const { Client, Util, MessageEmbed } = require("discord.js");
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

function kickOrBan(msg, option) {
    let mentioned_user = msg.mentions.users.first();
    if (mentioned_user) {
        let member = msg.guild.member(mentioned_user);
        if (member) {
            return member;
        } else {
            msg.reply("That user isn't in the guild");
        }
    } else {
        msg.reply(`You didn't mention the user to ${option}`);
    }
    return false;
}

client.on("message", async msg => { 
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    switch (command) {
        case "avatar":
            msg.reply(msg.author.displayAvatarURL());
            break;
        case "kick":
            let kickmember = kickOrBan(msg, "kick");
            if (!kickmember) return undefined;
            kickmember
                .kick("Reason: Being Bad")
                .then(() => {
                    msg.reply("Successfully kicked user");
                })
                .catch(err => {
                    msg.reply("Unable to kick the user");
                    console.error(err);
                });
            break;
        case "ban":
            let banmember = kickOrBan(msg, "ban");
            if (!banmember) return undefined;
            banmember
                .ban({reason:"They were bad",})
                .then(() => {
                    msg.reply("Successfully banned user");
                })
                .catch(err => {
                    msg.reply("Unable to ban the user");
                    console.error(err);
                });
            break;
        case "embed":
            let embed = new MessageEmbed()
                .setTitle("Embed Title")
                .setColor(0xff0000)
                .setDescription("Embed Description Here...");
            msg.channel.send(embed);
            break;
    }
});

client.login(TOKEN);