import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

import Google from '../Assets/Google.png';
import '../Styles/Authentication.css';
import USerPool from '../Services/UserPool';

function Authentication() {

    const navigate = useNavigate()

    const [isAlreadyUser, setIsAlreadyUser] = useState(true); 
      
    const [name, setName] = useState('');
    const [isNameValid, setIsNameValid] = useState(true);
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

    const emailRe = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRe = /^(?=.*[a-zA-Z0-9])(?=.*[\W_])[a-zA-Z0-9\W_]{8,}$/;

    const handleNameChange = (value) => {
        setName(value)
        if (value === '') {
            setIsNameValid(false)
            return;
        }
        setIsNameValid(true)
    }

    const handleEmailChange = (value) => {
        setEmail(value)
        if (!emailRe.test(value)) {
            setIsEmailValid(false)
            return;
        }
        setIsEmailValid(true)
    }

    const handlePasswordChange = (value) => {
        setPassword(value)
        if (!passwordRe.test(value)) {
            setIsPasswordValid(false)
            return;
        }
        setIsPasswordValid(true)
    }

    const onRegister = () => {
        if (name === '') {
            setIsNameValid(false)
            return;
        }
        if (email === '') {
            setIsEmailValid(false)
            return;
        }
        if (password === '') {
            setIsPasswordValid(false)
            return;
        }
        if (confirmPassword === '') {
            setIsConfirmPasswordValid(false)
            return;
        }
        if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            localStorage.setItem('profile', JSON.stringify({
                name,
                email
            }));
            const attributes = [];
            attributes.push(
                new CognitoUserAttribute({
                    Name: 'name',
                    Value: name
                })
            );
            USerPool.signUp(email, password, attributes, null, (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(data);
                navigate('/home');
            });
        }
    }

    const onLogin = () => {
        if (email === '') {
            setIsEmailValid(false)
            return;
        }
        if (password === '') {
            setIsPasswordValid(false)
            return;
        }
        if (isEmailValid && isPasswordValid) {
            localStorage.setItem('profile', JSON.stringify({
                email
            }));
            USerPool.signIn(email, password, null, (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(data);
            });
            navigate('/home');
        }
    }


    return (
        <div className='main-container'>
            <div className='page-card'>
                <p className="registration-header">{isAlreadyUser ? 'Login' : 'Registration'}</p>
                <div className='registration-form-body'>
                    {
                        isAlreadyUser
                            ?
                            null
                            :
                            <>
                                <Input status={isNameValid ? 'Success' : 'error'} value={name} onChange={(e) => handleNameChange(e.target.value)} size='large' placeholder="Name" className='mb-10' />
                                <p className='registration-error-message' style={{ display: isNameValid ? 'none' : 'block' }}>Name can't be empty.</p>
                            </>
                    }
                    <Input value={email} status={isEmailValid ? 'Success' : 'error'} onChange={(e) => handleEmailChange(e.target.value)} size='large' type='email' placeholder="Email" className='mb-10' />
                    <p className='registration-error-message' style={{ display: isEmailValid ? 'none' : 'block' }}>Email is not valid.</p>
                    <Input.Password value={password} status={isPasswordValid ? 'Success' : 'error'} onChange={(e) => handlePasswordChange(e.target.value)} size='large' placeholder="Password" className='mb-10' />
                    <p className='registration-error-message' style={{ display: isPasswordValid ? 'none' : 'block' }}>Password is not valid.</p>
                    {
                        isAlreadyUser
                            ?
                            null
                            :
                            <>
                                <Input.Password value={confirmPassword} onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    if (e.target.value !== password) {
                                        setIsConfirmPasswordValid(false)
                                        return;
                                    }
                                    setIsConfirmPasswordValid(true)
                                }} size='large' placeholder="Confirm Password" className='mb-10' />
                                <p className='registration-error-message' style={{ display: isConfirmPasswordValid ? 'none' : 'block' }}>Password does not match.</p>
                            </>
                    }
                    <Button className='registration-submit' size='large' onClick={() => {
                        if (isAlreadyUser) {
                            onLogin();
                        } else {
                            onRegister();
                        }
                    }} >Submit</Button>
                    <p className='auth-alt-message'>{isAlreadyUser ? "Don't have Account?" : "Have account already?"} <span className='auth-link' onClick={() => setIsAlreadyUser(!isAlreadyUser)}>{isAlreadyUser ? "Register" : "Login"}</span></p>
                    <div className='auth-or-div'>
                        <hr className='auth-or-line' />
                        <p className='auth-or-text'>OR</p>
                        <hr className='auth-or-line' />
                    </div>
                    <div className='auth-google-div'>
                        <p className='auth-google-text'>Continue with </p>
                        <img src={Google} alt='Google' className='auth-google-icon' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Authentication;
