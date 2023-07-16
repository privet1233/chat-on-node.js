const socket = io()
const messages = document.querySelector('.messages')
const form = document.querySelector('.form')
const input = document.querySelector('.input')
const nameBlock = document.querySelector('.name')

//Форма для записи имени
const userName = prompt('Ваше имя:');
nameBlock.innerHTML = `${userName}`;
socket.emit('user connected', userName);


//Если в рамке для сообщения что-то есть, передаем эти значения во функцию index.js путем socket.emit указывая 'chat message' и очищаем форму для отправки
form.addEventListener('submit', (e) => {
e.preventDefault()
if (input.value) {
    socket.emit('chat message', {
    message: input.value,
    name: userName
    })
    input.value = ''
}
})

//Добавление сообщения конкретно в фронт при помощи списка 
socket.on('chat message', (data) => {
   const item = document.createElement('li')
   item.innerHTML = `<span> ${data.name}</span>: ${data.message}`
   messages.appendChild(item)
   //функция прокручивает сообщения до последнего
   window.scrollTo(0, document.body.scrollHeight)
})

//Отслеживаем закрытие браузера окна
window.addEventListener('beforeunload', () => {
socket.emit('user disconnect', userName);
}); 


