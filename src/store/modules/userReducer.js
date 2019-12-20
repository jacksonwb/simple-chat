// Constants
const SET_CURRENT_USER = 'SET_CURRENT_USER'
const SET_ACTIVE_USERS = 'SET_ACTIVE_USERS'

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

// Active Action Creators
export function fethchActiveUsers(dispatch) {
	fetch('/api/users')
	.then(res => res.json())
	.then(data => {
		dispatch(setActiveUsers(data))
	})
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
		default:
			return state
	}
}