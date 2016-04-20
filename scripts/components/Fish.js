/*
    Fish
*/
import React from 'react';
import h from '../helpers';

export default class Fish extends React.Component{
    onButtonClick(){
        var key = this.props.index;
        this.props.addToOrder(key);
    }
    render(){
        const details = this.props.details;
        var isAvailable = (details.status === 'available' && true);
        var buttonText = (isAvailable ? 'Add to Order' : 'Sold Out!');

        return (
            <li className="menu-fish">
                <img src={details.image} alt={details.name} />
                <h3 className="fish-name">
                    {details.name}
                    <span className="price">
                        {h.formatPrice(details.price)}
                    </span>
                </h3>
                <p>{details.desc}</p>
                <button disabled={!isAvailable} onClick={this.onButtonClick}>
                    {buttonText}
                </button>
            </li>
        );
    }
}
