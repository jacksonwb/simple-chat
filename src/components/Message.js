import styled from 'styled-components'
import React from 'react'
import {useSelector} from 'react-redux'

function Message(props) {
	const date = new Date(parseInt(props.sent))
	const sentStr = date.toLocaleString('en-US', {
		dateStyle: 'short',
		timeStyle: 'short'
	})

	return (
		<div style={{wordWrap: 'break-word', paddingBottom:'2px'}}>
			<span style={{fontWeight: 'bold'}}>{props.author} </span>
			{props.message}
			<p style={{
				paddingLeft: '10px',
				fontStyle: 'italic',
				color: 'grey',
				fontSize: '12px'
			}}>{sentStr}</p>
		</div>
	)
}

const MessageContainerTitle = styled.div`
	font-weight: bold;
`

export default function MessageContainer(props) {
	let messages = useSelector((state) => state.message.messages)
	return (
		<>
		<MessageContainerTitle>Chat</MessageContainerTitle>
		{
			messages.map((msg) => {
				return <Message sent={msg.sentDate} author={msg.author} message={msg.msg} key={msg.sentDate}/>
			})
		}
		</>
	)
}