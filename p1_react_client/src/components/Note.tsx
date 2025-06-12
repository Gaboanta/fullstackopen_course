import type { Note } from "../types"

type NoteProps = {
  note: Note,
  onDeleteNote: () => void
}

/** A single note */
export default function NoteComp(p: NoteProps) {
  return <div style={{ padding: '5px', margin: '5px', border: 'black 1px solid' }}>
    <p>Content: {p.note.content}</p>
    <p>Important: {p.note.important ? 'yes' : 'no'}</p>
    <button onClick={p.onDeleteNote}>Delete note</button>
  </div>
}