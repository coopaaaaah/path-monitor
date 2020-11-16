require('dotenv').config();
const mariadb = require('mariadb');
const express = require('express');

const app = express();

const pool = mariadb.createPool({ 
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
});

app.get('/', function(req, res) {
	res.send('hello world');
});

app.post('/api/path', function(req, res) {
	
	const payload = req.body;

	const insert_query = 'INSERT into path_history(node, input, create_datetime, last_updated_timestamp) value (?, ?, ?, ?)';
	const insert_payload = [payload.node, payload.input, new Date(), new Date()];

	pool.getConnection()
		.then(conn => {
			conn.query(insert_query, insert_payload)
				.then(result => {
					res.send(result);
				});
		})
		.catch(err => {
			res.send(err);
		});

});

app.patch('/api/path', function(req, res) {
	
	const payload = req.body;

	const update_query = `update path_history set output=${payload.output}, last_updated_timestamp = now() where id = ${payload.id}`;

	pool.getConnection()
		.then(conn => {
			conn.query(update_query)
				.then(result => {
					res.send(result);
				});
		})
		.catch(err => {
			res.send(err);
		});

});

app.get('/test-insert', function(req, res) {
	pool.getConnection()
		.then(conn => {
			conn.query('INSERT into path_history(node, input, output, create_datetime, last_updated_timestamp) value (?, ?, ?, ?, ?)', ['test', 0, 1, new Date(), new Date()])
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
		})
		.catch(err => {
			console.log(err);
		});
	res.send('successful insert');
});

app.listen(3000);
