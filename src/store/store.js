import {createStore, combineReducers} from 'redux'
import userReducer from './modules/userReducer'
import messageReducer from './modules/messageReducer'

let store = createStore(combineReducers({user: userReducer, message: messageReducer}))

export default store