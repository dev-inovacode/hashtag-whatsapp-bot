const WhatsappWeb = require('@adiwajshing/baileys');
const { WAConnection, MessageType, Presence, ReconnectMode } = WhatsappWeb;
const conn = new WAConnection()
var authInfo
try{
  authInfo = require('../auth_info.json')
}catch{
  authInfo = {}
}
const dbConnection = require('../connections/mongooseConnection');
const questionsSchema = require('./models/questionsSchema');
const tagsSchema = require('./models/tagsSchema');
const fs = require('fs');
const moment = require('moment');

moment.locale('pt-br');
const hour = moment().format('LT');
const date = moment().format('L');
const loaded = true

module.exports = handleAll = async () => {
  try{
    console.log('relog')
    conn.loadAuthInfo(authInfo); //depois da primeira
    await conn.connect().catch(async () => {
      console.log('relog catch')
      conn.clearAuthInfo(authInfo)
      await conn.connect()
      const authInfoSave = conn.base64EncodedAuthInfo()
      fs.existsSync('./auth_info.json');
      fs.writeFileSync('./auth_info.json', JSON.stringify(authInfoSave, null, '\t'))
    })
  }catch {
    console.log('novo')
    await conn.connect();
    const authInfoSave = conn.base64EncodedAuthInfo()
    fs.existsSync('./auth_info.json');
    fs.writeFileSync('./auth_info.json', JSON.stringify(authInfoSave, null, '\t'));
  }

  conn.autoReconnect = ReconnectMode.onConnectionLost;
  conn.connectOptions.timeoutMs = 60 * 1000;
  conn.connectOptions.maxRetries = 10;
  await dbConnection();

  conn.on('message-new', async (m) => {
    if (m.key.fromMe) {
      return false;
    }
    const sender = m.participant.split('@')[0];
    console.log(sender);
    const preGroup = m.key.remoteJid.split('@')[0];
    const group = preGroup.split('-')[1];
    const messageContent = m.message;
    if (!messageContent) return;
    const messageType = Object.keys(messageContent)[0];

    const readChat = async () => {
      await conn.chatRead(m.key.remoteJid);
      await conn.updatePresence(m.key.remoteJid, Presence.updatePresence);
    };

    try {
      readChat();
      if (messageType !== MessageType.text) return false;
      else {
        var text = m.message.conversation;
        var mKey = m.key.remoteJid;
      }
    } catch (err) {
      if (err) throw err;
    }

    const findTags = await tagsSchema.find();
    const amap = findTags.map((n) => {
      return n.tags;
    });
    const hashTag = text.split(' ')[0].toUpperCase();

    if (amap.includes(hashTag)) {
      questionsSchema.create({
        number: sender,
        question: text
          .split(' ')
          .reduce((prev, next) => {
            if (next.toUpperCase() === hashTag) return prev;
            return `${prev}${next} `;
          }, '')
          .trim(),
        group: group,
        date: date,
        hour: hour,
        type: `${hashTag.replace('#', '')}`,
      });
      return;
    }
    readChat();
  });
};
