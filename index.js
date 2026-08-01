// 1. Подключаем конфиг (чтобы переменные подтянулись)
const config = require('./config.js');

// 2. Подключаем модуль авторизации/подключения к Discord
require('./connection.js');

// 3. запуск веб сервера
require('./web_server.js');
