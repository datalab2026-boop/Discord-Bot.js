const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { division_administrator, head_moderator, administration } = require('./config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('ban person on this server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('reason for ban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'Причина не указана';
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
        const executor = interaction.member;

        // 1. Проверка наличия хотя бы одной из разрешенных ролей из конфига
        const allowedRoleIds = [division_administrator, head_moderator, administration];
        const hasPermissionRole = executor.roles.cache.some(role => allowedRoleIds.includes(role.id));

        if (!hasPermissionRole && !executor.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ You are missing the permission to ban.',
                ephemeral: true
            });
        }

        // Проверка, есть ли участник на сервере
        if (!member) {
            return interaction.reply({
                content: '❌ user isnt found on server.',
                ephemeral: true
            });
        }

        // 2. Проверка иерархии ролей (вызывающий vs цель)
        if (executor.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({
                content: '❌ ban failure, the user has higher role than moderator.',
                ephemeral: true
            });
        }

        // 3. Проверка иерархии ролей бота (бот vs цель)
        const botMember = await interaction.guild.members.fetchMe();
        if (botMember.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({
                content: '❌ ban failure, the user has higher role than moderator',
                ephemeral: true
            });
        }

        try {
            // Выполнение бана
            await member.ban({ reason: `Забанен пользователем ${executor.user.tag}: ${reason}` });

            const successEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🔨 successfully banned')
                .setDescription(`Участник **${targetUser.tag}** был забанен.`)
                .addFields(
                    { name: 'reason', value: reason, inline: false },
                    { name: 'moderator', value: `${executor.user.tag}`, inline: false }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ error during ban action',
                ephemeral: true
            });
        }
    },
};

