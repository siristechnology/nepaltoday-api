import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import { ApolloProvider } from '@apollo/client';
import GraphqlClient from './graphql/graphql-client';

const app = (
    <ApolloProvider client={GraphqlClient}>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </ApolloProvider>
);

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
