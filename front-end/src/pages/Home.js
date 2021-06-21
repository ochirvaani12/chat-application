import React, { useContext} from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/auth'

function Home() {

    const { user } = useContext(UserContext)

    return (
        <div className="bg-home-img w-full h-screen absolute top-0 bg-center bg-no-repeat bg-cover z-0 opacity-100 flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-7xl font-semibold text-white mx-3">let's chat with our friends</h1>
            <p className="text-xl m-2 font-semibold text-white">This web application will allow you to write message to your friends freely.</p>
            { user.id ?
                <Link to="/chats">
                    <button
                        className="group relative w-40 flex justify-center py-2 px-4 border border-transparent text-xl font-normal rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        chat
                    </button> 
                </Link> :
                <Link to="/login">
                    <button
                        className="group relative w-40 flex justify-center py-2 px-4 border border-transparent text-xl font-normal rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Login
                    </button> 
                </Link>
            }
        </div>
    )
}

export default Home
