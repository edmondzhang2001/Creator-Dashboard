import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http:/localhost:8000/api/auth/login', {
                email,
                password,
            });
            setLoginStatus("Login Successful");
        } catch (error) {
            setLoginStatus("Login Failed");
        }
    };

    return (
        <div>
            <Navbar/>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {loginStatus && <p>{loginStatus}</p>}
        </div>
    )
}

export default Login;