import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import './app-style.css'
import GetStarted from './components/GetStarted'
import Chat from './components/Chat'


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
