# AstraleanHomes - React E-Commerce Platform

A modern furniture e-commerce platform built with React, featuring user authentication and product browsing.

## Features

- 🏠 Home page with product slideshow
- 🛋️ Multiple product categories (Sofas, Beds, Tables, Chairs, Dining, Storage, Decor, Furnishings)
- 👤 User authentication (Login/Signup)
- 📱 Fully responsive design
- 🔒 Secure password hashing with bcryptjs
- ✉️ Contact form
- 🎨 Modern UI with smooth animations

## Project Structure

```
├── public/                 # Static HTML template
├── src/
│   ├── components/        # Reusable components (Navbar, Footer)
│   ├── pages/            # Page components (Home, Login, Products, etc.)
│   ├── App.js            # Main app component with routing
│   ├── App.css           # Global styles
│   └── index.js          # React entry point
├── server.js             # Express backend server
├── package.json          # Dependencies and scripts
└── users.json            # User database file
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the React app:**
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode (with React dev server and backend):

Terminal 1 - Start the backend server:
```bash
npm start
```

Terminal 2 - Start the React dev server:
```bash
npm run dev
```

The React app will run on `http://localhost:3000` and API calls will be made to `http://localhost:5000`

### Production Mode:

1. Build the React app:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

Access the app at `http://localhost:5000`

## API Endpoints

- **POST `/register`** - Register a new user
  - Body: `{ email, password }`

- **POST `/login`** - Login user
  - Body: `{ email, password }`

## Technologies Used

- **Frontend:** React 18, React Router DOM, Axios
- **Backend:** Express.js, Node.js
- **Authentication:** bcryptjs
- **Database:** JSON file (users.json)
- **Styling:** CSS3

## Features in Development

- Shopping cart functionality
- Product inventory management
- Order history
- User profile dashboard
- Payment integration
- Product reviews and ratings

## Notes

- User data is stored in `users.json` file
- Passwords are hashed using bcryptjs
- The app runs on port 5000 by default
- CORS is enabled for frontend-backend communication

## License

ISC

