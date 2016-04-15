const React = require( 'react' );
const ReactDom = require( 'react-dom' );

const ReactRouter = require( 'react-router' );
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
// const Navigation = ReactRouter.Navigation; // mixin
const History = ReactRouter.History;

const createBrowserHistory = require('history/lib/createBrowserHistory');

const h = require('./helpers');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://popping-fire-7031.firebaseio.com/');

/*
    App
*/
var App = React.createClass({
    getInitialState() {
        return {
            fishes: {},
            order: {}
        };
    },
    componentDidMount() {
        base.syncState( this.props.params.storeId + '/fishes', {
            context: this,
            state: 'fishes'
        } );
    },
    addToOrder(key) {
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({ order: this.state.order });
    },
    addFish( fish ) {
        var timestamp = (new Date()).getTime();

        this.state.fishes[ 'fish-' + timestamp ] = fish;

        this.setState({ fishes: this.state.fishes });
    },
    loadSamples() {
        this.setState({
            fishes: require('./sample-fishes')
        });
    },
    renderFish(key) {
        return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>;
    },
    render () {
        return(
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes).map(this.renderFish)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order}/>
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
            </div>
        );
    }
});

/*
    Fish
*/
const Fish = React.createClass({
    onButtonClick(){
        var key = this.props.index;
        this.props.addToOrder(key);
    },
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
});

/*
    Add Fish Form
*/
const AddFishForm = React.createClass({
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
    },
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
});

/*
    Header
*/
var Header = React.createClass({
    render() {
        return(
            <header className="top">
                <h1>
                    Catch
                    <span className="ofThe">
                        <span className="of">of</span>
                        <span className="the">the</span>
                    </span>
                    Day
                </h1>
                <h3 className="tagline">
                    <span>{this.props.tagline}</span>
                </h3>
            </header>
        );
    }
});

/*
    Order
*/
var Order = React.createClass({
    renderOrder(key) {
        var fish = this.props.fishes[key];
        var count = this.props.order[key];

        if(!fish)
        return <li key={key}>Sorry, fish no longer available!</li>;

        return (
            <li>
                {count}lbs {fish.name}
                <span className="price">
                    {h.formatPrice(count * fish.price)}
                </span>
            </li>
        );
    },
    render() {
        var orderIds = Object.keys(this.props.order);
        var total = orderIds.reduce( ( prevTotal, key ) => {
            var fish = this.props.fishes[key];
            var count = this.props.order[key];
            var isAvailable = fish && fish.status === 'available';

            if (fish && isAvailable) {
                return prevTotal + (count * parseInt(fish.price) || 0);
            }

            return prevTotal;
        }, 0);

        return(
            <div className="order-wrap">
                <h2 className="order-title">Your Order</h2>
                <ul className="order">
                    {orderIds.map(this.renderOrder)}
                    <li className="total">
                        <strong>Total:</strong>
                        {h.formatPrice(total)}
                    </li>
                </ul>
            </div>
        );
    }
});

/*
    Inventory
*/
var Inventory = React.createClass({
    render() {
        return(
            <div>
                <h2>Inventory</h2>
                <AddFishForm {...this.props} />
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        );
    }
});

/*
    StorePicker
*/
var StorePicker = React.createClass( {
    mixins: [History],
    goToSore(e) {
        e.preventDefault();
        // get the data from the input
        const storeId = this.refs.storeId.value;

        // transition from StorePicker to App
        this.history.pushState(null, '/store/' + storeId);
    },
    render() {
        return (
            <form className="store-selector" onSubmit={this.goToSore}>
                <h2>Please Enter a Store</h2>
                <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
                <input type="submit" />
            </form>
        );
    }

});

/*
    Not Found
*/
const NotFound = React.createClass({
    render() {
        return <h1>404 Not Found!</h1>;
    }
});


/*
    Routes
*/
const routes = (
    <Router history={createBrowserHistory()}>
        <Route path="/" component={StorePicker} />
        <Route path="/store/:storeId" component={App} />
        <Route path="/store/:storeId" component={App} />
        <Route path="/*" component={NotFound} />
    </Router>
);


ReactDom.render( routes, document.querySelector( '#main' ) );
