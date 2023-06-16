const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
app.use(cors());
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: 'Va48142022',
  port: 5432,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
async function insertData(reqBody) {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(reqBody.password, saltRounds);
        // pool.query(`
        // CREATE TABLE users (
        //     id SERIAL PRIMARY KEY,
        //     email VARCHAR(30),
        //     password VARCHAR(30),
        //     name VARCHAR(30),
        //     surname VARCHAR(30),
        //     phone VARCHAR(30),
        //     password VARCHAR(30),
        //     emailconfirm VARCHAR(30)
        // )
        // `, (error, results) => {
        // if (error) {
        //     throw error;
        // }
        // });
        pool.query(`
        INSERT INTO users (email, username, name, surname, phone, password, emailconfirm)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [reqBody.email, reqBody.username, reqBody.name, reqBody.surname, reqBody.phone, hashedPassword, false], 
        (err, res) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Пользователь добавлен');
            }
        });
    } catch (err) {
        console.error(err);
    }
  }
app.post('/singin', async (req, res) => {
    const query = `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);`;
    pool.query(query, [req.body.email], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows[0].exists) {
            res.status(409).json({
                isRegisted: true
            })
        } else {
            console.log(results)
            insertData(req.body);
            const confirmationCode = Math.floor(Math.random() * 10000);
            res.status(200).json({
                confirmationCode: confirmationCode,
                userEmail: req.body.email
            })
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));