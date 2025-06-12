import axios from "axios";
import type { Note } from "./types";

// todo add actual type validation

/** Fetches all notes from the db */
export async function getNotesAsync(): Promise<Note[]> {
  const data = (await axios.get('api/notes')).data
  return data as Note[]
}

/** Fetches a note by id */
export async function getNoteByIdAsync(id: string): Promise<Note | string> {
  const data = (await axios.get(`api/notes/${id}`)).data
  if (data.error) return data.error as string
  return data as Note
}

/** Creates a new note */
export async function addNote(newNote: Note): Promise<Note | string> {
  const data = (await axios.post('api/notes', newNote)).data
  if (data.error) return data.error as string
  return data as Note
}

/** Deletes a note by id */
export async function deleteNoteByIdAsync(id: string): Promise<Note | string> {
  const data = (await axios.delete(`api/notes/${id}`)).data
  if (data.error) return data.error as string
  return data as Note
}