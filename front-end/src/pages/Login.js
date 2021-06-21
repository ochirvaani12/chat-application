import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { LockClosedIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { UserContext } from '../context/auth'
import { useHistory } from 'react-router-dom'

function Login() {

  const { loginData } = useContext(UserContext)
  let history = useHistory();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const loginAccount = (event) => {
    event.preventDefault()
    axios.post('http://localhost:8080/login', {
      username: username,
      password: password
    }).then(response => {
      if(response.data.success){
        loginData(response.data.data.token)
        setError(null)
        history.push('/')
      } else {
        setError(response.data.data.message)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-6">Login to your account</h2>
          </div>
          {error ? 
            <div className="bg-red-300 border-l-4 border-red-700 text-black rounded-lg p-4 my-3" role="alert">
              <p className="font-bold">Be Warned</p>
              <p>{error}</p>
            </div>:
            <></>
          }
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            placeholder="Username"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            placeholder="Password"
          />
          <div>
            <button
              onClick={loginAccount}
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>
              Login
            </button>
            <Link to="/signup">
              <button
                type="button"
                className="group relative w-full flex justify-center mt-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-transparent hover:bg-indigo-100 focus:outline-none"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
