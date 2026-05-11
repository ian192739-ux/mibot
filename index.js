const fs = require('fs');
const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// =======================
// 📁 DATABASE REAL (JSON)
// =======================
let db = {
    warns: {},
    xp: {},
    coins: {},
    history: {}
};

const DB_FILE = './db.json';

if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// =======================
// 🧠 EMBED GRANDE
// =======================
function emb(title, desc, color = 0x00ffcc) {
    return new EmbedBuilder()
        .setTitle(`🏢 ${title}`)
        .setDescription(desc)
        .setColor(color)
        .setFooter({ text: 'MARINE CORP FORCE • SYSTEM ACTIVE' });
}

// =======================
// 📡 FBI LOGS
// =======================
function log(guild, text) {
    const channel = guild.channels.cache.find(c => c.name === "logs");
    if (!channel) return;

    channel.send({
        embeds: [emb('FBI LOG', `${new Date().toLocaleString()}\n${text}`, 0x2b2d31)]
    });
}

// =======================
// 🧠 HISTORY
// =======================
function addHistory(id, action) {
    if (!db.history[id]) db.history[id] = [];
    db.history[id].push({
        action,
        date: new Date().toLocaleString()
    });
    saveDB();
}

// =======================
// ⚙️ PERMISOS
// =======================
const isMod = (m) =>
    m.roles.cache.some(r => r.name === "MOD") ||
    m.permissions.has(PermissionsBitField.Flags.ModerateMembers);

const isAdmin = (m) =>
    m.permissions.has(PermissionsBitField.Flags.Administrator);

// =======================
// 💰 XP SYSTEM
// =======================
client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return;

    const id = message.author.id;

    db.xp[id] = (db.xp[id] || 0) + 5;
    db.coins[id] = (db.coins[id] || 0) + 2;

    saveDB();
});

// =======================
// 📡 LOG EVENTS
// =======================
client.on(Events.MessageDelete, (m) => {
    if (!m.guild) return;
    log(m.guild, `🧾 DELETE | ${m.author?.tag}`);
});

client.on(Events.MessageUpdate, (o) => {
    if (!o.guild) return;
    log(o.guild, `✏️ EDIT | ${o.author?.tag}`);
});

client.on(Events.GuildMemberAdd, (m) => {
    log(m.guild, `➕ JOIN | ${m.user.tag}`);
});

client.on(Events.GuildMemberRemove, (m) => {
    log(m.guild, `➖ LEAVE | ${m.user.tag}`);
});

// =======================
// 🎛 SLASH COMMANDS
// =======================
client.on(Events.InteractionCreate, async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // =======================
    // HELP (PRO PANEL)
    // =======================
    if (commandName === 'help') {

        return interaction.reply({
            embeds: [
                emb(
                    'COMMAND PANEL',
                    `
👤 USUARIO:
/ping → ver bot
/superinfo → perfil

🛡️ MOD (solo rol MOD):
/warn user reason
/mute user time
/unmute user
/history user

👑 ADMIN:
/announce text
/dmall text

📌 USO:
Todos los comandos son slash (/)
Solo roles autorizados pueden usar MOD/ADMIN
                    `
                )
            ],
            ephemeral: true
        });
    }

    // =======================
    // PING
    // =======================
    if (commandName === 'ping') {
        return interaction.reply({
            embeds: [emb('PONG', '🏓 Bot activo')]
        });
    }

    // =======================
    // SUPERINFO
    // =======================
    if (commandName === 'superinfo') {

        const user = interaction.user;

        return interaction.reply({
            embeds: [
                emb(
                    'PERFIL FBI',
                    `👤 ${user.tag}
⭐ XP: ${db.xp[user.id] || 0}
💰 Coins: ${db.coins[user.id] || 0}`
                )
            ],
            ephemeral: true
        });
    }

    // =======================
    // WARN
    // =======================
    if (commandName === 'warn') {

        if (!isMod(interaction.member)) {
            return interaction.reply({
                content: '❌ Sin permisos (MOD requerido)',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'sin motivo';

        if (!db.warns[user.id]) db.warns[user.id] = [];

        db.warns[user.id].push({
            reason,
            mod: interaction.user.tag,
            date: new Date().toLocaleString()
        });

        addHistory(user.id, `WARN: ${reason}`);

        log(interaction.guild, `⚠️ WARN ${user.tag}`);

        return interaction.reply({
            embeds: [emb('WARN', `${user.tag}\n${reason}`, 0xffcc00)]
        });
    }

    // =======================
    // MUTE
    // =======================
    if (commandName === 'mute') {

        if (!isMod(interaction.member)) {
            return interaction.reply({ content: '❌ Sin permisos', ephemeral: true });
        }

        const user = interaction.options.getMember('user');
        const time = interaction.options.getString('time');

        const ms = parseInt(time) * 60000;

        await user.timeout(ms);

        log(interaction.guild, `🔇 MUTE ${user.user.tag}`);

        return interaction.reply({
            embeds: [emb('MUTE', `${user.user.tag} (${time})`)]
        });
    }

    // =======================
    // UNMUTE
    // =======================
    if (commandName === 'unmute') {

        if (!isMod(interaction.member)) {
            return interaction.reply({ content: '❌ Sin permisos', ephemeral: true });
        }

        const user = interaction.options.getMember('user');

        await user.timeout(null);

        log(interaction.guild, `🔊 UNMUTE ${user.user.tag}`);

        return interaction.reply({
            embeds: [emb('UNMUTE', `${user.user.tag}`)]
        });
    }

    // =======================
    // ANNOUNCE
    // =======================
    if (commandName === 'announce') {

        if (!isAdmin(interaction.member)) {
            return interaction.reply({ content: '❌ Solo ADMIN', ephemeral: true });
        }

        const text = interaction.options.getString('text');

        log(interaction.guild, `📢 ANNOUNCE`);

        return interaction.reply({
            content: '@everyone',
            embeds: [emb('ANUNCIO', text, 0xff0000)]
        });
    }

    // =======================
    // DMALL
    // =======================
    if (commandName === 'dmall') {

        if (!isAdmin(interaction.member)) {
            return interaction.reply({ content: '❌ Solo ADMIN', ephemeral: true });
        }

        const text = interaction.options.getString('text');

        const members = await interaction.guild.members.fetch();

        let sent = 0;

        for (const m of members.values()) {
            if (!m.user.bot) {
                try {
                    await m.send({ embeds: [emb('MENSAJE', text)] });
                    sent++;
                } catch {}
            }
        }

        return interaction.reply({
            embeds: [emb('DMALL', `Enviados: ${sent}`)]
        });
    }
});

// =======================
// LOGIN
// =======================
client.login(process.env.DISCORD_TOKEN);