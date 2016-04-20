/*
    Routes
*/

import React from 'react';
import ReactDom from 'react-dom';

import { Router, Route } from 'react-router';
import { createHistory } from 'history';

import StorePicker from './StorePicker';
import App from './App';
import NotFound from './NotFound';

const routes = (
    <Router history={createHistory()}>
        <Route path="/" component={StorePicker} />
        <Route path="/store/:storeId" component={App} />
        <Route path="/store/:storeId" component={App} />
        <Route path="/*" component={NotFound} />
    </Router>
);


ReactDom.render( routes, document.querySelector( '#main' ) );

export default routes;
