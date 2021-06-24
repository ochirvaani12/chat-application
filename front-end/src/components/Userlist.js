import React, { useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../context/auth'
import { useHistory } from 'react-router-dom'

function Userlist({id, username}) {

    let history = useHistory()
    const header = {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
    const { user } = useContext(UserContext)

    const createConversation = () => {
        axios.post('http://localhost:8080/chat', 
            {
                userIds: [user.id, id]
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

    return (
        <button
            onClick = {() => createConversation()}
            className="w-4/5 bg-yellow-300 h-14 rounded-lg my-3 text-lg font-medium text-white flex flex-row justify-center items-center"
        >
            chat with {username}
        </button>
    )
}

export default Userlist
