import React, {
    Component
} from 'react'
import './Login.css'
import { validateEmail } from './helpers.js'
import axios from 'axios'

class Login extends Component {
    constructor(props) {
        super(props)
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleFocus = this.handleFocus.bind(this);

        this.state = {
            alert: ''
        }
    }

    async handleRegister(evt) {
        evt.preventDefault();
        const username = document.querySelector("input#username").value;
        const mail = document.querySelector("input#email").value;
        const password = document.querySelector("input#password").value;
        const reservedWords = ['add', 'update', 'delete', 'login', 'unblock', 'block', 'ban', 'unban']
        if (username.length === 0) {
            this.setState({ alert: "Enter your username." })
            return
        }
        if (reservedWords.includes(username)) {
            this.setState({ alert: "This is reserved server word, try again." })
            return
        }
        if (!validateEmail(mail)) {
            this.setState({ alert: "This is not a valid email address." })
            return
        }
        if (password.length === 0) {
            this.setState({ alert: "Enter at least one character as your password." })
            return
        }
        const user = {
            username: username,
            email: mail,
            lastLogin: null,
            regTime: Date.now(),
            active: true,
            password: password
        }
        let exists = false;
        await axios.get(`http://localhost:5000/users/${username}`).then((res) => { if (!!res.data) { exists = true; this.setState({ alert: "User already exists!" }) } })
        if (exists) return

        this.setState({ alert: `Successfully registered user ${username}!` })
        await axios.post('http://localhost:5000/users/add', user);
    }

    async handleLogin(evt) {
        evt.preventDefault();
        const username = document.querySelector("input#username").value;
        const password = document.querySelector("input#password").value;
        if (username.length === 0) {
            this.setState({ alert: "Enter your username." })
            return
        }
        if (password.length === 0) {
            this.setState({ alert: "Enter your password." })
            return
        }
        let dbPass = '';
        let active = true;
        await axios.get(`http://localhost:5000/users/${username}`).then(res => { dbPass = res.data.password; active = res.data.active }).catch(err => { console.log(err.message) });
        if (!active) {
            this.setState({ alert: "User is blocked!" })
            return
        }
        if (password !== dbPass) {
            this.setState({ alert: "Username and password don't match!" })
            return
        }
        const url = `http://localhost:5000/users/login/${username}`;
        await axios.patch(url, { lastLogin: Date.now() });
        this.props.logInFunction(username);
    }

    handleToggleClick(evt) {
        this.props.toggleFunction();
    }

    handleFocus(evt) {
        this.setState({ alert: '' });
    }

    render() {
        const submitButtonText = this.props.register ? "Register me!" : "Log me in!"
        const switchButtonText = this.props.register ? "Take me to login!" : " I want to register!"
        return (<div className="Register d-flex flex-column mt-4" >
            <button className="button__switch border-dark btn btn-light rounded mb-2" onClick={
                this.handleToggleClick}> {switchButtonText} </button>
            <input type="text" id="username" className="username" placeholder="username" onFocus={this.handleFocus} />
            {this.props.register ? <input type="text" id="email" className="email" placeholder="e-mail address" onFocus={this.handleFocus} /> : ''}
            <input type="password" id="password" className="password" placeholder="password" onFocus={this.handleFocus} />
            <button className="button__submit btn btn-dark rounded" type="submit" onClick={this.props.register ? this.handleRegister : this.handleLogin}>
                {submitButtonText}
            </button>
            <span className="mt-5 alert fs-3">{this.state.alert}</span>
        </div>)
    }
}

export default Login