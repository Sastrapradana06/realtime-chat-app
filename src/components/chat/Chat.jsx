import { useEffect, useState } from 'react'
import './Chat.css'
import ScrollToBottom from 'react-scroll-to-bottom'
import PropTypes from 'prop-types'
function Chat({ dataProps }) {
  const [myMessage, setMyMessage] = useState('')
  const [allMessageList, setAllMessageList] = useState([])
  const [userRoom, setUserRoom] = useState('')
  const [nameJoin, setNameJoin] = useState('')
  const [nameClose, setNameClose] = useState('')
  const [userIsTyping, setUserIsTyping] = useState('')

  useEffect(() => {

    if(myMessage != '') {
      const userDataTyping = { name: dataProps.name, idRoom: dataProps.idRoom }
      dataProps.socket.emit('typing', userDataTyping)
    } else {
      dataProps.socket.emit('typing', {name: '', idRoom: dataProps.idRoom})
    }

    dataProps.socket.on('receive_message', (data) => {
      setAllMessageList(data)
    })

    dataProps.socket.on('joined', (data) => {
      setAllMessageList(data.message)
      setNameJoin(data.name)
      setTimeout(() => {
        setNameJoin('')
      }, 3000)
    })

    dataProps.socket.on('userCount', (data) => {
      const { name, countRoom } = data
      setUserRoom(countRoom)
      setNameClose(name)
      setTimeout(() => {
        setNameClose('')
      }, 2000)
    })

    dataProps.socket.on('user_typing', (data) => {
      setUserIsTyping(data)
    })


  }, [dataProps.socket, allMessageList, dataProps.idRoom, dataProps.name, myMessage])


  async function handleSubmit(e) {
    e.preventDefault()
    if (myMessage !== '') {
      const messageData = {
        id: Math.floor(Math.random() * 1000),
        room: dataProps.idRoom,
        author: dataProps.name,
        message: myMessage,
        time:
          new Date(Date.now()).getHours()
          + ':' +
          new Date(Date.now()).getMinutes()
      }
      await dataProps.socket.emit('message', messageData)
      setAllMessageList((msg) => [...msg, messageData])
      setMyMessage('')
    }
  }

  function closeRoom() {
    const userClose = { name: dataProps.name, idRoom: dataProps.idRoom }
    dataProps.socket.emit('close', userClose)
    dataProps.setIsJoin(false)
  }


  return (
    <div className="container_chat">
      {nameJoin !== '' && (
        <div className="notif_join">
          <p>{nameJoin} Join Room</p>
        </div>
      )}
      {nameClose !== '' && (
        <div className="notif_close">
          <p>{nameClose} Close Room</p>
        </div>
      )}
      <div className="header_chat">
        <div className="info_room">
          <p className='user_count'>User: <span>{userRoom}</span></p>
          <h1 className='id_room'>{dataProps.idRoom}</h1>
          <button onClick={closeRoom} className='btn_close'>Close</button>
        </div>
        {userIsTyping !== '' ? (
          <div className="typing">
            <p className='text_typing'>{userIsTyping} Is Typing</p>
          </div>
        ): null}
      </div>
      <div className="chat">
        <ScrollToBottom className="message">
          <div className="chat_body">
            {allMessageList.map((data) => {
              return (
                <div className="card_client" key={data.id} id={data.author == dataProps.name ? 'client' : 'you'}>
                  <div className="chat_content">
                    <p className='text_chat'>{data.message}</p>
                    <div className="detail_client">
                      <p className='name_client'>{data.author == dataProps.name ? 'me' : data.author}</p>
                      <p className='time_client'>{data.time}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollToBottom>
        <div className="input_chat">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder='hai...'
              value={myMessage}
              onChange={(e) => setMyMessage(e.target.value)}
            />
            <button type='submit'>Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}

Chat.propTypes = {
  dataProps: PropTypes.any
}

export default Chat

