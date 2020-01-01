import styled from 'styled-components'
import React from 'react'
import logo from '../logo.png'
import {useSelector} from 'react-redux'

const MenuContainer = styled.div`
	background-color: palevioletred;
	display:flex;
`
const MenuText = styled.p`
	margin-top: 0.5em;
	font-size: 20px;
`

const MenuLogo = styled.img`
	height: 40px;
`

export default function MenuBar(props) {
	const currentUser = useSelector(state => state.user.currentUser)
	return (
		<MenuContainer>
			<MenuLogo src={logo}/>
			<MenuText>Chatting as <span style={{'fontWeight': 'bold'}}>{currentUser}</span></MenuText>
		</MenuContainer>
	)
}
