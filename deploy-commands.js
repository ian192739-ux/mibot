const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// 🧠 COMANDOS SLASH
const commands = [
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Ver comandos del bot'),

    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ver si el bot está activo'),

    new SlashCommandBuilder()
        .setName('superinfo')
        .setDescription('Ver tu perfil'),

    new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Dar warn a un usuario')
        .addUserOption(option =>
            option.setName('user').setDescription('Usuario').setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason').setDescription('Motivo')
        ),

    new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutear usuario')
        .addUserOption(option =>
            option.setName('user').setDescription('Usuario').setRequired(true)
        )
        .addStringOption(option =>
            option.setName('time').setDescription('Tiempo en minutos').setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Quitar mute')
        .addUserOption(option =>
            option.setName('user').setDescription('Usuario').setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Anuncio global')
        .addStringOption(option =>
            option.setName('text').setDescription('Mensaje').setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('dmall')
        .setDescription('Enviar DM a todos')
        .addStringOption(option =>
            option.setName('text').setDescription('Mensaje').setRequired(true)
        )
].map(cmd => cmd.toJSON());

// ⚙️ CONFIG
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('⏳ Registrando comandos...');

        await rest.put(
            Routes.applicationCommands('1502898379750117559'),
            { body: commands }
        );

        console.log('🟢 COMANDOS LISTOS (GLOBAL)');
    } catch (error) {
        console.error(error);
    }
})();