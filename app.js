const { Telegraf } = require('telegraf')
// const fs = require('fs')
require('dotenv')
const func = require('./func')

const bot = new Telegraf(process.env.BOT_TOKEN )

bot.command('today', async (ctx) => {
  if (ctx.update.message.chat.type !== 'private') return ctx.reply('请在私聊中使用该 bot。')
  try {
    ctx.reply(await func.get(ctx.update.message.chat.id, '您'))
  } catch (e) {
    ctx.reply('出现了一些错误……')
  }
})

bot.launch()

bot.telegram.setWebhook(`https://${process.env.BOT_DOMAIN}/${process.env.BOT_PATH}`, {})

// Http webhook, for nginx/heroku users.
bot.startWebhook(`/${process.env.BOT_PATH}`, null, 8000)