var React = require('react'),
    Link = require('react-router').Link,
    ProfImg = require('../prof_img.js');
  var guest;
  var NavBar = React.createClass({
      componentWillMount: function() {
        console.log("componentWillMount");
        if (!Cookies.get("session"))
          return;
        console.log("Made it past cookies check")
        this.getGuest();
      },
      componentWillUpdate: function() {
        console.log("componentWillUpdate");
        if (!this.state.guest && Cookies.get("session"))
          this.getGuest();
      },
      getGuest: function() {
        var api_resp = 
          api_call('kitchenuser', {method: 'Get', session: Cookies.get("session")});
        if (api_resp.Success)
          this.setState({guest: api_resp.Return});       
      },
      signout: function() {
        Cookies.remove('session');
        location.reload();
      },
      getInitialState: function() {
        return ({guest: null});
      },
      render: function() {
        var guest = this.state.guest;
        var right_nav,
            user_tab,
            host_tab;
        var host_tab = 
          <li className="nav-item">
            <Link className="nav-item-content" 
                  to={(Cookies.get("session"))? "/edit_host_info" : "/why_chakula"}
                  id="be-a-chef">
              <button className="c-blue-bg">Become a Chef</button>
            </Link>
          </li>,
            user_tab = 
              <li id="signin"> 
                <Link to="login?fwd=/">
                  <span className="nav-text">Sign In</span>
                  <img className="img-responsive nav-icon" alt="Brand" src="/img/user-icon.svg" align="right" />
                </Link>
              </li>;
        if (guest) {
          user_tab = 
            (<li id="user" className="dropdown">
              <button className="btn dropdown-toggle" type="button" id="user-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span className="nav-text">{guest.First_name}</span>
                <div align="right">
                  <ProfImg alt="Brand" src={guest.Prof_pic || "/img/user-icon.svg"} />
                </div>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <li><Link to="/edit_guest_info">My Profile</Link></li>
                <li><a onClick={this.signout}>Signout</a></li>
              </ul>
            </li>);
          if (guest.Is_host) {
            host_tab = 
              (<li className="nav-item">
                <Link className="nav-item-content" to="/my_meals">
                  <span>Host</span>
                    <img className="img-responsive nav-icon" src="/img/host-icon.svg"/>
                </Link>
                    </li>);
          }
        }
        right_nav = 
          (<ul className="nav navbar-right">
            {host_tab}
            {user_tab} 
          </ul>);
        return(
          <nav className="navbar navbar-default navbar-static-top">
            <div className="container-fluid">
              <div className="navbar-header">
                <Link className="navbar-brand" id="navbar-brand" to="/">
                  <img className="img-responsive nav-icon" alt="Brand" src="/img/chakula_icon.svg" align="left" />
                </Link>
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false" align="right">                
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                {right_nav}
              </div>
            </div>
          </nav>
        );
      }
    });

module.exports = React.createClass({
  renderFooter: function() {
    return(
      <div className="row">
        <footer className="col-xs-12">
          <div className="row">
            <div className="col-xs-6 col-xs-offset-3">
              <p><Link to="/about">About</Link></p>
              <p><a href="/privacy.html">Privacy</a></p>
              <div className="text-center">
                <p>Copyright © Chakula 2015</p>
                <p>717 Newton Pl NW, Washington DC</p>
              </div>
            </div>
          </div>
        </footer>
      </div>);
  },
  render: function() {
    return(
      <div className="container-fluid">
        <div className="row" id="app-body">
          <NavBar/>
          {this.props.children}
        </div>
        <div id="js-working">
        </div>
      </div>);
    }
});
