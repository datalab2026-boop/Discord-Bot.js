const http = require('http');

// Создаем простой HTTP-сервер
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!');
});

// Получаем порт из переменной окружения Render или используем 10000 по умолчанию
const PORT = process.env.PORT || 10000;

function keepAlive() {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`[KeepAlive]: Веб-сервер успешно запущен на порту ${PORT}`);
    });
}

module.exports = { keepAlive };

