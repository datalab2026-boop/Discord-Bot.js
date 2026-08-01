const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.js'); // Подключаем конфиг прямо здесь

function createDiscordClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMembers, // Добавил интенты, скорее всего они понадобятся для участников
            GatewayIntentBits.GuildMessages
        ]
    });

    async function loadModules() {
        // Убрали '..' так как модули лежат на том же уровне или в текущей папке
        const modulesPath = path.join(__dirname, 'modules'); 
        
        if (!fs.existsSync(modulesPath)) {
            console.warn('[Connection Warning]: Папка с модулями не найдена, пропускаем автозагрузку.');
            return;
        }

        const moduleFiles = fs.readdirSync(modulesPath).filter(file => file.endsWith('.js'));

        for (const file of moduleFiles) {
            try {
                const filePath = path.join(modulesPath, file);
                const module = require(filePath);
                
                if (typeof module === 'function') {
                    await module(client, config);
                } else if (module && typeof module.init === 'function') {
                    await module.init(client, config);
                }
                
                console.log(`[Handler]: Успешно загружен модуль -> ${file}`);
            } catch (error) {
                console.error(`[Handler Error]: Ошибка при загрузке модуля ${file}:`, error);
            }
        }
    }

    client.once('ready', async () => {
        console.log(`[Bot Ready]: Авторизован как ${client.user.tag}`);
        await loadModules();
    });

    if (!config.bot_token) {
        throw new Error('Критическая ошибка: bot_token отсутствует в конфигурационном файле!');
    }

    client.login(config.bot_token).catch(error => {
        console.error('[Connection Error]: Не удалось подключиться к Discord API:', error);
    });

    return client;
}

// Запускаем функцию сразу при импорте файла
createDiscordClient();

module.exports = { createDiscordClient };
