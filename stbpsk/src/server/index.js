require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const connectDB = require('./config/db');
const Content = require('./models/Content');

const app = express();
const PORT = process.env.PORT || 5000;

// Подключаемся к базе данных
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// JWT middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Пожалуйста, авторизуйтесь' });
  }
};

// Демо-аккаунт
const adminUser = {
  username: 'admin',
  password: '' // Будет установлено при запуске
};

// Генерация хеша пароля при запуске
bcrypt.hash('admin123', 10).then(hash => {
  adminUser.password = hash;
  console.log('Хеш пароля сгенерирован:', hash);
});

// Маршруты
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Получен запрос на вход:', { username });

    if (!username || !password) {
      console.log('Отсутствуют учетные данные');
      return res.status(400).json({ error: 'Необходимо указать имя пользователя и пароль' });
    }

    if (username !== adminUser.username) {
      console.log('Пользователь не найден');
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    console.log('Результат проверки пароля:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log('Успешный вход, токен создан');
    res.json({ token });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршруты для работы с контентом
app.get('/api/admin/content', auth, async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = await Content.create({});
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении контента' });
  }
});

app.put('/api/admin/content/phone', auth, async (req, res) => {
  try {
    console.log('Получен запрос на обновление телефона:', req.body);
    const { phone } = req.body;
    
    if (!phone) {
      console.log('Телефон не указан в запросе');
      return res.status(400).json({ error: 'Телефон не указан' });
    }

    let content = await Content.findOne();
    console.log('Найден существующий контент:', content);
    
    if (!content) {
      console.log('Создаем новый документ контента');
      content = await Content.create({ phone });
    } else {
      console.log('Обновляем существующий документ');
      content.phone = phone;
      content.updatedAt = Date.now();
      await content.save();
    }
    
    console.log('Телефон успешно обновлен:', content);
    res.json(content);
  } catch (error) {
    console.error('Ошибка при обновлении телефона:', error);
    res.status(500).json({ error: 'Ошибка при обновлении телефона' });
  }
});

app.put('/api/admin/content/cities', auth, async (req, res) => {
  try {
    console.log('Получен запрос на обновление городов:', req.body);
    const { deliveryCities } = req.body;
    
    if (!Array.isArray(deliveryCities)) {
      console.log('Некорректный формат данных:', deliveryCities);
      return res.status(400).json({ error: 'Некорректный формат данных. Ожидается массив городов.' });
    }

    let content = await Content.findOne();
    console.log('Найден существующий контент:', content);
    
    if (!content) {
      console.log('Создаем новый документ контента');
      content = await Content.create({ deliveryCities });
    } else {
      console.log('Обновляем существующий документ');
      content.deliveryCities = deliveryCities;
      content.updatedAt = Date.now();
      await content.save();
    }
    
    console.log('Города успешно обновлены:', content);
    res.json({ deliveryCities: content.deliveryCities });
  } catch (error) {
    console.error('Ошибка при обновлении городов:', error);
    res.status(500).json({ error: 'Ошибка при обновлении городов' });
  }
});

// Публичный маршрут для получения телефона
app.get('/api/public/phone', async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = await Content.create({ phone: '+7' });
    }
    res.json({ phone: content.phone });
  } catch (error) {
    console.error('Ошибка при получении телефона:', error);
    res.status(500).json({ error: 'Ошибка при получении телефона' });
  }
});

// Публичный маршрут для получения списка городов
app.get('/api/public/cities', async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = await Content.create({ deliveryCities: [] });
    }
    res.json({ cities: content.deliveryCities });
  } catch (error) {
    console.error('Ошибка при получении списка городов:', error);
    res.status(500).json({ error: 'Ошибка при получении списка городов' });
  }
});

// Тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

// Поиск городов через DaData
app.get('/api/cities/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${process.env.DADATA_API_KEY}`
      },
      body: JSON.stringify({
        query,
        locations: [{ country: 'Россия' }],
        locations_boost: [{ country: 'Россия' }],
        from_bound: { value: 'city' },
        to_bound: { value: 'city' },
        restrict_value: true
      })
    });

    const data = await response.json();
    const cities = data.suggestions.map(suggestion => ({
      value: suggestion.value,
      data: suggestion.data
    }));

    res.json(cities);
  } catch (error) {
    console.error('Ошибка при поиске городов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log('Демо-аккаунт:');
  console.log('Логин: admin');
  console.log('Пароль: admin123');
}); 