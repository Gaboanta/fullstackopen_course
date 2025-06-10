import express from 'express';
import cors from 'cors';

const app = express()
const port = process.env.PORT || 3001

let notes = [
  { id: 1, text: 'hello' },
  { id: 2, text: 'house' }
]

// Add middleware
app.use(cors())
app.use(express.json())

// Add routes
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(n => n.id.toString() === id)
  if (note)
    res.json(note)
  else {
    res.statusMessage = `Note with id ${id} does not exist`
    res.status(404).end()
  }
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.post('/api/notes', (req, res) => {
  let note = req.body
  const currentIds = notes.map(n => n.id)
  const maxId = Math.max(...currentIds)
  if ('text' in note) {
    note = { id: maxId + 1, text: note.text }
    notes.push(note)

    console.log(`Added note: ${JSON.stringify(note)}`);
    res.json(note)
  }
  res.end()
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(n => n.id.toString() !== id)
  res.status(204).end()
  console.log(`Deleted note with id ${id} (if it existed)`);
})

app.listen(port, (err) => {
  console.log(`Express server running on port ${port}`);
})