const lunarcal = require('lunar-calendar')
const seedrandom = require('seedrandom')

module.exports = async (userid, nickname) => {
  // Error catch
  if (!userid || userid === '') {
    throw {
      code: 400,
      info: '你需要提供某个用户 ID，作为黄历随机数种子。'
    }
  }
  if (!nickname || nickname === '') {
    throw {
      code: 400,
      info: '你需要提供用户的暱称。'
    }
  }

  // Generate result dict
  let result = {}

  // Calculate date (including lunar calendar)
  let timezone = 8
  let offset_GMT = new Date().getTimezoneOffset()
  let nowDate = new Date().getTime()
  let today = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000)
  let luncRes = lunarcal.solarToLunar(today.getFullYear(), today.getMonth() + 1, today.getDate())
  let year = today.getFullYear()
  result.date = {
    year,
    month: today.getMonth() + 1,
    date: today.getDate(),
    luncRes: `${luncRes.GanZhiYear}年${luncRes.lunarMonthName === '十二月' ? '腊月' : luncRes.lunarMonthName}${luncRes.lunarDayName}`
  }

  // Import dicts
  const tsdict = require('./dict.json')
  let directions = ["东", "东南", "南", "西南", "西", "西北", "北", "东北"]
  let slots = ["P1", "P2"]
  /* if (today.getMonth() === 3 && today.getDate() === 1) { // Happy April Fools' Day!
    words = require('./words-aprilfoolsday.json');
    directions = ["头朝下"];
    slots = ["维修位"];
  } */

  // Combine seeds
  let seed = `${userid}${today.getFullYear()}${today.getMonth()}${today.getDate()}`

  // Calculate tungshing result
  let goodorbadRandom = [parseInt(seedrandom(`${seed}1`)() * tsdict.goodorbaddict.length), 0]
  goodorbadRandom[1] = goodorbadRandom[0] + parseInt(seedrandom(`${seed}2`)() * (tsdict.goodorbaddict.length - 2)) + 1
  if (goodorbadRandom[1] >= tsdict.goodorbaddict.length) goodorbadRandom[1] = goodorbadRandom[1] - tsdict.goodorbaddict.length
  // console.log(goodorbadRandom, parseInt(seedrandom(`${seed}2`)() * (tsdict.goodorbaddict.length - 1)));
  let reason = [
    parseInt(seedrandom(`${seed}1a`)() * tsdict.goodorbaddict[goodorbadRandom[0]].reasonforgood.length),
    parseInt(seedrandom(`${seed}2a`)() * tsdict.goodorbaddict[goodorbadRandom[1]].reasonforbad.length)
  ]
  result.ts = {
    good: {
      name: tsdict.goodorbaddict[goodorbadRandom[0]].action,
      reason: tsdict.goodorbaddict[goodorbadRandom[0]].reasonforgood[reason[0]]
    },
    bad: {
      name: tsdict.goodorbaddict[goodorbadRandom[1]].action,
      reason: tsdict.goodorbaddict[goodorbadRandom[1]].reasonforbad[reason[1]]
    }
  }

  // Calculate recommandations
  let mugofthedayRandom = parseInt(seedrandom(`${seed}3`)() * tsdict.mugoftheday.length)
  let directionRandom = parseInt(seedrandom(`${seed}4`)() * directions.length)
  let slotRandom = parseInt(seedrandom(`${seed}5`)() * slots.length)
  result.recommandations = {
    mugoftheday: tsdict.mugoftheday[mugofthedayRandom],
    direction: directions[directionRandom],
    slot: slots[slotRandom]
  }

  let message = ''
      message += `今天是 ${result.date.year} 年 ${result.date.month} 月 ${result.date.date} 日\n`
      message += `农历${result.date.luncRes}\n\n`
      
      message += `黄历姬掐指一算，${nickname} 今天：\n`
      message += `宜${result.ts.good.name}：${result.ts.good.reason}\n`
      message += `忌${result.ts.bad.name}：${result.ts.bad.reason}\n\n`

      message += `黄历姬为 ${nickname} 推荐：\n`
      message += `今日音游：${result.recommandations.mugoftheday}\n`
      message += `打手机或平板音游最佳朝向：${result.recommandations.direction}\n`
      message += `街机音游黄金位：${result.recommandations.slot}`

  return message
}