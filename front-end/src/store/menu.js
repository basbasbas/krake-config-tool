// import browserHistory from 'react-router/lib/browserHistory'

// TODO; no need to fetch async, action is called from page module fetch
import fetch from 'isomorphic-fetch'
import { combineReducers } from 'redux'
import _ from 'lodash'

// TODO; utilize store data to apply routing
// TODO; merge overlapping functionality of data, menu and page reducers into utility file

// ------------------------------------
// Constants
// ------------------------------------
// TODO; change hard-coded url
export const BASE_URL = 'http://localhost/api/public'

// Async
export const FETCH_MENU = 'FETCH_MENU'
// export const UPDATE_MENU = 'UPDATE_MENU'

// UI
// export const INVALIDATE_MENU_ITEM = 'INVALIDATE_MENU_ITEM'
export const INVALIDATE_MENU = 'INVALIDATE_MENU'
// export const INVALIDATE_ALL_MENU = 'INVALIDATE_ALL_MENU'

// DATA
// export const GET_MENU_ITEM = 'GET_MENU_ITEM'
export const GET_MENU = 'GET_MENU'
export const RECEIVE_MENU = 'RECEIVE_MENU'
export const RECEIVE_ITEM = 'RECEIVE_ITEM'
export const SELECT_MENU = 'SELECT_MENU'

// Continuity
export const GET_LOADED_AND_VALID_MENU = 'GET_LOADED_AND_VALID_MENU'

// export const SELECT_PAGE = 'SELECT_PAGE'

export function getMenu(url) {
	return {
		type    : GET_MENU,
		payload: {
			url
		}
	}
}
export function receiveMenu(data) {
	return {
		type    : RECEIVE_MENU,
		payload : {
			menu: data,
			receivedAt: Date.now()
		}
	}
}
// export function getAllPages() {
// 	return {
// 		type    : GET_PAGES,
// 		payload: {
// 			type: 'all'
// 		}
// 	}
// }
// export function getCommonPages() {
// 	return {
// 		type    : GET_COMMON_PAGES,
// 		payload: {
// 			type: 'common'
// 		}
// 	}
// }
export function invalidateMenuItems() {
	return {
		type    : INVALIDATE_MENU,
	}
}
// export function invalidateAllPages() {
// 	return {
// 		type    : INVALIDATE_ALL_PAGES,
// 		payload: {
// 			type: 'all'
// 		}
// 	}
// }

// export function receivePage(data) {
// 	return {
// 		type    : RECEIVE_PAGES,
// 		payload : {
// 			pages: data.pages,
// 			pageIds: data.pages.map(page => page.id),
// 			receivedAt: Date.now()
// 		}
// 	}
// }
// Hello

export function selectMenuItem(id) {
	return {
		type: SELECT_MENU_ITEM,
		id
	}
}
export function getLoadedAndValidMenu() {
	return {
		type    : GET_LOADED_AND_VALID_MENU,
	}
}
// // ------------------------------------
// // Async Actions
// // ------------------------------------
export function fetchMenu(url = '') {

	return function (dispatch) {


		dispatch(getMenu(url))


		var fullUrl = BASE_URL + (url ? '/' + url : '')
		return fetch(fullUrl)
			.then(response => response.json())
			.then(json => {
					console.log('dispatching receive menu');
					dispatch(receiveMenu(json))
			})

		// TODO: Catch errors
	}
}
export function update (url) {
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
// export const updateLocation = ({ dispatch }) => {
// 	return (nextLocation) => dispatch(locationChange(nextLocation))
// }

// ------------------------------------
// Reducer
// ------------------------------------
function item(state = {
	label: '',
	children: [],
}, action) {
	switch (action.type) {
		case RECEIVE_ITEM:
			return Object.assign({}, state, {
				// url: action.payload.url,
				// Recursion
				// label: action.payload.label,
			})
		default:
			return state
	}
}

function items(state = {
	isFetching: false, // Urls
	hasInvalidated: false,
	lastUpdated: false,
	items: []
}, action) {
	switch (action.type) {
		case GET_MENU:
			// var data = Object.assign({}, state.data)
			// var { url } = action.payload
			//
			// // TODO; This cannot associate page urls with page set urls,
			// // TODO; load url sets from server; eg common page url with related specific page urls
			// var keys = Object.keys(data)
			// for (var key of keys) {
			// 	if (key == url) {
			// 		page(data[key], { type: GET_PAGE })
			// 	}
			// }
			return Object.assign({}, state, {
				// Unique push
				isFetching: true,
				// data: data
			})
		case INVALIDATE_MENU:

			return Object.assign({}, state, {
				// Unique concat
				hasInvalidated: true,
			})
		case RECEIVE_MENU:
			var { menu, receivedAt } = action.payload
			// var menuList = Object.keys(menu).map(key => {
			// 	return {
			// 		id: key,
			// 		label: menu[key].label,
			// 		children: menu[key].children
			// 	}
			// })
			return Object.assign({}, state, {
				// TODO; check for common url to tag hasLoadedCommonPages
				// isUpdating: [ ...new Set(state.isUpdating.concat(action.payload.ids)) ],
				isFetching: false,
				hasInvalidated: false,
				lastUpdated: action.payload.receivedAt,
				// menu: Object.assign({}, state.data, _.mapValues(menu, v => item(v, { type: RECEIVE_ITEM, payload: menuList } ))),
				items: Object.assign({}, state.data, _.mapValues(menu, v => item(v, { type: RECEIVE_ITEM } ))),
				// lastUpdated: action.payload.receivedAt
			})
		default:
			return state
	}
}

function fetchMenuReducer(state = {}, action) {
	switch (action.type) {
		case GET_MENU:
		case INVALIDATE_MENU:
		case RECEIVE_MENU:
			return Object.assign({}, state, {
				menu: items(state.menu, action)
			})
		default:
			return state
	}
}
// TODO: is needed?
function selectedItemReducer(state = '', action) {
	switch (action.type) {
		case SELECT_MENU:
			// return action.url
			return state
		default:
			return state
	}
}

const rootReducer = combineReducers({
	fetchMenuReducer,
	selectedItemReducer
})

export default rootReducer
