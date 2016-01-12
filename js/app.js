var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var App = require('./pages/app.js'),
    // Home = require('./pages/home.js'),
    // Meal = require('./pages/meal.js'),
    // CreateMeal = require('./pages/create_meal.js'),
    // MyMeals = require('./pages/my_meals.js'),
    // EditChef = require('./pages/edit_chef.js'),
    // ToS = require('./pages/tos.js'),
    Home = require('./pages/home.js')
    WhyChakula = require('./pages/why_chakula.js'), // done
    About = require('./pages/about.js'),
    EditHost = require('./pages/edit_host_info.js'),
    EditGuest = require('./pages/edit_guest_profile.js'),
    Meal = require('./pages/meal.js'),
    MyMeals = require('./pages/my_meals.js'),
    CreateMeal = require('./pages/create_meal.js'),
    Login = require('./pages/login.js'),
    Chef = require('./pages/chef.js'),
    AccountSetUp = require('./pages/account_setup.js'),
    ConfirmEmail = require('./pages/confirm_email.js'); // done
ReactDOM.render(
	<Router history={createBrowserHistory()} className="container-fluid">
		<Route component={App}>
			<Route name="Home" path="/" component={Home}/>
			<Route name="Edit Host Info" path="edit_host_info" component={EditHost}/>
            <Route name="Edit Guest Info" path="edit_guest_info" component={EditGuest}/>
	        <Route name="About" path="about" component={About}/>
	        <Route name="Why Chakula" path="why_chakula" component={WhyChakula}/>
	        <Route name="Meal" path="meal/:id" component={Meal}/>
            <Route name="My Meals" path="my_meals" component={MyMeals}/>
            <Route name="Create a Meal" path="create_meal/(:id)" component={CreateMeal}/>
            <Route name="Login/Sign Up" path="login" component={Login}/>
            <Route name="Chef" path="chef/:id" component={Chef}/>
            <Route name="Account Setup" path="account_setup" component={AccountSetUp}/>
            <Route name="Confirm Email" path="confirm_email" component={ConfirmEmail}/>
	    </Route>
	</Router>, document.getElementById('app'));