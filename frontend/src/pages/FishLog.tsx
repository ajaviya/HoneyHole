import { useState, useEffect } from 'react'
import type { FishEntry } from '../types'

type FishLogProps = {
  userId: string | null
}


function FishLog({ userId }: FishLogProps) {
  const [entries, setEntries] = useState<FishEntry[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [rig, setRig] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [caughtAt, setCaughtAt] = useState<string>("")

  // Form state
  const [species, setSpecies] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [lengthIn, setLengthIn] = useState<string>("")
  const [weightLb, setWeightLb] = useState<string>("")
  const [bait, setBait] = useState<string>("")

  const fetchEntries = async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:8000/fish-entries/?user_id=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch entries")

      const data: FishEntry[] = await response.json()
      setEntries(data)
    } catch (err) {
      setError("Failed to load your catch fistory.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [userId])

  const handleSubmit = async () => {
    if (!species.trim() || !location.trim()) {
      setError("Species and location are required")
      return
    }

    try {
      const response = await fetch("http://localhost:8000/fish-entries/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          species: species.trim(),
          location: location.trim(),
          length_in: lengthIn ? parseFloat(lengthIn) : null,
          weight_lb: weightLb ? parseFloat(weightLb) : null,
          bait: bait.trim() || null
        })
      })
      if (!response.ok) throw new Error("Failed to create entry")

      setIsModalOpen(false)
      setSpecies("")
      setLocation("")
      setLengthIn("")
      setWeightLb("")
      setBait("")
      setError(null)
      await fetchEntries()

    } catch (err) {
      setError("Failed to save catch. Please try again.")
    }
  }

  return (
    <div>
      <h1>HoneyHole</h1>
      <button onClick={() => setIsModalOpen(true)}>Add Catch</button>

      {isLoading && <p>Loading your catches...</p>}
      {error && <p>{error}</p>}

      {!isLoading && entries.length === 0 && (
        <p>No catches yet. Add your first one!</p>
      )}

      {!isLoading && entries.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Species</th>
              <th>Location</th>
              <th>Length (in)</th>
              <th>Weight (lb)</th>
              <th>Bait</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.species}</td>
                <td>{entry.location}</td>
                <td>{entry.length_in ?? "—"}</td>
                <td>{entry.weight_lb ?? "—"}</td>
                <td>{entry.bait ?? "—"}</td>
                <td>{new Date(entry.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div>
          <div>
            <h2>Log a Catch</h2>

            <input
              type="text"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="Species (required)"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (required)"
            />
            <input
              type="number"
              value={lengthIn}
              onChange={(e) => setLengthIn(e.target.value)}
              placeholder="Length in inches (optional)"
            />
            <input
              type="number"
              value={weightLb}
              onChange={(e) => setWeightLb(e.target.value)}
              placeholder="Weight in lbs (optional)"
            />
            <input
              type="text"
              value={bait}
              onChange={(e) => setBait(e.target.value)}
              placeholder="Bait (optional)"
            />

            {error && <p>{error}</p>}

            <button onClick={handleSubmit}>Save Catch</button>
            <button onClick={() => {
              setIsModalOpen(false)
              setError(null)
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default FishLog