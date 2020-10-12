import React from "react";
import Styles from "./Login.module.scss";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            register_res: '',
            login_res: '',
            lemail: '',
            lpassword: ''
        };
        if(localStorage.getItem('id') != null)
            this.props.history.push('/home');
    }

    registerAPI() {
        fetch("http://localhost:9000/serverAPI/register",
        {
            method: 'POST',
            body: JSON.stringify({fname: this.state.first_name,
                                  lname: this.state.last_name,
                                  email: this.state.email,
                                  pass: this.state.password}),
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then((res) => {
            if(res.msg === "OK")
            {
                localStorage.setItem('id', res.id);
                this.props.history.push('Home');
            }
            else
                this.setState({register_res: res.msg});
        })
        .catch((error) => {
           console.log(error);
         });
    }

    loginAPI() {
        fetch("http://localhost:9000/serverAPI/login",
        {
            method: 'POST',
            body: JSON.stringify({email: this.state.lemail,
                                  password: this.state.lpassword}),
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then((res) => {
            if(res.msg === "OK")
            {
                localStorage.setItem('id', res.id);
                this.props.history.push('Home');
            }
            else
                this.setState({login_res: res.msg});
        })
        .catch((error) => {
           console.log(error);
         });
    }

    inputChangeHandler = (event) => {
        let name = event.target.name;
        let val = event.target.value;
        this.setState({[name]: val});
    }

    loginSubmitHandler = (event) => {
        event.preventDefault();
        if(this.state.lemail === '' || this.state.lpassword === '')
        {
            this.setState({login_res: 'Please fill all the inputs'});
            return;
        }
        this.loginAPI();
    }

    RegisterSubmitHandler = (event) => {
        event.preventDefault();
        if(this.state.first_name === '' || this.state.last_name === '' || this.state.email === '' || this.state.password === '')
        {
            this.setState({register_res: 'Please fill all the inputs'});
            return;
        }
        this.registerAPI();
    }

    render() {
        return(
            <div>
                <div className={Styles.LoginIntro}>Welcome to <span style={{fontWeight: "bold"}}>YouTube</span> search engine</div>
                <div className={Styles.LoginDiv}>
                    <div className={Styles.LeftLogin}>
                        <span style={{fontWeight: "bold"}}>Login</span><br/>
                        <span>Enter username and password to log on</span>
                        <br/><br/>
                        <form onSubmit={this.loginSubmitHandler} className={Styles.FormStyle}>
                        <span className={Styles.login_register_res}>{this.state.login_res}</span><br/>
                            <input className={Styles.TextInput} name='lemail' onChange={this.inputChangeHandler} type='email' placeholder="Email..."/><br/>
                            <input className={Styles.TextInput} name='lpassword' onChange={this.inputChangeHandler} type='password' placeholder="Password..."/><br/>
                            <input className={Styles.BtnInput} type='submit' value="Sign In" />
                        </form>
                    </div>
                    <div className={Styles.RightRegister}>
                        <span style={{fontWeight: "bold"}}>Register now</span><br/>
                        <span>Fill in the form below to get instant access</span>
                        <br/><br/>
                        <form onSubmit={this.RegisterSubmitHandler} className={Styles.FormStyle}>
                            <span className={Styles.login_register_res}>{this.state.register_res}</span><br/>
                            <input className={Styles.TextInput} name='first_name' onChange={this.inputChangeHandler} type='text' placeholder="First name..."/><br/>
                            <input className={Styles.TextInput} name='last_name' onChange={this.inputChangeHandler} type='text' placeholder="Last name..."/><br/>
                            <input className={Styles.TextInput} name='email' onChange={this.inputChangeHandler} type='email' placeholder="Email..."/><br/>
                            <input className={Styles.TextInput} name='password' onChange={this.inputChangeHandler} type='password' placeholder="Password..."/><br/>
                            <input className={Styles.BtnInput} type='submit' value="Sign Up" />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
};

export default Login;