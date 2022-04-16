import React, { Component } from 'react'

class User extends Component {
    constructor(props) {
        super(props);
        this.handleCheck = this.handleCheck.bind(this);
    }
    handleCheck() {
        this.props.checkboxEvent(this.props.name);
    }
    render() {
        const props = this.props;
        return (
            <tr className="User">
                <td><div className="form-check">
                    <input className="form-check-input" onClick={this.handleCheck} type="checkbox" />
                </div></td>
                <td>{props.id}</td>
                <td>{props.name}</td>
                <td>{props.email}</td>
                <td>{props.lastlogin}</td>
                <td>{props.regtime}</td>
                <td>{props.status}</td>
            </tr>
        )
    }
}

export default User;