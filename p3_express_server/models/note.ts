import mongoose from 'mongoose'

mongoose.set('strictQuery', false)
const dbConnectionString = process.env.MONGODB_URI
if (!dbConnectionString) {
  console.log(`MongoDB connection string is needed!`);
  process.exit(1)
}
console.log('Connecting to MongoDB...')
mongoose.connect(dbConnectionString)
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log(`Error connecting to MongoDB: ${error.message}`)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

/** Model of notes in MongoDB */
const NoteModel = mongoose.model('Note', noteSchema)
export default NoteModel