import React, {useEffect} from 'react'
import styled from 'styled-components'
import {useSelector, useDispatch} from 'react-redux'
import Cookies from 'js-cookie'
import {updateCurrentUser, fethchActiveUsers} from '../store/modules/userReducer'
import {fetchMessages, addMessage} from '../store/modules/messageReducer'
import {socketEmit, socketConnect} from '../store/middleware/socketManage'
import MenuBar from './MenuBar'
import ActiveUsers from './User'
import MessageContainer from './Message'
import NewMessage from './NewMessage'
import {Redirect} from 'react-router-dom'

function createMessageSend(dispatch, author) {
	return (msg) => {
		dispatch(socketEmit('chatMsg', {author, msg}))
		dispatch(addMessage(author, msg, Date.now()))
	}
}

export default function Chat(props) {
	let currentUser = useSelector(state => state.user.currentUser)
	let dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchMessages())
		dispatch(fethchActiveUsers())
		dispatch(socketConnect())
	})

	// Restore user from cookies
	if (!currentUser) {
		let cookieUser = Cookies.get('currentUser')
		if (!cookieUser) {
			return(
				<Redirect to='/start'/>
			)
		}
		dispatch(updateCurrentUser(cookieUser))
	}

	return (
		<>
			<ChatGrid sendMsg={createMessageSend(dispatch, currentUser)}/>
		</>
	)
}

const GridContainer = styled.div`
	display: grid;
	/* height:90vh; */
	border: 1px solid black;
	height: 100vh;
	box-sizing: border-box;
	border-radius: 3px;
	grid-template-columns: 30% 70%;
	grid-template-rows: 40px auto 100px;
	grid-template-areas:
		"header header"
		"users messages"
		"users new-message";
`

const UsersDiv = styled.div`
	grid-area: users;
	padding-left: 2px;
`

const MessagesDiv = styled.div`
	grid-area: messages;
	height:70vh;
	padding-left: 2px;
`

const NewMessageDiv = styled.div`
	grid-area: new-message;
`

const MenuBarDiv = styled.div`
	grid-area: header;
`

function ChatGrid(props) {
	return (
		<GridContainer>
			<MenuBarDiv>
				<MenuBar/>
			</MenuBarDiv>
			<UsersDiv>
				<ActiveUsers/>
			</UsersDiv>
			<MessagesDiv>
				<MessageContainer/>
			</MessagesDiv>
			<NewMessageDiv>
				<NewMessage sendMsg={props.sendMsg}/>
			</NewMessageDiv>
		</GridContainer>
	)
}