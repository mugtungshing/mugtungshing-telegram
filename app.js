const { Telegraf } = require('telegraf')
const fs = require('fs')
require('dotenv')

const bot = new Telegraf(process.env.BOT_TOKEN )

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.launch()

bot.telegram.setWebhook(`https://${process.env.BOT_DOMAIN}/${process.env.BOT_PATH}`, {})

// Http webhook, for nginx/heroku users.
bot.startWebhook(`/${process.env.BOT_PATH}`, null, 8000)