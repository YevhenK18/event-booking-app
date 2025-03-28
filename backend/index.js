const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Токен отсутствует" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Недействительный токен" });
    req.user = user;
    next();
  });
};

// Регистрация
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ token, userId: user.id, email: user.email });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Вход
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Неверный email или пароль" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Неверный email или пароль" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user.id, email: user.email });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


app.get("/api/events", async (req, res) => {
    const { name, location, category, date } = req.query;
    let query = "SELECT * FROM events WHERE 1=1";
    const values = [];
  
    if (name) {
      values.push(`%${name}%`);
      query += ` AND name ILIKE $${values.length}`;
    }
    if (location) {
      values.push(`%${location}%`);
      query += ` AND location ILIKE $${values.length}`;
    }
    if (category) {
      values.push(category);
      query += ` AND category = $${values.length}`;
    }
    if (date) {
     
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ error: "Неверный формат даты. Используйте YYYY-MM-DD" });
      }
      values.push(date);
      query += ` AND DATE(date) = $${values.length}`;
    }
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error("Ошибка при загрузке событий:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  });


app.get("/api/events/:eventId", async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [eventId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Событие не найдено" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при загрузке события:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Добавление события
app.post("/api/events", authenticateToken, async (req, res) => {
  const { name, date, location, price, total_seats, category } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO events (name, date, location, price, total_seats, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, date, location, price, total_seats, category]
    );

    const event = result.rows[0];
   
    for (let i = 1; i <= total_seats; i++) {
      await pool.query(
        "INSERT INTO seats (event_id, seat_number) VALUES ($1, $2)",
        [event.id, `Seat-${i}`]
      );
    }

    res.status(201).json(event);
  } catch (error) {
    console.error("Ошибка при создании события:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


app.put("/api/events/:eventId", authenticateToken, async (req, res) => {
  const { eventId } = req.params;
  const { name, date, location, price, total_seats, category } = req.body;

  try {
    const result = await pool.query(
      "UPDATE events SET name = $1, date = $2, location = $3, price = $4, total_seats = $5, category = $6 WHERE id = $7 RETURNING *",
      [name, date, location, price, total_seats, category, eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Событие не найдено" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при обновлении события:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


app.delete("/api/events/:eventId", authenticateToken, async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING *", [eventId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Событие не найдено" });
    }
    res.json({ message: "Событие удалено" });
  } catch (error) {
    console.error("Ошибка при удалении события:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


app.get("/api/seats/:eventId", async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const result = await pool.query("SELECT * FROM seats WHERE event_id = $1", [eventId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при загрузке мест:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


app.post("/api/seats/reserve", authenticateToken, async (req, res) => {
  const { seatId } = req.body;
  const userId = req.user.id;

  try {
    const seat = await pool.query("SELECT * FROM seats WHERE id = $1", [seatId]);
    if (seat.rows.length === 0) {
      return res.status(404).json({ message: "Место не найдено" });
    }
    if (seat.rows[0].reserved_by) {
      return res.status(400).json({ message: "Место уже занято" });
    }

    await pool.query("UPDATE seats SET reserved_by = $1 WHERE id = $2", [userId, seatId]);
    const reservation = await pool.query(
      "INSERT INTO reservations (user_id, event_id, seat_id) VALUES ($1, $2, $3) RETURNING *",
      [userId, seat.rows[0].event_id, seatId]
    );

    res.status(200).json({ message: "Место успешно забронировано", reservation: reservation.rows[0] });
  } catch (error) {
    console.error("Ошибка бронирования:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


app.get("/api/weather/:location", async (req, res) => {
  const { location } = req.params;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка при получении погоды:", error);
    res.status(500).json({ error: "Не удалось получить данные о погоде" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});