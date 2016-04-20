/*
    Add Fish Form
*/

import React from 'react';

export default class AddFishForm extends React.Component {
    createFish(e) {
        e.preventDefault();

        const fish = {
            name: this.refs.name.value,
            price: this.refs.price.value,
            status: this.refs.status.value,
            desc: this.refs.desc.value,
            image:this.refs.image.value
        };

        this.props.addFish(fish);
        this.refs.fishForm.reset();
    }
    render() {
        return (
            <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
                <input type="text" ref="name" placeholder="Fish Name"/>
                <input type="text" ref="price" placeholder="Fish Price"/>
                <select ref="status">
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea type="text" ref="desc" placeholder="Desc"></textarea>
                <input type="text" ref="image" placeholde="URL to Image" />
                <button type="submit">+ Add Fish</button>
            </form>
        );
    }
}
