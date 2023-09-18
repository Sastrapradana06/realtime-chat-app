
import { useState, useEffect } from 'react'
import './App.css'
import io from 'socket.io-client'
import Chat from './components/chat/chat'

const socket = io.connect('api-realtime-chat-production.up.railway.app')

export default function App() {
  const [name, setName] = useState('')
  const [idRoom, setIdRoom] = useState('')
  const [isJoin, setIsJoin] = useState(false)
  const [erroMessage, setErrorMessage] = useState('')

  const dataProps = {
    socket,
    name,
    setIsJoin,
    idRoom
  }

  useEffect(() => {
    if(name == '' && idRoom == '') {
      const nameUser = localStorage.getItem('name')
      const idRoomUser = localStorage.getItem('idRoom')
      setName(JSON.parse(nameUser))
      setIdRoom(JSON.parse(idRoomUser))
    }
  }, [idRoom, name])

  async function joinToRoom() {
    if (name !== '' && idRoom !== '') {
      if (idRoom.length > 10) {
        setErrorMessage('Input Room Invalid')
        setTimeout(() => {
          setErrorMessage('')
        }, 3000)
        return
      }
      setIsJoin(true)
      await socket.emit('join_room', {name, idRoom})

      localStorage.setItem('name', JSON.stringify(name))
      localStorage.setItem('idRoom', JSON.stringify(idRoom))

    } else {
      setErrorMessage('Input Cannot Empty')
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }

  return (
    <div className="container">
      {!isJoin ? (
        <div className="header">
          <div className="top">
            <h1 className='judul'>Kuy Chat</h1>
            {erroMessage !== '' ? (
              <p className='error_message'>!!
                <span>{erroMessage}</span>
              </p>
            ) : null}
          </div>
          <div className="input_user">
            <input
              type="text"
              placeholder='username'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder='Room (max 10 huruf)'
              value={idRoom}
              onChange={(e) => setIdRoom(e.target.value)}
            />
            <button onClick={joinToRoom}>Join</button>
          </div>
        </div>
      ) : (
        <Chat dataProps={dataProps} />
      )}
    </div>
  )
}
