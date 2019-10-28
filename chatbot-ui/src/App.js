import React, { useState, useReducer } from 'react';
import './App.css';

function App() {

  const initMessages = initialMessages => {
    return initialMessages;
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'userMsg':
        return [
          ...state,
          {
            author: 'user',
            content: action.payload
          }
        ]
        break
      case 'sysMsg':
        return [
          ...state,
          {
            author: 'system',
            content: action.payload
          }
        ]
        break
      default:
        throw new Error();
    }
  }

  const initialMessages = [{author: 'system', content: 'test message 2 from system'}, {author: 'user', content: 'test message 2 from user'}]
  const [state, dispatch] = useReducer(reducer, initialMessages, initMessages);
  const [currentMessage, setCurrentMessage] = useState('')

  const showMessage = message => (
    <div className={`chatbox chatbox-${message.author}`}>
      <p>{message.content}</p>
    </div>
  )
  
  const respondFromSystem = () => {
    setTimeout(() => {
     dispatch({type: 'sysMsg', payload: 'test response from system'})
    }, 1000)
  }

  const writeUserMessage = async (currentMessage) => {
    await dispatch({type: 'userMsg', payload: currentMessage})
    respondFromSystem()
  }

  const handleSubmit = (event, currentMessage) => {
    event.preventDefault();

    writeUserMessage(currentMessage)
    setCurrentMessage('')
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>M&S Bank</h1>
      </header>
      <main>
        <section class="chat-area">
          {state.map(message => showMessage(message))}
        </section>

        <div className="message-author">
          <form name="" onSubmit={(event) => { handleSubmit(event, currentMessage) }} >
            <label for="message-input">Enter your message</label>
            <input id="message-input" type="text" value={currentMessage} onChange={(event) => {setCurrentMessage(event.target.value)}} />
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
