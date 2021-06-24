import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { io } from "socket.io-client";
import { UserContext } from '../context/auth';
import _ from 'lodash'
import Message from '../components/Message';

let socket;

function Chat({match}) {

    const header = {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
    const [conversationId] = useState(match.params.conversationId)
    const [messages, setMessages] = useState([])
    const { user } = useContext(UserContext)
    const [currentMessage, setCurrentMessage] = useState('')
    const [typingmessage, setTypingmessage] = useState('')

    useEffect(() => {
        if(conversationId) {
            // GETTING ALL MESSAGES 
            axios.get(
                'http://localhost:8080/chat/messages',{
                    params: {
                        conversationId: conversationId
                    },
                    headers: header
                }
            ).then((response) => {
                if(response.data.success){
                    setMessages(response.data.data.messages)
                }
            })
        }
    }, [])

    // CONNECTING TO SOCKET SERVER    
    useEffect(() => {
        socket = io('http://localhost:8081', {query: `room=${conversationId}`})

        return () => {
            socket.emit('leave room', conversationId)
            socket.disconnect()
        }
    }, [])

    // HANDLING NEW OR DELETED MESSAGES
    useEffect(() => {
        socket.on('new message arrived', (message) => {
            setMessages((messages) => [...messages, message])
        })

        socket.on('deleted message', (deletedMessage) => {
            setMessages((messages) => (messages.filter(message => !_.isEqual(message, deletedMessage))))
        })

        socket.on('typing', (data) => {
            setTypingmessage(data.message)
            setTimeout(() => setTypingmessage(''), data.timeout)
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
            if(response.data.success){
                socket.emit('message', response.data.data.message)
                setMessages((messages) => [...messages, response.data.data.message])
            }
        })
        setCurrentMessage('')
    }

    // LISTENING INPUT
    const listeningInput = (event) => {
        event.preventDefault()

        if (event.which === 13) {
            socket.emit('typing', { message:'', timeout: 0});
            sendMessage(event)
        } 
        else if (event.which === 8) {
            socket.emit('typing', { message:'', timeout: 0});
            setCurrentMessage(currentMessage.slice(0, -1))
        } 
        else if(event.which > 31) {
            socket.emit('typing', { message:`${user.username} is typing ...`, timeout: 1000});
            setCurrentMessage(currentMessage + event.key)
        }
    }

    return (
        <div className="container mx-auto w-10/12 my-6 p-6 bg-gray-300 rounded-lg">
            {messages.map(
                message => 
                    <Message 
                        setMessages={setMessages}
                        messageid={message._id}
                        message={message.message}
                        userId={message.userId}
                        socket={socket}
                    />
                )
            }
            <div>{typingmessage}</div>
            <div className="w-full flex flex-row">
                <input
                    onKeyDown={listeningInput}
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
