const { EmbedBuilder } = require('discord.js');

/**
 * Обновляет название голосового канала с текущим количеством участников группы Roblox.
 * @param {import('discord.js').Client} client - Инстанс клиента Discord
 * @param {Object} config - Объект конфигурации (config.js)
 */
async function updateGroupMembersChannel(client, config) {
    const groupId = config.groupId;
    const channelId = config.group_members;
    const errorChannelId = config.errors;

    try {
        // 1. Запрос к Roblox API для получения информации о группе
        const response = await fetch(`https://groups.roblox.com/v1/groups/${groupId}`);
        
        if (!response.ok) {
            throw new Error(`Roblox API returned status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const memberCount = data.memberCount;

        if (typeof memberCount !== 'number') {
            throw new Error('Не удалось получить корректное количество участников из ответа Roblox API.');
        }

        // 2. Получение голосового канала в Discord
        const channel = await client.channels.fetch(channelId);
        
        if (!channel || !channel.isVoiceBased()) {
            throw new Error(`Канал с ID ${channelId} не найден или не является голосовым.`);
        }

        // 3. Форматирование и обновление названия канала
        const newName = `⭐┆Group Members: ${memberCount}`;
        
        if (channel.name !== newName) {
            await channel.setName(newName);
        }

    } catch (error) {
        console.error('[Roblox Module Error]:', error);

        // 4. Отправка ошибки в канал логов через Embed
        if (errorChannelId) {
            try {
                const errorChannel = await client.channels.fetch(errorChannelId);
                if (errorChannel && errorChannel.isTextBased()) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('🚨 Ошибка обновления модуля Roblox')
                        .setDescription(`\`\`\`${error.message}\`\`\``)
                        .setTimestamp();

                    await errorChannel.send({ embeds: [errorEmbed] });
                }
            } catch (logError) {
                console.error('[Roblox Module] Не удалось отправить лог ошибки в Discord:', logError);
            }
        }
    }
}

module.exports = { updateGroupMembersChannel };
