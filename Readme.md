# Focus Backend

**Focus Backend** is the server-side component of the Focus SaaS platform, built to efficiently handle user data, task tracking, real-time updates, and subscription management. Designed with scalability, security, and performance in mind, it provides a robust API for seamless integration with the frontend.

## Technologies Used

- **Node.js**: Asynchronous runtime environment for efficient request handling.
- **Express.js**: Lightweight web framework to build RESTful APIs.
- **PostgreSQL**: Relational database for structured data storage.
- **Drizzle ORM**: Type-safe ORM for interacting with PostgreSQL.
- **Socket.io**: Real-time communication for live updates and notifications.
- **Redis**: In-memory data store for caching and session management.
- **Bull Queue**: Job queue management for background tasks.
- **Passport.js**: Authentication middleware for social logins (Google, GitHub) and local authentication.
- **JWT**: Secure user authentication using JSON Web Tokens.
- **Stripe**: Payment integration for handling subscriptions and payments.

## Features

- **User Authentication**: Secure login and registration via JWT, with support for Google and GitHub OAuth.
- **Real-Time Notifications**: Live updates for task progress, session changes, and user interactions.
- **Task and Time Tracking**: Allows users to track tasks, set focus sessions, and monitor productivity.
- **Subscription Management**: Handles trial periods, one-time payments, and recurring subscriptions through Stripe.
- **Background Jobs**: Offloads tasks like email verification and notifications to background workers using Bull Queue.
- **Data Caching**: Redis caching for improved performance and quick data retrieval.

## Setup

### Prerequisites

- Node.js >= 16.x
- PostgreSQL
- Redis (optional for caching)
- Stripe API key (for payment processing)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/focus-backend.git
   cd focus-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```bash
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=focus
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Run migrations (if applicable):

   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## License

MIT License. See [LICENSE](LICENSE) for more details.

## Contributing

1. Fork this repository.
2. Create your branch (`git checkout -b feature-xyz`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-xyz`).
5. Create a new Pull Request.

---

Feel free to adjust any sections as necessary!
