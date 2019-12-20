import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import {Switch, Route, Link, Redirect, useParams, useLocation, useHistory} from 'react-router-dom'
import './app-style.css'
import GetStarted from './components/GetStarted'
import {useSelector, useDispatch} from 'react-redux'
import logo from './logo.png'
import Cookies from 'js-cookie'
import {setCurrentUser, updateCurrentUser, fethchActiveUsers} from './store/modules/userReducer'
import {fetchMessages, addMessage} from './store/modules/messageReducer'
import io from 'socket.io-client'

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

function registerSocketEvents(socket, dispatch) {
	if (socket) {
		socket.on('chatMsg', (data) => {
			dispatch(addMessage(data.author, data.msg, data.sentDate))})
	}
}

function createMessageSend(dispatch, socket, author) {
	return (msg) => {
		dispatch(addMessage(author, msg, Date.now()))
		socket.emit('chatMsg', {msg, author})
	}
}

function Chat(props) {
	let currentUser = useSelector(state => state.user.currentUser)
	let dispatch = useDispatch()
	let [socket, setSocket] = useState(null)

	useEffect(() => {
		fetchMessages(dispatch)
		fethchActiveUsers(dispatch)
	}, [dispatch])

	useEffect(() => {
		if (!socket) {
			setSocket(io.connect('localhost:4000', {path: '/sock'}))
		}
		registerSocketEvents(socket, dispatch)
	}, [socket, dispatch])

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
			<ChatGrid sendMsg={createMessageSend(dispatch, socket, currentUser)}/>
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
	let dispatch = useDispatch()

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
	let users = useSelector(state => state.user.activeUsers)
	console.log(users)
	return (
		users.map((user) => {
			return <UserAvatar user={user.user} key={user.user}/>
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


