import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../context/auth'
import { useHistory } from 'react-router-dom'

function Signup() {

    const { loginData } = useContext(UserContext)
    let history = useHistory();

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null);

    const createAccount = (event) => {
        event.preventDefault()
        if(password === confirmPassword) {
            axios.post('http://localhost:8080/signup', {
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: password
            }).then((response) => {
                if(response.data.success) {
                    loginData(response.data.data.token)
                    setError(null)
                    history.push('/')
                } else {
                    setError(response.data.data.message)
                }
            }).catch((err) => {
                setError(err.message)
            })
        } else setError('Password is not match!!!')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <div className="m-6">
                        <img
                            className="mx-auto h-12 w-auto"
                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                            alt="Workflow"
                        />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up to our website</h2>
                    </div>
                    {error ? 
                        <div className="bg-red-300 border-l-4 border-red-700 text-black rounded-lg p-4 my-3" role="alert">
                            <p className="font-bold">Be Warned</p>
                            <p>{error}</p>
                        </div>:
                        <></>
                    }
                    <input
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        placeholder="Firstname"
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                    <input
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        placeholder="Lastname"
                        onChange={(e) => setLastname(e.target.value)}
                    />
                    <input
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        onClick={createAccount}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Account
                    </button>
                    <div className="text-grey-dark mt-6 flex w-full justify-center">
                        Already have an account?
                        <Link to="/login" className="no-underline border-b border-blue">
                            Log in
                        </Link>.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
