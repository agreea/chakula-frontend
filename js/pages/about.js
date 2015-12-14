var React = require('react');

module.exports = React.createClass({
    render: function() {
        return(
            <div id="about">
                <header className="about-intro">
                    <div className="intro-body">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1">
                                <h1>Amazing Homecooked Meals in DC.</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2">
                                <p className="intro-text">We are on a mission to build community over dinner tables.</p>
                            </div>
                        </div>
                    </div>
                </header>
                <section id="why" className="how container content-section text-center">
                    <h2>Why?</h2>
                    <div className="how-section row">
                        <div className="col-lg-8 col-lg-offset-2">
                            <p>Life can get so busy that sometimes we forgot to stop and taste the delicious food.</p>
                            <p><b>Chakula is out to fix that.</b></p>
                            <p>We want to bring homecooked group meals back into our lives. The food is awesome (we taste test every chef) and the you, the people, are even awesomer. Join the movement. Make magic with us.</p>
                        </div>
                    </div>
                </section>
                <section className="content-section text-center">
                    <div className="who-section">
                        <div className="container">
                            <div className="col-lg-8 col-lg-offset-2">
                                <h2>Who Are We?</h2>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <img className="prof-pic img-circle img-responsive" src="img/prof-agree.jpg" />
                                        <p>Agree</p>
                                    </div>
                                    <div className="col-lg-4">
                                        <img className="prof-pic img-circle img-responsive" src="img/prof-pat.jpg" />
                                        <p>Pat</p>
                                    </div>
                                    <div className="col-lg-4">
                                        <img className="prof-pic img-circle img-responsive" src="img/prof-ross.jpg" />
                                        <p>Ross</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <p>We are 3 friends (2 Hoyas, 1 Jumbo) who love to cook and love to host. Combined, we have hosted well over 70 large Sunday dinners for friends and acquaintances. Now we want to show the world what happens when amazing people connect over an amazing meal, starting with Georgetown.</p>
                                </div>
                            </div>
                        </div>
                        </div>
                </section>
                <section id="contact" className="contact container content-section text-center">
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2">
                            <h2>Say Hi!</h2>
                            <p>Feel free to email us about anything</p>
                            <p><a href="mailto:agree@yaychakula.com">agree@yaychakula.com</a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
});
