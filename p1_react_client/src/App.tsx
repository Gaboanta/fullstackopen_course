import axios from "axios"
import { useEffect, useState } from "react"

function App() {
  const [notes, setNotes] = useState<any[]>([])

  useEffect(() => {
    axios.get('/api/notes').then(response => {
      setNotes(response.data)
    })
  }, [])

  return <>
    {notes.map(n => <p key={n.id}>{n.text}</p>)}
  </>
}

export default App