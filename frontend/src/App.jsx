import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ReservationGrid from './components/ReservationGrid'
import { setAuth } from './api'

export default function App() {
  const [logged, setLogged] = useState(false)
  const [credentials, setCredentials] = useState({ user: 'user', pass: 'password' })

  const handleLogin = (e) => {
    e.preventDefault()
    setAuth(credentials.user, credentials.pass)
    setLogged(true)
  }

  return (
    <div style={{ padding: 16 }}>
      {!logged ? (
        <div style={{ maxWidth: 420, margin: '30px auto' }}>
          <h2>Conectar ao backend</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 8 }}>
              <label>Usuário</label><br />
              <input value={credentials.user} onChange={e => setCredentials({...credentials, user: e.target.value})} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Senha</label><br />
              <input type="password" value={credentials.pass} onChange={e => setCredentials({...credentials, pass: e.target.value})} />
            </div>
            <button type="submit">Entrar</button>
          </form>
          <p style={{ marginTop: 12, color: '#666' }}>Use user / password (ou seus dados)</p>
        </div>
      ) : (
        <ReservationGrid />
      )}
    </div>
  )
}
