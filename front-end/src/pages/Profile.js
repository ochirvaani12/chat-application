import React, { useContext } from 'react'
import { UserContext } from '../context/auth'

function Profile() {

    const { user } = useContext(UserContext)

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center transform -translate-y-32 sm:py-12">
            <div className="py-3 lg:max-w-4xl sm:mx-auto h-1/2">
                <div className="bg-white shadow-lg border-gray-100 max-h-50	 border sm:rounded-3xl p-8 flex space-x-8">
                    <div className="h-28 overflow-visible w-1/2 flex justify-center">
                        <img className="rounded-3xl shadow-lg h-96 w-4/5" src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/1LRLLWGvs5sZdTzuMqLEahb88Pc.jpg" alt="" />
                    </div>
                    <div className="flex flex-col w-1/2 space-y-4">
                        <div className="flex justify-between items-start my-5">
                            <h2 className="text-4xl font-bold">Hello {user.firstname + " " + user.lastname}</h2>
                        </div>
                        <div className="my-2">
                            <div className="text-lg text-gray-400">username:</div>
                            <div className="text-3xl font-semibold text-gray-800">{user.username}</div>
                        </div>
                        <p className="text-gray-400 text-lg">We are happy for that you are using our website. Let's increase our number of friends by chatting.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
