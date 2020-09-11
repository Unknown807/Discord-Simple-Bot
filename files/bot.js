const ds = require("discord.js");
const fs = require("fs");
const { TOKEN, PREFIX } = require("./config");

const client = new ds.Client({ disableEveryone: true });

client.on("warn", console.warn);
client.on("error", console.error);

client.on("ready", () => {
  console.log("READY")
  client.user.setActivity("Time Fly...", {type: "WATCHING"})
});

client.on("disconnect", () => console.log("DISCONNECTED"));
client.on("reconnecting", () => console.log("RECONNECTING"));

client.on("guildMemberAdd", member => {
    let channel = member.guild.channels.cache.find(ch => ch.name === 
        "new-members");
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);
});

client.on("guildMemberRemove", member => {
    console.log(`${member.tag} has left the guild`)
})

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
	if (!msg.content.startsWith(PREFIX)) {
        fs.readFile("userdata.json", (err, data) => {
            if (err) {
                console.log("ERROR READING FILE, FILE WILL BE CREATED");
                let emptydata = JSON.stringify({});
                fs.writeFile("userdata.json", emptydata, (err, _) => {
                    if (err) console.log("ERROR", err);
                });
                return undefined;
            }
            let userdata = JSON.parse(data);
            let user = msg.author.id;
            console.log(userdata);
            if (userdata.hasOwnProperty(user)) {
                console.log("User Exists");
                let currentlevel = userdata[user]["level"];
                let currentexp = userdata[user]["exp"];
                let currentmax = userdata[user]["max"];
                if (currentexp+5 == currentmax) {
                    userdata[user] = {"level":currentlevel+1,
                            "exp":0, "max":currentmax*2};
                    msg.reply(`Well done! You are now level ${currentlevel+1}`);
                } else {
                    userdata[user]["exp"] += 5;
                }
            } else {
                console.log("User Doesn't Exist");
                userdata[user] = {"level":0, "exp":5, "max":100};
            }
            let newdata = JSON.stringify(userdata);
            fs.writeFile("userdata.json", newdata, (err, _) => {
                if (err) console.log("ERROR", err); 
            });
            console.log(newdata);
        });
        return undefined;
    }

	let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    switch (command) {
        case "avatar":
            msg.reply(msg.author.displayAvatarURL());
            break;
        case "mylevel":
            fs.readFile("userdata.json", (err, data) => {
                if (err){
                    console.log("ERROR", err);
                } else {
                    let userlevel = JSON.parse(data)[msg.author.id]["level"];
                    msg.reply(`You are level ${userlevel}`);
                }
            });
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