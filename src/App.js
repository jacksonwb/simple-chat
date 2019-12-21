import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import {Switch, Route, Redirect} from 'react-router-dom'
import './app-style.css'
import GetStarted from './components/GetStarted'
import {useSelector, useDispatch} from 'react-redux'
import logo from './logo.png'
import Cookies from 'js-cookie'
import {updateCurrentUser, fethchActiveUsers} from './store/modules/userReducer'
import {fetchMessages, addMessage} from './store/modules/messageReducer'
import {socketEmit, socketConnect} from './store/middleware/socketManage'

export default function App() {
	let user
	return (
	<div className="App">
		<Switch>
			<Route path='/start'>
				<GetStarted/>
			</Route>
			<Route exact path='/'>
				<Chat user={user}/>
			</Route>
			<Route path='/'>
				<Redirect to='/'/>
			</Route>
		</Switch>
	</div>
	);
}

function createMessageSend(dispatch, author) {
	return (msg) => {
		dispatch(socketEmit('chatMsg', {author, msg}))
		dispatch(addMessage(author, msg, Date.now()))
	}
}

function Chat(props) {
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
			<MenuBar currentUser={currentUser}/>
			<ChatGrid sendMsg={createMessageSend(dispatch, currentUser)}/>
		</>
	)
}

const GridContainer = styled.div`
	display: grid;
	height:90vh;
	grid-template-columns: 30% 70%;
	grid-template-rows: 90% 10%;
	grid-template-areas:
		"users messages"
		"users new-message";
`

const UsersDiv = styled.div`
	grid-area: users;
`

const MessagesDiv = styled.div`
	grid-area: messages;
	border: 1px solid white;
`

const NewMessageDiv = styled.div`
	grid-area: new-message;
`

function ChatGrid(props) {
	return (
		<GridContainer>
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

function Message(props) {
	return (
		<p>{props.sent} - {props.author} - {props.message}</p>
	)
}

function MessageContainer(props) {
	let messages = useSelector((state) => state.message.messages)
	return (
		messages.map((msg) => {
			return <Message sent={msg.sentDate} author={msg.author} message={msg.msg} key={msg.sentDate}/>
		})
	)
}

const MessageTextArea = styled.textarea`
	border: 2px solid palevioletred;
	font-family: 'Cutive Mono', monospace;
`

function NewMessage(props) {
	let [message, updateMessage] = useState('')

	return (
		<MessageTextArea
			type='text'
			placeholder='Send a message...'
			value={message}
			onChange={(e) => {updateMessage(e.target.value)}}
			onKeyPress={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault()
					props.sendMsg(message)
					updateMessage('')
				}
			}}
		/>
	)
}

function UserAvatar(props) {
	return (
		<p>{props.user}</p>
	)
}

function ActiveUsers(props) {
	let currentUser = useSelector(state => state.user.currentUser)
	let users = useSelector(state => state.user.activeUsers)
	return (
		users.filter(user => user !== currentUser).map((user) => {
			return <UserAvatar user={user} key={user}/>
		})
	)

}

const MenuContainer = styled.div`
	height: 20px;
	background-color: palevioletred;
	display:flex;
	height: 30px;
	margin-bottom: 10px;
	/* overflow:hidden; */
`

const MenuLogo = styled.img`
	height: 40px;
`

function MenuBar(props) {
	return (
		<MenuContainer>
			<MenuLogo src={logo}/>
			<p>user - {props.currentUser}</p>
		</MenuContainer>
	)
}


