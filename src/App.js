import React from 'react';
import ReactDOM from 'react-dom';
import Chat from './containers/Chat';

const App = () => {

        return (
            <div className="container">
                <Chat/>
            </div>
        ) 
}



ReactDOM.render(<App />, document.getElementById("root"));

if (module.hot) {
    module.hot.accept();
}