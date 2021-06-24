import React, { useEffect, useState, useContext } from 'react'
import UserInChat from '../components/UserInChat'
import Userlist from '../components/Userlist'
import axios from 'axios'
import { UserContext } from '../context/auth'
import { Link, useHistory } from 'react-router-dom'

function Chats() {

    let history = useHistory()
    const header = {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
    const { user } = useContext(UserContext)

    const [conversations, setConversations] = useState([])
    const [usersDefault, setUsersDefault] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        // GETTING CONVERSATION
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

        // GETTING USERS
        axios.get(
            'http://localhost:8080/getusers',
            {
                headers: header
            }
        ).then((response) => {
            if(response.data.success) {
                setUsersDefault(response.data.data.users)
            }
        })
    }, [])

    // FILTERING USERS
    const filterUsers = (event) => {
        event.preventDefault()
        const filtered = usersDefault.filter(userDefault => {
            return userDefault.username.toLowerCase().includes(event.target.value.toLowerCase())
        })
        setUsers(filtered)

        if(event.target.value === '') {
            setUsers([])
        }
    }

    // HANDLING DELETE BUTTON
    const [buttonid, setButtonid] = useState('')
    
    const renderDeleteButton = (event) => {
        event.preventDefault()
        const messageid = event.target.attributes.conversationid.value
        setButtonid(messageid)
    }

    const removeDeleteButton = (event) => {
        event.preventDefault()
        setButtonid('')
    }

    // DELETE CONVERSATION
    const deleteConversation = (event) => {
        event.preventDefault()
        const conversationid = event.target.attributes.conversationid.value
        axios.delete(
            'http://localhost:8080/chat',
            {
                headers: header,
                data: {
                    id: conversationid
                }
            }
        ).then((response) => {
            if(response.data.success) {
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
            }
        })
    }
    

    return (
        <div className="flex flex-row">
            <div className="w-2/5 flex flex-col justify-center items-center my-6">
                <input
                    type="text" 
                    placeholder="find your friend..."  
                    className="w-4/5 h-10 bg-gray-200 rounded-md p-2 mx-1"
                    onChange={filterUsers}
                />
                {users.map((chatableUser) => chatableUser._id !== user.id ? <Userlist id={chatableUser._id} username={chatableUser.username} /> : <></>)}
            </div>
            <div className="w-3/5 flex flex-col justify-center items-center">
                <div className="font-semibold my-6 text-xl">Contineue your chat with your friends</div>
                {conversations.map((conversation) => 
                    <Link
                        onMouseEnter={renderDeleteButton}
                        onMouseLeave={removeDeleteButton}
                        conversationid={conversation._id}
                        to={`/chat/${conversation._id}`}
                        className="w-4/5 bg-purple-500 h-14 rounded-lg my-3 text-lg font-medium text-white flex flex-row justify-center items-center relative"
                    >
                        {conversation.userIds.map(userid => userid !== user.id ? <UserInChat userid={userid} /> : <></>)}
                        {conversation._id === buttonid ?
                            <button
                                onClick={deleteConversation}
                                conversationid={conversation._id} 
                                className="w-7 h-7 rounded-lg bg-red-500 absolute right-3 top-3" 
                            >
                                X
                            </button> : <></>
                        }
                    </Link>
                )}
            </div>
        </div>    
    )
}

export default Chats
