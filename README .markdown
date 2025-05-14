# Event Booking App 🎉

The Event Booking App is a web application that allows users to register, log in via email or Google, create and manage events, reserve seats, and check event location weather. Built with React, Node.js, and Firebase, it provides a seamless experience for event organizers and attendees.

## ✨ Features

- **User Authentication** 🔐  
  Register and log in using email/password or Google via Firebase Authentication.
- **Event Management** 📅  
  Create, edit, and delete events with details like name, date, location, price, seats, and category.
- **Seat Reservation** 💺  
  Reserve seats for events with real-time availability checks.
- **Weather Information** ☀️  
  Check the weather for event locations using the OpenWeather API.
- **Responsive Design** 📱  
  Fully responsive UI built with React and Bootstrap for a great experience on all devices.

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Bootstrap
- **Backend**: Node.js, Express
- **Authentication**: Firebase Authentication (Email/Password, Google)
- **Database**: PostgreSQL
- **APIs**: OpenWeather API
- **Logging**: Winston (for logging authentication events)
- **Deployment**: Firebase Hosting (frontend), Heroku/AWS (backend)

## 📂 Project Structure

```
event-booking-app/
├── backend/              # Backend (Node.js/Express)
│   ├── index.js          # Main backend file
│   ├── db.js             # PostgreSQL connection setup
│   └── logs/             # Logs for authentication events
├── frontend/             # Frontend (React)
│   ├── src/
│   │   ├── firebase.js   # Firebase initialization
│   │   ├── App.jsx       # Main React app component
│   │   ├── pages/        # React pages (Home, Login, Register, etc.)
│   │   └── components/   # Reusable React components (Navbar, Footer, etc.)
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or later)
- PostgreSQL (for the database)
- Firebase account (for authentication)
- OpenWeather API key (for weather data)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/event-booking-app.git
   cd event-booking-app
   ```

2. **Set up the backend**:
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` folder:
     ```
     DB_USER=your_db_user
     DB_HOST=localhost
     DB_NAME=event_booking_db
     DB_PASSWORD=your_db_password
     DB_PORT=5432
     OPENWEATHER_API_KEY=your_openweather_api_key
     ```
   - Download your Firebase Admin SDK service account key from Firebase Console and place it in `backend` as `serviceAccountKey.json`.
   - Create a `logs` folder:
     ```bash
     mkdir logs
     ```
   - Set up your PostgreSQL database and run the necessary migrations (schema not provided here).

3. **Set up the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```
   - Ensure `src/firebase.js` has your Firebase configuration (already included in the code).

4. **Run the backend**:
   ```bash
   cd ../backend
   node index.js
   ```
   The backend should run on `http://localhost:5000`.

5. **Run the frontend**:
   ```bash
   cd ../frontend
   npm start
   ```
   The frontend should run on `http://localhost:3000`.

## 🖥️ Usage

1. **Register/Login**:
   - Go to `/register` to create an account using email/password.
   - Go to `/login` to sign in using email/password or Google.
2. **Create an Event**:
   - Navigate to `/create-event` to add a new event (requires login).
3. **Reserve Seats**:
   - View an event at `/event/:id` and reserve available seats.
4. **Check Weather**:
   - Weather information for the event location is displayed on the event page.

## 🌐 Deployment

### Frontend (Firebase Hosting)
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Initialize Firebase Hosting:
   ```bash
   cd frontend
   firebase init hosting
   ```
3. Deploy:
   ```bash
   firebase deploy
   ```

### Backend (Heroku/AWS)
1. Update CORS in `backend/index.js` to allow your Firebase Hosting domain:
   ```javascript
   app.use(cors({ origin: 'https://your-app.firebaseapp.com' }));
   ```
2. Deploy to Heroku:
   ```bash
   heroku create
   git push heroku main
   ```
   - Set environment variables in Heroku (same as `.env`).

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## 📧 Contact

For questions or suggestions, feel free to reach out:
- Email: your-email@example.com
- GitHub: [your-username](https://github.com/your-username)

---

Happy event booking! 🎟️