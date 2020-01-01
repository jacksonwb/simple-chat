import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import userReducer from './modules/userReducer'
import messageReducer from './modules/messageReducer'
import socketManager from './middleware/socketManage'
import io from 'socket.io-client'
// import {createLogger} from 'redux-logger'

let store = createStore(
	combineReducers({user: userReducer, message: messageReducer}),
	applyMiddleware(thunk, socketManager(io, 'localhost:4000'))
)

export default store