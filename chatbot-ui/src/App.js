import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>M&S Bank</h1>
      </header>
      <main>
        <p>Lorem ipsum</p>
        <section class="chat-area">
          <div className="chatbox chatbox-ms">
            <p>Hello world</p>
          </div>
          <div className="chatbox chatbox-user">
            <p>Hello world user</p>
          </div>
        </section>

        <div className="message-author">
          <form name="">
            <label for="message-input">Enter your message</label>
            <input id="message-input" type="text" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
