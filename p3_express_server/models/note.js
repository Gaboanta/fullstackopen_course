"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', false);
const dbConnectionString = process.env.MONGODB_URI;
if (!dbConnectionString) {
    console.log(`MongoDB connection string is needed!`);
    process.exit(1);
}
console.log('Connecting to MongoDB...');
mongoose_1.default.connect(dbConnectionString)
    .then(result => {
    console.log('Connected to MongoDB');
})
    .catch(error => {
    console.log(`Error connecting to MongoDB: ${error.message}`);
});
const noteSchema = new mongoose_1.default.Schema({
    content: String,
    important: Boolean,
});
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
/** Model of notes in MongoDB */
const NoteModel = mongoose_1.default.model('Note', noteSchema);
exports.default = NoteModel;
