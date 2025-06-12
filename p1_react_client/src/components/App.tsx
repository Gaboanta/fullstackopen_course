import { useEffect, useState } from "react"
import type { Note } from "../types"
import { addNote, deleteNoteByIdAsync, getNotesAsync } from "../db"
import NoteComp from "./Note"

/** Root component */
function App() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    reloadNotesAsync()
  }, [])

  /** Makes a request to delete a note. Updates state if successful */
  async function handleDeleteNoteAsync(noteId: string | undefined) {
    if (!noteId) return
    const response = await deleteNoteByIdAsync(noteId)
    if (typeof response === 'string') { // Error occurred
      alert(response)
      return
    }
    reloadNotesAsync()
  }

  /** Updates state by fetching notes again */
  async function reloadNotesAsync() {
    const notes = await getNotesAsync()
    setNotes(notes)
  }

  /** Creates a new note from a form's data */
  function createNote(formData: any) {
    let noteContent = formData.get('note-content') as string
    noteContent = noteContent.trim()
    const importantFormValue = formData.get('note-important') as string | null
    let noteImportant = importantFormValue ? true : false
    const newNote: Note = { content: noteContent, important: noteImportant }

    addNote(newNote).then(response => {
      if (typeof response === 'string') {
        alert(response)
        return
      }
      reloadNotesAsync()
    })
  }

  return <>
    <button onClick={reloadNotesAsync}>Reload notes</button>

    <h2>Create note</h2>
    <form style={{ margin: '5px' }} action={createNote}>
      <label htmlFor="note-content">Content </label>
      <input type="text" id="note-content" name="note-content" /><br />
      <label htmlFor="note-important">Is important </label>
      <input type="checkbox" id="note-important" name="note-important" /><br />
      <button>Create note</button>
    </form>

    <h2>List of notes</h2>
    {notes.map(n => <NoteComp key={n.id} note={n} onDeleteNote={() => { handleDeleteNoteAsync(n.id) }} />)}
  </>
}

export default App