import React, { Component } from 'react'
import Admin from './Admin.js';
import Login from './Login.js';
import './Page.css';

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedUser: null,
            registerWindow: false
        }
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this.toggleLoginRegister = this.toggleLoginRegister.bind(this);
    }
    logIn(username) {
        this.setState({ loggedUser: username })
    }
    logOut() {
        this.setState({ loggedUser: null })
    }
    toggleLoginRegister() {
        const newValue = !this.state.registerWindow
        this.setState({registerWindow: newValue})
    }
    render() {
        return (
            <div className="Page d-flex align-content-center justify-content-center">
                {this.state.loggedUser !== null ? <Admin loggedUser={this.state.loggedUser} logoutFunction={this.logOut} /> : <Login logInFunction={this.logIn} toggleFunction={this.toggleLoginRegister} register={this.state.registerWindow} />}
            </div>
        )
    }
}

export default Page;