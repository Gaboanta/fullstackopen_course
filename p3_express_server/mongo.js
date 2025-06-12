// File for testing Mongoose
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please give database password as 1st argument')
  process.exit(1)
}

const password = process.argv[2]
const dbName = 'noteApp'
const url = `mongodb+srv://gavriel:${password}@cluster0.1pkmwjw.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// Create note schema
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// Create note model
const NoteModel = mongoose.model('Note', noteSchema)

// Make a new note document
const newNote = new NoteModel({
  content: 'HTML is easy',
  important: true,
})

// // Save note document to db
// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// Fetch all notes from db
NoteModel.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})