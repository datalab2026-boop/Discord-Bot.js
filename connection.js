const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 * Создает и настраивает клиент Discord, а также загружает модули.
 * @param {Object} config - Объект конфигурации (config.js)
 * @returns {Client} - Инициализированный клиент Discord
 */
function createDiscordClient(config) {
    // Создаем клиент с базовыми интентами (можно расширить при необходимости)
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates // Нужно для работы с голосовыми каналами
        ]
    });

    /**
     * Функция для динамической загрузки обработчиков/модулей
     * Ожидает, что модули лежат в папке /src/modules или аналогичной
     */
    async function loadModules() {
        const modulesPath = path.join(__dirname, '../modules'); // Путь к папке с модулями
        
        if (!fs.existsSync(modulesPath)) {
            console.warn('[Connection Warning]: Папка с модулями не найдена, пропускаем автозагрузку.');
            return;
        }

        const moduleFiles = fs.readdirSync(modulesPath).filter(file => file.endsWith('.js'));

        for (const file of moduleFiles) {
            try {
                const filePath = path.join(modulesPath, file);
                const module = require(filePath);
                
                // Если модуль экспортирует функцию инициализации, вызываем ее
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

    // Событие успешного запуска бота
    client.once('ready', async () => {
        console.log(`[Bot Ready]: Авторизован как ${client.user.tag} (ID: ${config.clientID})`);
        
        // Загружаем файлы/модули после старта бота
        await loadModules();
    });

    // Авторизация бота по токену из конфига
    if (!config.bot_token) {
        throw new Error('Критическая ошибка: bot_token отсутствует в конфигурационном файле!');
    }

    client.login(config.bot_token).catch(error => {
        console.error('[Connection Error]: Не удалось подключиться к Discord API:', error);
    });

    return client;
}

module.exports = { createDiscordClient };

