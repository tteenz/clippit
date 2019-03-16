import React, { Component } from "react";
import 'whatwg-fetch';
import { Form, Button, Image } from 'react-bootstrap';

// import axios from "axios";

import {
    getFromStorage,
    setInStorage,
} from '../utils/storage';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            token: '',
            signUpError: '',
            signInError: '',
            signInEmail: '',
            signInPassword: '',
            signUpFirstName: '',
            signUpLastName: '',
            signUpEmail: '',
            signUpPassword: '',
        };

        this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
        this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
        this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
        this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
        this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
        this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);

        this.onSignIn = this.onSignIn.bind(this);
        this.onSignUp = this.onSignUp.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        const obj = getFromStorage('the_main_app');
        if (obj && obj.token) {
            const { token } = obj;
            //verify token
            fetch('/api/account/verify?token=' + token)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token,
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                        });
                    }
                });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    onTextboxChangeSignInEmail(event) {
        this.setState({
            signInEmail: event.target.value,
        });
    }

    onTextboxChangeSignInPassword(event) {
        this.setState({
            signInPassword: event.target.value,
        });
    }

    onTextboxChangeSignUpEmail(event) {
        this.setState({
            signUpEmail: event.target.value,
        });
    }

    onTextboxChangeSignUpPassword(event) {
        this.setState({
            signUpPassword: event.target.value,
        });
    }

    onTextboxChangeSignUpFirstName(event) {
        this.setState({
            signUpFirstName: event.target.value,
        });
    }

    onTextboxChangeSignUpLastName(event) {
        this.setState({
            signUpLastName: event.target.value,
        });
    }

    onSignUp() {
        // grab state
        const {
            signUpFirstName,
            signUpLastName,
            signUpEmail,
            signUpPassword
        } = this.state;

        this.setState({
            isloading: true,
        })
        // Post request to backend
        fetch("/api/auth/account/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            firstName: signUpFirstName,
            lastName: signUpLastName,
            email: signUpEmail,
            password: signUpPassword
          })
        })
          .then(res => res.json())
          .then(json => {
            if (json.success) {
              this.setState({
                signUpError: json.message,
                isLoading: false,
                signUpEmail: "",
                signUpPassword: "",
                signUpFirstName: "",
                signUpLastName: ""
              });
            } else {
              this.setState({
                signUpError: json.message,
                isLoading: false
              });
            }
          });
    }

    onSignIn() {
        // grab state
        const {
            signInEmail,
            signInPassword,
        } = this.state;

        this.setState({
            isloading: true,
        })
        // Post request to backend
        fetch('/api/auth/account/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: signInEmail,
                password: signInPassword,
            }),
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    setInStorage('the_main_app', { token: json.token });
                    this.setState({
                        signUpError: json.message,
                        isLoading: false,
                        signInPassword: '',
                        signInEmail: '',
                        token: json.token,
                    });
                } else {
                    this.setState({
                        signInError: json.message,
                        isLoading: false,
                    });
                }
            });
    }

    logout() {
        this.setState({
            isLoading: true,
        });
        const obj = getFromStorage('the_main_app');
        if (obj && obj.token) {
            const { token } = obj;
            //verify token
            fetch('/api/auth/account/logout?token=' + token)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token: '',
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                        });
                    }
                });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    render() {
        const {
            isLoading,
            token,
            signInError,
            signInEmail,
            signInPassword,
            signUpEmail,
            signUpPassword,
            signUpError,
            signUpFirstName,
            signUpLastName,
        } = this.state;
        if (isLoading) {
            return (<div><p>Loading...</p></div>);
        }
        if (!token) {
            return (
                <div className="container">
                <Image src="https://3.bp.blogspot.com/-cZmcCEh4p1g/XIXiykcuCTI/AAAAAAAAAHY/TWLoJ2f2Umw7Tm6JgAh20XgFkVzl0EKnwCLcBGAs/s1600/Login%2BBanner.jpg" fluid />
                <br></br>
                    <div>
                        {
                            (signInError) ? (
                                <p>{signInError}</p>
                            ) : (null)
                        }
                        <Form>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email" 
                            value={signInEmail}
                            onChange={this.onTextboxChangeSignInEmail}
                        />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password" 
                            value={signInPassword}
                            onChange={this.onTextboxChangeSignInPassword}
                        />
                        </Form.Group>
                        <Button variant="outline-dark" type="submit" onClick={this.onSignIn} href="/home">Login</Button>
                        </Form>
                    </div>
                    <br />
                    <h6 style={{textAlign: "center"}}>Don't have an account? No worries, you can make one below.</h6>
                    <div>
                        {
                            (signUpError) ? (
                                <p>{signUpError}</p>
                            ) : (null)
                        }
                        <Form>
                        <Form.Group controlId="formBasicFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="First Name" 
                            value={signUpFirstName}
                            onChange={this.onTextboxChangeSignUpFirstName}
                        />
                        </Form.Group>
                        <Form.Group controlId="formBasicLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Last Name" 
                            value={signUpLastName}
                            onChange={this.onTextboxChangeSignUpLastName}
                        />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Email" 
                            value={signUpEmail}
                            onChange={this.onTextboxChangeSignUpEmail}
                        />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password" 
                            value={signUpPassword}
                            onChange={this.onTextboxChangeSignUpPassword}
                        />
                        </Form.Group>

                        <Button variant="outline-dark" type="submit" onClick={this.onSignUp} href="/home">Sign Up</Button>
                        </Form>
                        <br></br>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <p>Signed in</p>
                <button onClick={this.logout}>Logout</button>
            </div>
        );
    }
}
export default Home;
