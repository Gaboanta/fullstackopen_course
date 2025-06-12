"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Set environment variables to process.env from .env file
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const note_1 = __importDefault(require("./models/note"));
const mongoose_1 = __importDefault(require("mongoose"));
// Declare variables
const app = (0, express_1.default)();
const port = process.env.PORT;
// Add middleware
// Custom logger
app.use((req, res, next) => {
    const time = new Date().toLocaleTimeString();
    const data = JSON.stringify(req.body);
    console.log(`${time}: ${req.method}  ${req.hostname}  ${req.path}`);
    if (data)
        console.log(`\tData: ${data}`);
    next();
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('dist'));
// Create routes
// Route to get all notes
app.get('/api/notes', (req, res) => {
    note_1.default.find({}).then(notes => {
        res.json(notes);
    });
});
// Route to get note by id
app.get('/api/notes/:id', (req, res) => {
    note_1.default.findById(req.params.id).then(foundNote => {
        if (!foundNote) {
            res.status(404).json({ error: "That note doesn't exist" });
            return;
        }
        res.json(foundNote);
    }).catch(error => {
        res.status(400).json({ error: error });
    });
});
// Route to add new note
app.post('/api/notes', (req, res) => {
    let note = req.body;
    if (typeof note !== 'object' || !Object.hasOwn(note, 'content') || !Object.hasOwn(note, 'important')) {
        res.status(400).json({ error: "Invalid data. Note must be an object with 'content' (string) and 'important' (boolean) properties" });
        return;
    }
    const newNote = new note_1.default({
        content: note.content,
        important: note.important
    });
    newNote.save().then(savedNote => {
        res.json(savedNote);
    });
});
// Route to delete specific note
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    note_1.default.findByIdAndDelete(id).then(deletedNote => {
        if (deletedNote) {
            res.json(deletedNote);
            return;
        }
        res.json({ error: `That note was already deleted or did not exist` });
    }).catch(error => {
        res.status(400).json({ error: error });
    });
});
// Start Express server
const server = app.listen(port, error => {
    console.log(`Express server is running on port ${port}`);
});
// Handle exit process gracefully
function exitProcess(code = 0) {
    server.close(() => {
        mongoose_1.default.disconnect().then(() => {
            console.log('Server and db closed');
            process.exit(code);
        });
    });
}
// SIGTERM is emitted when a process manager stops the process 
process.on('SIGTERM', () => {
    exitProcess();
});
// SIGINT is emitted when user presses Ctrl+C in terminal
process.on('SIGINT', () => {
    exitProcess();
});
