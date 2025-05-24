# Karigari Food Ordering System

A full-stack food ordering application with real-time order tracking and secure payment integration.

## Features

- Browse menu items by category
- Real-time cart management
- QR code-based payment system
- Order tracking
- Responsive design for mobile and desktop

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Karigari-Food-Ordering-System.git
cd Karigari-Food-Ordering-System
```

2. Install dependencies:

```bash
npm install
```

3. Set up Firebase:

- Create a new Firebase project
- Enable Realtime Database
- Generate a service account key
- Save the key as `serviceAccountKey.json` in the project root

4. Create environment variables:

- Create a `.env` file in the project root
- Add the following variables:

```env
PORT=3000
FIREBASE_DATABASE_URL=your-database-url
```

5. Initialize the database with sample data:

```bash
node init-db.js
```

6. Start the server:

```bash
npm start
```

7. Visit the application:

Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```plaintext
├── eaters/              # Frontend files
│   ├── assets/          # Images, icons, and other static files
│   ├── index.html       # Main HTML file
│   ├── main.js          # Frontend JavaScript
│   └── style.css        # Styles
├── server.js            # Express server
├── init-db.js           # Database initialization script
├── package.json         # Project dependencies
└── README.md           # Project documentation
```

## API Documentation

- `GET /api/menu` - Get all menu items
- `POST /api/orders` - Place a new order
- `GET /api/orders/:orderId` - Get order status

## Development

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Backend server for the food ordering system integrated with Firebase Realtime Database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on http://localhost:3000

## API Endpoints

- GET /api/menu - Get all menu items
- POST /api/orders - Place a new order
- GET /api/orders/:orderId - Get order status

## Firebase Integration

The backend is integrated with Firebase Realtime Database at:
https://foodorder-8a5e6-default-rtdb.firebaseio.com/
