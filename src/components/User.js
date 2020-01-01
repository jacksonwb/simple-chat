import styled from 'styled-components'
import React from 'react'
import {useSelector} from 'react-redux'

function UserAvatar(props) {
	return (
		<p>{props.user}</p>
	)
}

const ActiveUsersContainer = styled.div`
	border-right: 1px solid white;
	height: 100%;
`

export default function ActiveUsers(props) {
	let currentUser = useSelector(state => state.user.currentUser)
	let users = useSelector(state => state.user.activeUsers)
	return (
		<ActiveUsersContainer>
			<p style={{fontWeight: 'bold'}}>Active Users</p>
			{
				users.filter(user => user !== currentUser).map((user) => {
					return <UserAvatar user={user} key={user}/>
				})
			}
		</ActiveUsersContainer>
	)
}