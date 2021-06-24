import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { UserContext } from '../context/auth'

function Message({ messageid, message, setMessages, userId, usernames, socket}) {

    const {user} = useContext(UserContext)
    const header = {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}

    // GETTINg USERNAME
    const [username, setUsername] = useState('')

    useEffect(() => {
        axios.get(
            'http://localhost:8080/username',
            {
                params: {
                    id: userId
                },
                headers: header
            }
        ).then((response) => {
            if(response.data.success) {
                setUsername(response.data.data.username)
            }
        })
    }, [])

    // HANDLING DELETE BUTTON
    const [deleteButtonId, setDeleteButtonId] = useState('')

    const renderDeleteButton = (event) => {
        event.preventDefault()
        setDeleteButtonId(event.target.attributes.messageid.value)
    }

    const removeDeleteButton = (event) => {
        event.preventDefault()
        setDeleteButtonId('')
    }

    // DELETE MESSAGE
    const deleteMessage = (event) => {
        event.preventDefault()
        const messageid = event.target.attributes.messageid.value
        axios.delete(
            'http://localhost:8080/chat/message',
            {
                headers: header,
                data: {
                    messageId: messageid
                }
            }
        ).then((response) => {
            if(response.data.success) {
                setMessages((messages) => (messages.filter(message => !_.isEqual(message, response.data.data.message))))
                socket.emit('delete message', response.data.data.message)
            }
        })
    }

    return (
        <div
            messageid={messageid} 
            onMouseEnter={renderDeleteButton}
            onMouseLeave={removeDeleteButton}
            className={`w-full my-3 flex ${userId === user.id ? 'flex-row-reverse' : 'flex-row'} items-center`}
        >
            <div
                messageid={messageid} 
                className="w-auto h-auto p-4 bg-indigo-600 rounded-lg text-white"
            > 
                {message} 
            </div> 
            <div messageid={messageid} className="w-auto h-auto p-4">{username}</div>
            {
                userId === user.id && messageid === deleteButtonId?
                <button
                    onClick={deleteMessage}
                    messageId={messageid} 
                    className=" py-4 text-white bg-red-700 w-5 h-2 rounded-xl flex justify-center items-center"
                >
                    x
                </button> :
                <></>
            }
        </div>
    )
}

export default Message
