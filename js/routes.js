var ReactRouter = require('react-router'),
    Route = require('react-router').Route,
    App = require('./pages/app.js'),
    // Home = require('./pages/home.js'),
    // Meal = require('./pages/meal.js'),
    // CreateMeal = require('./pages/create_meal.js'),
    // MyMeals = require('./pages/my_meals.js'),
    // EditChef = require('./pages/edit_chef.js'),
    // ToS = require('./pages/tos.js'),
    WhyChakula = require('./pages/why_chakula.js'), // done
    About = require('./pages/about.js'); // done
    // NotFound = require('./pages/about.js');
module.exports = 
    (<Route path="/" component={App}>
        <Route name="About" path="about" component={About}/>
        <Route name="Why Chakula" path="why_chakula" component={WhyChakula} />
    </Route>);
// module.exports = (<ReactRouter.Route handler={App}>
//         <ReactRouter.Route name="About" path="/about" handler={About} />
//         <ReactRouter.Route name="Why Chakula" path="/why_chakula" handler={WhyChakula} />
//     </ReactRouter.Route>);


/*
*/
/*
        <ReactRouter.Route name="Meal" path="/meal" handler={Meal} />
        <ReactRouter.Route name="Create Meal" path="/sheet/:sheet_id" handler={Sheets} />
        <ReactRouter.Route name="My Meals" path="/my_meals" handler={MyMeals} />
        <ReactRouter.Route name="Edit Chef Info" path="/edit_chef" handler={EditChef} />
        <ReactRouter.Route name="ToS" path="/terms_of_service" handler={ToS} />
        <ReactRouter.Route name="Category Explorer" path="/category/:categoryId" handler={CategoryExplorer} />
        <ReactRouter.Route name="404" path="/404" handler={NotFound} />
        <ReactRouter.Route name="Home" path="/" handler={Home} />
        <ReactRouter.NotFoundRoute handler={NotFound} />


*/