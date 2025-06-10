import axios from "axios"
import { useEffect, useState } from "react"

function App() {
  const [notes, setNotes] = useState<any[]>([])

  // Set countries state by fetching
  useEffect(() => {
    axios.get('https://fullstackopen-course-backend.onrender.com/api/notes').then(response => {
      setNotes(response.data)
    })
  }, [])

  return <>
    {notes.map(n => <p key={n.id}>{n.text}</p>)}
  </>
}

export default App