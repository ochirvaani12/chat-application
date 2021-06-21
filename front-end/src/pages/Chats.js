import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../context/auth'
import { Link, useHistory } from 'react-router-dom'

function Chats() {

    let history = useHistory()
    const header = {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
    const { user } = useContext(UserContext)
    const [conversations, setConversations] = useState([])
    const [search, setSearch] = useState('')
    const [foundUser, setFoundUser] = useState(null)

    const createConversation = () => {
        axios.post('http://localhost:8080/chat', 
            {
                userIds: [user.id, foundUser.id]
            },
            {
                headers: header
            }
        ).then((response) => {
            if(response.data.success){
                history.push(`/chat/${response.data.data.conversationId}`)
            }
        })
    }

    const searchUser = (event) => {
        event.preventDefault()
        if(search === user.username) return
        axios.get(
            'http://localhost:8080/search',
            {
                params: {
                    username: search
                },
                headers: header
            }
        ).then((response) => {
            console.log(response)
            if(response.data.success) {
                setFoundUser(response.data.data)
            }
            else setFoundUser('user is not found!!')
        })
    }

    useEffect(() => {
        if(user.id){
            axios.get(
                'http://localhost:8080/chats',
                {
                    params: { 
                        id: user.id
                    },
                    headers: header
                }
            ).then((response) => {
                if(response.data.success) setConversations(response.data.data.conversations)
            })
        } else {
            history.push('/')
        }
    }, [])

    return (
        <div className="container mx-auto my-3 w-10/12 flex justify-center items-center flex-col">
            <div className="w-full flex justify-center items-center">
                <input 
                    type="text" 
                    placeholder="find your friend..." 
                    className="bg-gray-200 w-2/5 h-10 rounded-md p-2 mx-1"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
                <button 
                    onClick={searchUser} 
                    className="w-1/5 group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    search
                </button>
            </div>
            {foundUser === 'user is not found!!' ? 
                <div className="w-4/5 bg-red-500 h-14 rounded-lg my-3 text-lg font-medium text-white flex flex-row justify-center items-center">User is not found !!!</div> : 
                <></>
            }
            {foundUser && foundUser !== 'user is not found!!' ?
                <button
                        onClick = {() => createConversation()}
                        className="w-4/5 bg-yellow-300 h-14 rounded-lg my-3 text-lg font-medium text-white flex flex-row justify-center items-center"
                    >
                        chat with {foundUser.username}
                </button> :
                <></>
            }
            {conversations.map((conversation, index) => 
                <Link 
                    to={`/chat/${conversation._id}`}
                    className="w-4/5 bg-purple-500 h-14 rounded-lg my-3 text-lg font-medium text-white flex flex-row justify-center items-center"
                >
                    Room {index+1}
                </Link>
            )}
        </div>
    )
}

export default Chats
