import styled from 'styled-components'
import React, {useState} from 'react'

const MessageTextArea = styled.textarea`
	border: 2px solid palevioletred;
	font-family: 'Cutive Mono', monospace;
	outline: none;
	resize:none;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
`

export default function NewMessage(props) {
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