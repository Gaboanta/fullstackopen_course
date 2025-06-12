import { config } from 'dotenv';
config() // Set environment variables to process.env from .env file
import express from 'express';
import cors from 'cors';
import NoteModel from './models/note';
import mongoose from 'mongoose';

// Declare variables
const app = express()
const port = process.env.PORT

// Add middleware
// Custom logger
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString()
  const data = JSON.stringify(req.body)
  console.log(`${time}: ${req.method}  ${req.hostname}  ${req.path}`);
  if (data)
    console.log(`\tData: ${data}`)
  next()
})
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Create routes
// Route to get all notes
app.get('/api/notes', (req, res) => {
  NoteModel.find({}).then(notes => {
    res.json(notes)
  })
})
// Route to get note by id
app.get('/api/notes/:id', (req, res) => {
  NoteModel.findById(req.params.id).then(foundNote => {
    if (!foundNote) {
      res.status(404).json({ error: "That note doesn't exist" })
      return
    }
    res.json(foundNote)
  }).catch(error => {
    res.status(400).json({ error: error })
  })
})
// Route to add new note
app.post('/api/notes', (req, res) => {
  let note = req.body
  if (typeof note !== 'object' || !Object.hasOwn(note, 'content') || !Object.hasOwn(note, 'important')) {
    res.status(400).json(
      { error: "Invalid data. Note must be an object with 'content' (string) and 'important' (boolean) properties" })
    return
  }

  const newNote = new NoteModel({
    content: note.content,
    important: note.important
  })

  newNote.save().then(savedNote => {
    res.json(savedNote)
  })
})
// Route to delete specific note
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  NoteModel.findByIdAndDelete(id).then(deletedNote => {
    if (deletedNote) {
      res.json(deletedNote)
      return
    }
    res.json({ error: `That note was already deleted or did not exist` })
  }).catch(error => {
    res.status(400).json({ error: error })
  })
})

// Start Express server
const server = app.listen(port, error => {
  console.log(`Express server is running on port ${port}`);
})

// Handle exit process gracefully
function exitProcess(code = 0) {
  server.close(() => {
    mongoose.disconnect().then(() => {
      console.log('Server and db closed');
      process.exit(code)
    })
  })
}
// SIGTERM is emitted when a process manager stops the process 
process.on('SIGTERM', () => {
  exitProcess()
})
// SIGINT is emitted when user presses Ctrl+C in terminal
process.on('SIGINT', () => {
  exitProcess()
})