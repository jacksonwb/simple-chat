// Constants
const ADD_MESSAGE = 'ADD_MESSAGE'
const SET_MESSAGES = 'SET_MESSAGES'

// Initial State
const initialState = {
	messages: []
}

// Action Creators
export function addMessage(author, msg, sentDate) {
	return {
		type: ADD_MESSAGE,
		author,
		msg,
		sentDate
	}
}

export function setMessages(messages) {
	return {
		type: SET_MESSAGES,
		messages
	}
}

// Thunks
export function fetchMessages() {
	return (dispatch) => {
		fetch('/api/messages')
		.then(res => res.json())
		.then(data => {
			dispatch(setMessages(data))
		})
	}
}

// Reducer
export default function reducer(state = initialState, action) {
	switch (action.type) {
		case ADD_MESSAGE: return {
			messages: [...state.messages, {
				author: action.author,
				msg: action.msg,
				sentDate: action.sentDate
			}]
		}
		case SET_MESSAGES: return {
			messages: action.messages
		}
		default:
			return state
	}
}