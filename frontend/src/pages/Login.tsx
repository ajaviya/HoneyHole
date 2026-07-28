import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../types'

type LoginProps = {
  onLogin: (userId: string) => void
}

function Login({ onLogin }: LoginProps) {
  const [isNewUser, setIsNewUser] = useState<boolean>(false)
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSignIn = async () => {
    if (username.trim() === "") return

    try {
      const response = await fetch(`http://localhost:8000/users/?username=${username}`)
      if (!response.ok) throw new Error("Request failed")

      const users: User[] = await response.json()

      if (users.length === 0) {
        setError("No account found with that username. Create one below.")
        return
      }

      onLogin(users[0].id)
      navigate('/log')

    } catch (err) {
      setError("Something went wrong. Please try again.")
    }
  }

  const handleCreate = async () => {
    if (username.trim() === "" || email.trim() === "" || firstName.trim() === "" || lastName.trim() === "") {
      setError("All fields are required.")
      return
    }

    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          first_name: firstName,
          last_name: lastName
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to create account.")
        return
      }

      const newUser: User = await response.json()
      onLogin(newUser.id)
      navigate('/log')

    } catch (err) {
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div>
      <h1>HoneyHole</h1>
      <h2>{isNewUser ? "Create Account" : "Sign In"}</h2>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />

      {isNewUser && (
        <>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </>
      )}

      <button onClick={isNewUser ? handleCreate : handleSignIn}>
        {isNewUser ? "Create Account" : "Sign In"}
      </button>

      {error && <p>{error}</p>}

      <p>
        {isNewUser ? "Already have an account? " : "New here? "}
        <span
          onClick={() => { setIsNewUser(!isNewUser); setError(null) }}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {isNewUser ? "Sign In" : "Create Account"}
        </span>
      </p>

    </div>
  )
}

export default Login