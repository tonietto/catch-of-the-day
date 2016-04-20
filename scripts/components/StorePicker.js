/*
    StorePicker
*/

import React from 'react';
import { History } from 'react-router';
import h from '../helpers';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

export default class StorePicker extends React.Component {
    @autobind
    goToSore(e) {
        e.preventDefault();
        // get the data from the input
        const storeId = this.refs.storeId.value;

        // transition from StorePicker to App
        this.history.pushState(null, '/store/' + storeId);
    }

    render() {
        return (
            <form className="store-selector" onSubmit={this.goToSore}>
                <h2>Please Enter a Store</h2>
                <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
                <input type="submit" />
            </form>
        );
    }
}

reactMixin.onClass(StorePicker, History);
