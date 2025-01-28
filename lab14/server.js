const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'XYZ',
    password: '1111',
    port: 5432,
});

pool.connect()
    .then(() => console.log('Соединение с базой данных установлено'))
    .catch(err => console.error('Ошибка подключения к базе данных', err.stack));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- GET запросы для получения данных ---
app.get('/api/faculties', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения факультетов' });
    }
});

app.get('/api/pulpits', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pulpits');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения кафедр' });
    }
});

app.get('/api/subjects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM subjects');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения учебных дисциплин' });
    }
});

app.get('/api/auditoriumstypes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM auditoriumstypes');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения типов аудиторий' });
    }
});

app.get('/api/auditoriums', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM auditoriums');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения аудиторий' });
    }
});

// --- POST запросы для добавления данных ---
app.post('/api/faculties', async (req, res) => {
    const { faculty_id, faculty_name } = req.body;
    console.log( faculty_id, faculty_name );
    try {
        const result = await pool.query(
            'INSERT INTO faculties (faculty_id, faculty_name) VALUES ($1, $2) RETURNING *',
            [faculty_id, faculty_name]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления факультета' });
    }
});

app.post('/api/pulpits', async (req, res) => {
    const { pulpit_id, pulpit_name, faculty_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO pulpits (pulpit_id, pulpit_name, faculty_id) VALUES ($1, $2, $3) RETURNING *',
            [pulpit_id, pulpit_name, faculty_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления кафедры' });
    }
});

app.post('/api/subjects', async (req, res) => {
    const { subject_id, subject_name, pulpit_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO subjects (subject_id, subject_name, pulpit_id) VALUES ($1, $2, $3) RETURNING *',
            [subject_id, subject_name, pulpit_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления дисциплины' });
    }
});

app.post('/api/auditoriumstypes', async (req, res) => {
    const { auditorium_type, auditorium_type_name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO auditoriumstypes (auditorium_type, auditorium_type_name) VALUES ($1, $2) RETURNING *',
            [auditorium_type, auditorium_type_name]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления типа аудитории' });
    }
});

app.post('/api/auditoriums', async (req, res) => {
    const { auditorium_id, auditorium_name, auditorium_type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO auditoriums (auditorium_id, auditorium_name, auditorium_type) VALUES ($1, $2, $3) RETURNING *',
            [auditorium_id, auditorium_name, auditorium_type]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления аудитории' });
    }
});

// --- PUT запросы для обновления данных ---
app.put('/api/faculties', async (req, res) => {
    const { faculty_id, faculty_name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE faculties SET faculty_name = $2 WHERE faculty_id = $1 RETURNING *',
            [faculty_id, faculty_name]
        );
        res.json(result.rows[0] || { error: 'Факультет не найден' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления факультета' });
    }
});

app.put('/api/pulpits', async (req, res) => {
    const { pulpit_id, pulpit_name, faculty_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE pulpits SET pulpit_name = $2, faculty_id = $3 WHERE pulpit_id = $1 RETURNING *',
            [pulpit_id, pulpit_name, faculty_id]
        );
        res.json(result.rows[0] || { error: 'Кафедра не найдена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления кафедры' });
    }
});

app.put('/api/subjects', async (req, res) => {
    const { subject_id, subject_name, pulpit_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE subjects SET subject_name = $2, pulpit_id = $3 WHERE subject_id = $1 RETURNING *',
            [subject_id, subject_name, pulpit_id]
        );
        res.json(result.rows[0] || { error: 'Дисциплина не найдена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления дисциплины' });
    }
});

app.put('/api/auditoriumstypes', async (req, res) => {
    const { auditorium_type, auditorium_type_name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE auditoriumstypes SET auditorium_type_name = $2 WHERE auditorium_type = $1 RETURNING *',
            [auditorium_type, auditorium_type_name]
        );
        res.json(result.rows[0] || { error: 'Тип аудитории не найден' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления типа аудитории' });
    }
});

app.put('/api/auditoriums', async (req, res) => {
    const { auditorium_id, auditorium_name, auditorium_type } = req.body;
    try {
        const result = await pool.query(
            'UPDATE auditoriums SET auditorium_name = $2, auditorium_type = $3 WHERE auditorium_id = $1 RETURNING *',
            [auditorium_id, auditorium_name, auditorium_type]
        );
        res.json(result.rows[0] || { error: 'Аудитория не найдена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления аудитории' });
    }
});

// --- DELETE запросы для удаления данных ---
app.delete('/api/faculties/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM faculties WHERE faculty_id = $1 RETURNING *', [req.params.id]);
        res.json(result.rows[0] || { error: 'Факультет не найден' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления факультета' });
    }
});

app.delete('/api/pulpits/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM pulpits WHERE pulpit_id = $1 RETURNING *', [req.params.id]);
        res.json(result.rows[0] || { error: 'Кафедра не найдена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления кафедры' });
    }
});

app.delete('/api/subjects/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM subjects WHERE subject_id = $1 RETURNING *', [req.params.id]);
        res.json(result.rows[0] || { error: 'Дисциплина не найдена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления дисциплины' });
    }
});

app.delete('/api/auditoriumstypes/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM auditoriumstypes WHERE auditorium_type = $1 RETURNING *', [req.params.id]);
        res.json(result.rows[0] || { error: 'Тип аудитории не найден' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления типа аудитории' });
    }
});

app.delete('/api/auditoriums/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM auditoriums WHERE auditorium_id = $1 RETURNING *', [req.params.id]);
        res.json(result.rows[0] || { error: 'Аудитория не найдена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления аудитории' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
