import axios from 'axios'
import React, { useEffect, useState } from 'react'

function UserInChat({userid}) {

    const header = {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
    const [username, setUsername] = useState('')

    useEffect(() => {
        axios.get(
            'http://localhost:8080/username',
            {
                params: {
                    id: userid
                },
                headers: header
            }
        ).then((response) => {
            if(response.data.success) {
                setUsername(response.data.data.username)
            }
        })
    }, [])

    return (
        <div>
            {username}
        </div>
    )
}

export default UserInChat
