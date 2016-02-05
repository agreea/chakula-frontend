var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var Home = require('./test-home.js'),
    App = require('./tac.js');
ReactDOM.render(
	<Router history={createBrowserHistory()} className="container-fluid">
		<Route component={App}>
			<Route name="Home" path="/home" component={Home}/>
	    </Route>
	</Router>, document.getElementById('test-app'));