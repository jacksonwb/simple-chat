import {addMessage} from '../modules/messageReducer'
import {addUser, removeUser} from '../modules/userReducer'

// Constants
const CONNECT = 'CONNECT'
const EMIT = 'EMIT'
const REGISTER_EVENT = 'REGISTER_EVENT'

// actions
export function socketConnect() {
	return {
		type: CONNECT
	}
}

export function socketEmit(event, data) {
	return {
		type: EMIT,
		event,
		data
	}
}

export function registerSocketEvent(event, handler) {
	return {
		type: REGISTER_EVENT,
		event,
		handler
	}
}

// Middleware
export default function socketManager(io, address) {

	let socket = {socket: null};

	return function socketManagerMiddleware({getState, dispatch}) {
		return next => action => {
			switch (action.type) {
				case CONNECT:
					if (!socket.socket && getState().user.currentUser) {
						socket.socket = io.connect(address, {path:'/sock'})
						socket.socket.on('connect', () => {
							console.log('Connected')
							socket.socket.emit('join', {author: getState().user.currentUser})
						})
						socket.socket.on('chatMsg', (data) => {
							dispatch(addMessage(data.author, data.msg, data.sentDate))
						})
						socket.socket.on('join', (data) => {
							console.log('join', data)
							dispatch(addUser(data.author))
						})
						socket.socket.on('leave', (data) => {
							console.log('leave - ', data)
							dispatch(removeUser(data.author))
						})
					}
					break;
				case EMIT:
					socket.socket.emit(action.event, action.data)
					break;
				case REGISTER_EVENT:
					socket.socket.on(action.event, action.handler)
					break;
				default: break;
			}
			next(action)
		}
	}
}