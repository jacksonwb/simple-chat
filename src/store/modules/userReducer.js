// Constants
const SET_CURRENT_USER = 'SET_CURRENT_USER'
const SET_ACTIVE_USERS = 'SET_ACTIVE_USERS'
const ADD_USER = 'ADD_USER'
const REMOVE_USER = 'REMOVE_USER'

// Initial State
const initialState = {
	currentUser: '',
	activeUsers: []
}

// Action Creators
export function updateCurrentUser(value) {
	return {
		type: SET_CURRENT_USER,
		value
	}
}

export function setActiveUsers(value) {
	return {
		type: SET_ACTIVE_USERS,
		value
	}
}

export function addUser(value) {
	return {
		type: ADD_USER,
		value
	}
}

export function removeUser(value) {
	return {
		type: REMOVE_USER,
		value
	}
}

// Thunks
export function fethchActiveUsers() {
	return (dispatch) => {
		fetch('/api/users')
		.then(res => res.json())
		.then(data => {
			console.log('fetch users - ', data)
			dispatch(setActiveUsers(data))
		})
		.catch((err) => {console.error(err)})
	}
}

// Reducer
export default function reducer(state = initialState, action) {
	switch(action.type) {
		case SET_CURRENT_USER: return {
				...state,
				currentUser: action.value
			}
		case SET_ACTIVE_USERS: return {
			...state,
			activeUsers: action.value
		}
		case ADD_USER:
			if (action.value === state.currentUser)
				return state
			return {
				...state,
				activeUsers: [...state.activeUsers, action.value]
			}
		case REMOVE_USER: return {
			...state,
			activeUsers: state.activeUsers.filter((user) => user !== action.value)
		}
		default:
			return state
	}
}