const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
/* create client and require packages */

const config = require("./config.json");
bot.config = config
bot.prefix = config.prefix;
/* set config data */

bot.data = {
  cities: require("./data/cities.json"),
  images: require("./data/images.json"),
  weapons: require("./data/weapons.json")
};

bot.commands = new Discord.Collection();
bot.commandDescriptions = new Object();
bot.commandUsages = new Object();
bot.commandTypes = new Object();
bot.commandAliases = [];
bot.commandRequirements = new Object();
/* create command data objects */

fs.readdir("./cmds/", (err, files) => {
  if (err) throw err;

  let jsFiles = files.filter(f => f.split(".").pop() === "js");

  jsFiles.forEach(f => {
    let props = require(`./cmds/${f}`);
    bot.commands.set(props.help.name, props);
    bot.commandDescriptions[props.help.name] = props.help.description;
    bot.commandUsages[props.help.name] =
      "`" + bot.prefix + props.help.usage + "`";
    bot.commandTypes[props.help.name] = props.help.type;
    if (props.help.commandAliases.length >= 1)
      bot.commandAliases.push({
        for: props.help.name,
        aliases: props.help.commandAliases
      });
  });
  console.log(`Loaded ${jsFiles.length} commands!`);
});

bot.on("ready", () => {
  console.log(`Bot ${bot.user.username} is on!`);
  bot.user.setActivity(bot.guilds.size + " servers. | " + bot.prefix + "help", {
    type: "WATCHING"
  });
  bot.user.setStatus("online", null);

  bot.channels
    .get("702710258333909062")
    .fetchMessage("702711172801232937")
    .then(msg => {
    if(msg.embeds[0].image.url == bot.data.images.MapWithLabels.src + "#v" + bot.data.images.MapWithLabels.ver) return;
    
      let embedContent = new Discord.RichEmbed();
      embedContent.setTitle("Server Map");
      embedContent.setImage(bot.data.images.MapWithLabels.src + "#v" + bot.data.images.MapWithLabels.ver);
      embedContent.setFooter("Click on the map to zoom in.");
    embedContent.setColor(bot.config.themeColor)
      msg.edit("", { embed: embedContent });
    });
});

bot.on("message", message => {
  if (message.author.bot) return;
  /*  ignore bots */
  if (message.content.startsWith(bot.prefix)) {
    /* if starts with prefix (tcc ) */
    let args = message.content
      .substring(bot.prefix.length)
      .trim()
      .split(/ +/g);
    /* get args */

    let cmd = bot.commands.get(args[0].toLowerCase());
    /* fetch command */

    if (!cmd) {
      let name;
      /* declare name variable */

      bot.commandAliases.forEach(a => {
        if (a.aliases.includes(args[0].toLowerCase())) name = a.for;
        /* see if the command used is an alias of another one */
      });

      cmd = bot.commands.get(name);
      /* get the command using the name */
    }
    if (!cmd) message.channel.send("I couldn't find that command.");
    /* command not found message */

    cmd.run(bot, message, args);
    /* run the command */
  }
});

bot.login("NzAyNTMwODg1MTIzMDQ3NDQz.XqBaFg.M9VO6lrMp789bryZlLHiv9f4268");
