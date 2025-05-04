const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan dengan URL frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Routes

// Create a note
app.post('/api/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = await pool.query(
            "INSERT INTO notes (title, content) VALUES($1, $2) RETURNING *",
            [title, content]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get all notes
app.get('/api/notes', async (req, res) => {
    try {
        const allNotes = await pool.query("SELECT * FROM notes ORDER BY created_at DESC");
        res.json(allNotes.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch notes" });
    }
});

// Get a specific note
app.get('/api/notes/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        console.log('Fetching note with ID:', noteId); // Debug log

        const note = await pool.query("SELECT * FROM notes WHERE id = $1", [noteId]);
        
        if (note.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        
        res.json({ success: true, data: note.rows[0] });
    } catch (err) {
        console.error('Error fetching note:', err);
        res.status(500).json({ success: false, message: "Failed to fetch note" });
    }
});

// Update a note
app.put('/api/notes/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, content } = req.body;
        console.log('Updating note:', { id: noteId, title, content }); // Debug log

        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required" });
        }

        const result = await pool.query(
            "UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *",
            [title, content, noteId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).json({ success: false, message: "Failed to update note" });
    }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        console.log('Deleting note with ID:', noteId); // Debug log

        const result = await pool.query("DELETE FROM notes WHERE id = $1 RETURNING *", [noteId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        
        res.json({ success: true, message: "Note deleted successfully" });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ success: false, message: "Failed to delete note" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
