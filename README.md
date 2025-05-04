# Tutam Server - Note App Backend

A simple REST API backend for a Note App built with Express.js and PostgreSQL.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a PostgreSQL database
4. Create `.env` file with your configuration:
   ```
   DB_USER=tutam9
   DB_PASSWORD=291221
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=noteapp
   PORT=5000
   ```
5. Run the SQL commands from `database.sql`
6. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a specific note
- `DELETE /api/notes/:id` - Delete a note

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- CORS
