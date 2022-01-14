const express = require('express');
const app = express();

app.use(express.static('dist'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/pages/login/index.html');
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/pages/client-error/client-error.html');
});

app.listen(3000, () => console.log('Listening on port 3000!'))
