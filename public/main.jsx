// main.jsx
const React = require('react');
const ReactDOM = require('react-dom');

const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const authentication = require('feathers-authentication/client');
const socket = require('socket.io-client')();

import ChatApp from './views/Chat/ChatApp';

const app = feathers()
    .configure(socketio(socket))
    .configure(hooks())
    // Use localStorage to store our login token
    .configure(authentication({
        storage: window.localStorage
    }));

app.authenticate().then(() => {
    ReactDOM.render(<div id="app" className="flex flex-column">
        <header className="title-bar flex flex-row flex-center">
            <div className="title-wrapper block center-element">
                <img className="logo" src="http://feathersjs.com/img/feathers-logo-wide.png"
                     alt="Feathers Logo" />
                <span className="title">Chat</span>
            </div>
        </header>

        <ChatApp />
    </div>, document.getElementById('container'));
}).catch(error => {
    if(error.code === 401) {
        window.location.href = '/login.html'
    }

    console.error(error);
});
