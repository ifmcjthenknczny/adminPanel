import React, { Component } from 'react'
import axios from 'axios';
import User from './User.js'
import './Admin.css';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedUsers: [],
            users: []
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.updateCheckedUsers = this.updateCheckedUsers.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.deleteUsers = this.deleteUsers.bind(this);
        this.blockUsers = this.blockUsers.bind(this);
        this.unblockUsers = this.unblockUsers.bind(this);
    }
    componentDidMount() {
        this.loadData()
    }
    componentDidUpdate() {
        this.loadData()
    }

    checkIfAdmin() {
        const users = [...this.state.users];
        for (let user of users) if (user.username === this.props.loggedUser && user.active) return true
        return false
    }

    handleLogout(evt) {
        this.props.logoutFunction();
    }

    updateCheckedUsers(username) {
        const oldState = [...this.state.checkedUsers];
        let newState = [];
        if (oldState.includes(username)) newState = oldState.filter(u => u !== username);
        else newState = [...oldState, username];
        this.setState({ checkedUsers: newState });
    }

    selectAll() {
        const sourceState = document.querySelector('.main-checkbox').checked;
        const checkboxes = document.querySelectorAll('.form-check-input');
        for (let checkbox of checkboxes) checkbox.checked = sourceState;
        if (sourceState) this.setState({ checkedUsers: [...this.state.users].map(u => u.username) });
        else this.setState({ checkedUsers: [] })
    }

    async loadData() {
        const data = await axios.get(`http://localhost:5000/users`);
        this.setState({ users: data.data });
    }

    async deleteUsers() {
        await this.databaseRequest('delete');
    }

    async blockUsers() {
        await this.databaseRequest('ban');
    }

    async unblockUsers() {
        await this.databaseRequest('unban');
    }

    async databaseRequest(request) {
        if (!this.checkIfAdmin()) {
            this.handleLogout()
            return
        }
        const concernedUsers = [...this.state.checkedUsers];
        const urlTemplate = `http://localhost:5000/users/${request}`
        let requests;
        if (request === 'delete') requests = concernedUsers.map(u => axios.delete(`${urlTemplate}/${u}`));
        else if (['unban', 'ban', 'login'].includes(request)) requests = concernedUsers.map(u => axios.patch(`${urlTemplate}/${u}`));
        await Promise.all(requests);
        if (request === 'delete') this.setState({ checkedUsers: [...this.state.checkedUsers].filter(u => !concernedUsers.includes(u)) })
    }

    render() {
        const labels = ['Id','Username','e-mail','Last login','Registration time','Status']
        const labelsHTML = labels.map(e => <th>{e}</th>)
        const usersData = [...this.state.users].map(e => <User id={e._id} name={e.username} email={e.email} lastlogin={new Date(e.lastLogin).toLocaleString()} regtime={new Date(e.regTime).toLocaleString()} status={e.active ? "Active" : "Blocked"} checkboxEvent={this.updateCheckedUsers} />)

        return (
            <div className="Admin d-flex flex-column mt-4 justify-content-center">
                <span className="fs-1 mb-2 fw-bold">Admin panel</span>
                <button className="button__logout btn btn-light rounded mb-4 border-dark align-self-center" onClick={this.handleLogout}>Let me out!</button>
                <div className="buttons d-flex justify-content-around align-content-center mb-4 align-self-center">
                    <button type="button" className="btn button__delete btn-danger border border-dark rounded-pill" onClick={this.deleteUsers}>DELETE</button>
                    <i className="fa-solid fa-unlock-keyhole fs-3" onClick={this.unblockUsers}><span class="fs-6 info">Unblock</span></i>
                    <i className="fa-solid fa-ban fs-3 text-danger" onClick={this.blockUsers}><span class="fs-6 info">Block</span></i>
                </div>
                <table className="table">
                    <thead><tr>
                        <th><div className="form-check">
                            <input className="form-check-input main-checkbox" type="checkbox" value="" id="flexCheckDefault" onClick={this.selectAll} />
                    </div></th>
                    {labelsHTML}
                    </tr></thead>
                    <tbody>{usersData}</tbody>
                </table>
            </div>
        )
    }
}

export default Admin;