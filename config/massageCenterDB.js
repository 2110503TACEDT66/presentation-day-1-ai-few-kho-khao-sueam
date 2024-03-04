const { model } = require('mongoose');
const mysql = require('mysql');

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0123456789101112',
    database: 'massageCenter'
});

module.exports = connection;