const Discord = require("discord.js")

module.exports = async (bot, message) => {
    if(message.channel.id !== "702621363201900624") return;
    let hook = new Discord.WebhookClient("703077206271852615", "fObzB6J-qhAsAzrkEjk0NbqWGNZx-_tVh-9y3z-xDXdbEj9IG3T9R-AaiFz9LjHr_kG9")

    let content = message.content
    bot.config.badWords.forEach(word => {
        let censor = []
        while(censor.length !== word.length) {
            censor.push("\\*")
        }
        content = content.split(word).join(censor)
    })

    await hook.edit(message.member.nickname || message.author.username, message.author.displayAvatarURL)
    await hook.send(content)
    await hook.edit("CHAT WEBHOOK", message.guild.iconURL)

    message.delete()
}