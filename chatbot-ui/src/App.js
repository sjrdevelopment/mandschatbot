import React, { useState, useReducer, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
 
import './App.css';

import Button from './components/button/button';
import Logo from './components/logo/Logo';

function App({exampleSocket}) {

  const anchor = useRef(null);

  const initMessages = initialMessages => {
    return [{
      author: 'system',
      content: 'Hi how can i help?',
    }];
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

  const [state, dispatch] = useReducer(reducer, [], initMessages);
  const [currentMessage, setCurrentMessage] = useState('')
  const [isMaskedFlag, setIsMaskedFlag] = useState(false)

  exampleSocket.onopen = function (event) {
    console.log('opened socket')
  };

  exampleSocket.onmessage = function (event) {
    console.log(event.data);
    
    dispatch({type: 'sysMsg', payload: event.data})
    
    anchor.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    if (event.data.includes('pin') || event.data.includes('password')) {
      setIsMaskedFlag(true)
    } else {
      setIsMaskedFlag(false)
    }
  }

  const showMessage = message => {
    let buttons = []

    try {
      const content = JSON.parse(message.content)
      buttons = content.buttons
      
      return (
        <div className={`chatbox chatbox-${message.author}`}>
          <ReactMarkdown source={content.title} />
  
          {buttons.map(item => (
            <button>{item.text}</button>
          ))}
        </div>
      )

    } catch (error) {
    }

    
    return (
      <div className={`chatbox chatbox-${message.author}`}>
        <ReactMarkdown source={message.content} />

      </div>
    )
  }

  const writeUserMessage = async (currentMessage) => {
    if (currentMessage !== '') {
      exampleSocket.send(currentMessage); 
    
      if (isMaskedFlag) {
        currentMessage = '&ast;&ast;&ast;&ast;&ast;&ast;';
      }

      await dispatch({type: 'userMsg', payload: currentMessage})
    }
  }

  const handleSubmit = (event, currentMessage) => {
    event.preventDefault();

    writeUserMessage(currentMessage)
    setCurrentMessage('')
  }

  return (
    <div className="App">
      <header className="App-header">
        <Logo />
      </header>
      <main>
        <section className="chat-area">
          {state.map(message => showMessage(message))}
          <span ref={anchor} />
        </section>

        <div className="message-author">
          <form name="" onSubmit={(event) => { handleSubmit(event, currentMessage) }} >
            <span className="subBtn"><Button onClick={(event) => { handleSubmit(event, currentMessage) }}>Send</Button></span>
            <input className="msgInput" id="message-input" type="text" placeholder="Ask me anything" value={currentMessage} onChange={(event) => {setCurrentMessage(event.target.value)}} />
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
