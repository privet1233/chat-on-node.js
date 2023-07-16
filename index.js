const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


// Функция для записи строки в лог-файл
function writeToLogFile(logString) {
    const logFilePath = path.join(__dirname, 'log.txt');
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const formattedLogString = `[${currentDate}] ${logString}\n`;

  fs.appendFile(logFilePath, formattedLogString, (err) => {
      if (err) {
     console.error('Ошибка при записи в лог-файл:', err);
     }
   });
}



app.get('/', (req, res) => {
  writeToLogFile(`[${req.ip}] GET /`); 
  res.sendFile(__dirname + '/index.html')
})

// Функция для использования папки assets
app.use(express.static(__dirname + '/assets'))


io.on('connection', (socket) => {
// Событие при подключении к чату
    socket.on('user connected', (username) => {
// Отправляем сообщение о входе в чат
      io.emit('chat message', { name: username, message: 'вошел в чат' });

// Перехватываем событие отключения пользователя
    socket.on('user disconnect', (username) => {
// Задержка перед отправкой сообщения о покинутом чате
    setTimeout(() => {
    io.emit('chat message', { name: username, message: 'покинул чат' });
    }, 60000); // 1 минута = 60000 миллисекунд
   });
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (data) => { 
  
   io.emit('chat message', {
   message: data.message,
   name: data.name
   })
  })
})


http.listen(3000)





