import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { io } from "socket.io-client";
import { UserContext } from '../context/auth';

let socket;

function Chat({match}) {

    const header = {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
    const [conversationId] = useState(match.params.conversationId)
    const [userids, setUserids] = useState([])
    const [usernames, setUsernames] = useState([])
    const [messages, setMessages] = useState([])
    const { user } = useContext(UserContext)

    const [currentMessage, setCurrentMessage] = useState('')

    // GET MESSAGES METHOD
    const getMessages = () => {
        axios.get(
            'http://localhost:8080/chat/messages',{
                params: {
                    conversationId: conversationId
                },
                headers: header
            }).then((response) => {
                setMessages(response.data)
            }
        )
    }

    useEffect(() => {
        if(conversationId) {

            //  GETTING ALL USERS IDS
            axios.get(
                'http://localhost:8080/chat', 
                {
                    params: {
                        id: conversationId
                    },
                    headers: header
                }
            ).then((response) => {
                console.log(response)
                if(response.data.success) {
                    setUserids(response.data.data.userIds)
                }
            })
            
            // GETTING ALL MESSAGES 
            getMessages()
        }
    }, [])

    // GETTING USERNAMES OF ALL USERS
    useEffect(() => {
        if(userids.length > 0) {
            userids.map(userid => {
                axios.get(
                    'http://localhost:8080/usernames',
                    {
                        params: {
                            id: userid
                        },
                        headers: header
                    }
                ).then((response) => {
                    if(response.data.success) {
                        const { username, id } = response.data.data
                        setUsernames(usernames => [...usernames, { username: username, id: id }])
                    }
                })
            })
        }
    }, [userids])


    useEffect(() => {
        socket = io('http://localhost:8081', {query: `room=${conversationId}`})

        return () => {
            socket.emit('leave room', conversationId)
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        socket.on('new message arrived', () => {
            getMessages()
        })
    },[])

    // SEND MESSAGE
    const sendMessage = (event) => {
        event.preventDefault()
        axios.post(
            'http://localhost:8080/chat/message',
            {
                conversationId: conversationId,
                userId: user.id,
                message: currentMessage,
            },
            {
                headers: header
            }
        ).then((response) => {
            socket.emit('message')
            getMessages()
        }).catch((error) => {
            console.log(error)
        })
        setCurrentMessage('')
    }

    return (
        <div className="container mx-auto w-10/12 my-6 p-6 bg-gray-300 rounded-lg">
            {messages.map(
                message => 
                    <div className={`w-full my-3 flex ${message.userId === user.id ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-auto h-auto p-4 bg-indigo-600 rounded-lg text-white"> {message.message} </div> 
                        {
                            usernames.map
                            (
                                username => username.id === message.userId ? 
                                <div className="w-auto h-auto p-4">{username.username}</div> : 
                                <></>
                            )
                        }
                    </div>
                )
            }
            <div className="w-full flex flex-row">
                <input
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    type="text"
                    value={currentMessage}
                    className="bg-gray-500 text-black w-4/5 rounded-lg"
                />
                <button 
                    onClick={sendMessage} 
                    className="w-1/5 group relative flex justify-center py-2 px-4 border border-transparent text-sm md:text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    send
                </button>
            </div>
        </div>
    )
}

export default Chat
