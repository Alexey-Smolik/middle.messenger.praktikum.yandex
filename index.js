const express = require('express');
const app = express();

app.use(express.static('dist'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/pages/login/login.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/dist/pages/login/login.html');
});

app.get('/registration', (req, res) => {
    res.sendFile(__dirname + '/dist/pages/registration/registration.html');
});

app.get('/error', (req, res) => {
    res.sendFile(__dirname + '/dist/pages/server-error/server-error.html');
});

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/dist/pages/profile/profile.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/dist/pages/chat/chat.html');
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/pages/client-error/client-error.html');
});

app.listen(3000, () => console.log('Listening on port 3000!'))
