import logo from '../logo.png';
import React, {useState, useRef, useEffect} from 'react';
import {Switch, Route, Link, Redirect, useParams, useLocation, useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import styled from 'styled-components'
import {updateCurrentUser} from '../store/modules/userReducer'
import Cookie from 'js-cookie'

const CenterImage = styled.img`
	width: 400px;
`
const CenterDiv = styled.div`
	text-align: center;
	margin:auto;
	color: palevioletred;
	font-family: 'Cutive Mono', monospace;
`

const Button = styled.button`
	color: tomato;
	border: 2px solid palevioletred;
	padding: 0.25em .5em;
	border-radius: 3px;
	font-size: 1em;
	margin-left: 10px;
	font-family: 'Cutive Mono', monospace;
	/* display: block; */
`

const Textarea = styled.textarea`
	resize: none;
	box-sizing: border-box;
	border: 2px solid palevioletred;
	border-radius: 3px;
	font-size: 1em;
	font-family: 'Cutive Mono', monospace;
	margin-bottom: 0px;
	display: inline-block;

`

const InlineBox = styled.div`
	display:flex;
	justify-content: center;

`

function GetStarted(props) {
	let [name, updateName] = useState('')
	let history = useHistory()
	let textRef = useRef(null)
	let dispatch = useDispatch()

	useEffect(() => {
		textRef.current.focus()
	})

	const submitUser = () => {
		dispatch(updateCurrentUser(name))
		Cookie.set('currentUser', name, {expires: Date.now() + 60 * 60})
		history.push('/')
	}

	return (
		<CenterDiv>
			<CenterImage src={logo} alt=''/>
			<h1>Enter your name!</h1>
			<InlineBox>
				<Textarea
					type='text'
					placeholder='enter name...'
					ref={textRef}
					value={name}
					onChange={(e) => {updateName(e.target.value)}}
					onKeyPress={(e) => {if (e.key === 'Enter') {submitUser()}}}/>
				<Button onClick={submitUser}>Let's go</Button>
			</InlineBox>
		</CenterDiv>
	)
}

export default GetStarted