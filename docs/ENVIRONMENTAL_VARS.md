# Environment Variables Configuration

To run this project locally or in production, you must configure your environment variables. 
Duplicate the `.env.example` file in the root directory, rename it to `.env`, and populate it with your specific values.

### Server Configuration

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | The port on which the Express server will listen. | `4000` |
| `NODE_ENV` | The environment mode (`development`, `production`, `test`). | `development` |
| `JWT_SECRET` | A secure, random string used to sign JSON Web Tokens. | `your_super_secret_string` |
| `FRONTEND_URL` | The URL of the allowed frontend client (used for CORS). | `http://localhost:3000` |
| `RATE_LIMIT_MAX` | Maximum number of requests allowed per IP within the window. | `100` |
| `RATE_LIMIT_WINDOW_MS`| Timeframe for the rate limiter in milliseconds. | `3600000` (1 hour) |

### MongoDB Credentials (Docker Setup)

These variables are used by `docker-compose.yml` to initialize the database with secure credentials.

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `MONGO_ROOT_USER` | The root username for the MongoDB instance. | `admin` |
| `MONGO_ROOT_PASSWORD` | The root password for the MongoDB instance. | `yourmongopassword` |
| `MONGO_PORT` | The host port mapped to the MongoDB container. | `27017` |

### Application Connection

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `MONGO_URI` | The full connection string used by Mongoose inside the API. | `mongodb://admin:yourmongopassword@localhost:27017/blogging_db?authSource=admin` |

> **Security Note:** Never commit your `.env` file to version control. It is strictly ignored via `.gitignore`.