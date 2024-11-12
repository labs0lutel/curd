const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); 

let ads = [];

// Получение всех объявлений
app.get('/ads', (req, res) => {
    res.json(ads);
});

// Добавление нового объявления
app.post('/ads', (req, res) => {
    const ad = req.body;
    ads.push(ad);
    res.status(201).json(ad);
});

// Удаление объявления
app.delete('/ads/:id', (req, res) => {
    const { id } = req.params;
    ads = ads.filter(ad => ad.id !== id);
    res.status(204).send();
});

// Обработка загрузки изображений
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
