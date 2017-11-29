// import browserHistory from 'react-router/lib/browserHistory'
import fetch from 'isomorphic-fetch'
import { combineReducers } from 'redux'
import _ from 'lodash'

// TODO; utilize store data to apply routing
// TODO; merge overlapping functionality of data and page reducers into utility file

// ------------------------------------
// Constants
// ------------------------------------
// TODO; change hard-coded url
export const BASE_URL = 'http://localhost/api/public'

// Async
export const FETCH_PAGES = 'FETCH_PAGES'
export const UPDATE_PAGES = 'UPDATE_PAGES'

// UI
export const INVALIDATE_PAGE = 'INVALIDATE_PAGE'
export const INVALIDATE_PAGES = 'INVALIDATE_PAGE'
export const INVALIDATE_ALL_PAGES = 'INVALIDATE_ALL_PAGES'
export const RECEIVE_PAGE = 'RECEIVE_PAGE'

// DATA
export const GET_PAGE = 'GET_PAGE'
export const GET_PAGES = 'GET_PAGES'
export const GET_ALL_PAGES = 'GET_ALL_PAGES'
export const GET_COMMON_PAGES = 'GET_COMMON_PAGES'
export const RECEIVE_PAGES = 'RECEIVE_PAGES'

// Continuity
export const GET_LOADED_AND_VALID_PAGE_IDS = 'GET_LOADED_AND_VALID_PAGE_IDS'

export const SELECT_PAGE = 'SELECT_PAGE'

// ------------------------------------
// Sync Actions
// ------------------------------------
// export function getPage(url) {
// 	return {
// 		type    : GET_PAGE,
// 		payload : url
// 	}
// }
// export function receivePage(url, data) {
// 	return {
// 		type    : RECEIVE_PAGE,
// 		payload : {
// 			url,
// 			data,
// 			receivedAt: Date.now()
// 		}
// 	}
// }

export function getPages(url) {
	return {
		type    : GET_PAGES,
		payload: {
			url
		}
	}
}
export function getAllPages() {
	return {
		type    : GET_PAGES,
		payload: {
			type: 'all'
		}
	}
}
export function getCommonPages() {
	return {
		type    : GET_COMMON_PAGES,
		payload: {
			type: 'common'
		}
	}
}
export function invalidatePages(ids) {
	return {
		type    : INVALIDATE_PAGES,
		payload : ids
	}
}
export function invalidateAllPages() {
	return {
		type    : INVALIDATE_ALL_PAGES,
		payload: {
			type: 'all'
		}
	}
}

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
export function receivePages(url, data) {
	return {
		type    : RECEIVE_PAGES,
		payload : {
			url: url,
			pages: data.pages,
			ids: _.map(data.pages, page => page.id),
			receivedAt: Date.now()
		}
	}
}
// Hello

export function selectPage(url) {
	return {
		type: SELECT_PAGE,
		url
	}
}
export function getLoadedAndValidPageIds() {
	return {
		type    : GET_LOADED_AND_VALID_PAGE_IDS,
	}
}

// ------------------------------------
// Async Actions
// ------------------------------------
export function fetchPages(url = '') {

	return function (dispatch) {


		console.log('about to dispatch get pages')
		dispatch(getPages(url))


		var fullUrl = BASE_URL + (url ? '/' + url : '')
		return fetch(fullUrl)
			.then(response => response.json())
			.then(json =>


				dispatch(receivePages(url, json))
			)

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
function page(state = {
	isFetching: false,
	hasInvalidated: false,
	lastUpdated: false,
	data: {}
}, action) {
	switch (action.type) {
		case GET_PAGE:
			return Object.assign({}, state, {
				isFetching: true
			})
		case INVALIDATE_PAGE:
			return Object.assign({}, state, {
				hasInvalidated: true
			})
		case RECEIVE_PAGE:
			return Object.assign({}, state, {
				isFetching: false,
				hasInvalidated: false,
				lastUpdated: action.payload.receivedAt
			})
		default:
			return state
	}
}

function pages(state = {
	isFetching: [], // Urls
	isUpdating: [], // Ids
	loadedAndValidPages: [], // Ids
	invalidPages: [], // Ids
	hasLoadedCommonPages: false,
	data: []
}, action) {
	switch (action.type) {
		case GET_PAGES:
			var data = Object.assign({}, state.data)
			var { url } = action.payload

			// TODO; This cannot associate page urls with page set urls,
			// TODO; load url sets from server; eg common page url with related specific page urls
			var keys = Object.keys(data)
			for (var key of keys) {
				if (key == url) {
					page(data[key], { type: GET_PAGE })
				}
			}
			return Object.assign({}, state, {
				// Unique push
				isFetching: [ ...new Set(state.isFetching.concat(url)) ],
				isUpdating: [ ...new Set(state.isUpdating.concat(keys)) ],
				data: data
			})
		case INVALIDATE_PAGES:
			var data = Object.assign({}, state.data);
			var { ids } = action.payload

			for (var key in data) {
				if (ids.indexOf(key) > -1) {
					page(data[key], { type: INVALIDATE_PAGE })
				}
			}

			return Object.assign({}, state, {
				// Unique concat
				invalidPages: [ ...new Set(state.invalidPages.concat(ids)) ],
				loadedAndValidPages: state.loadedAndValidPages.filter(v => ids.indexOf(v) == -1),
				data: data
			})
		case RECEIVE_PAGES:
			var { url, ids } = action.payload

			// TODO; place below computations here


			return Object.assign({}, state, {
				// TODO; check for common url to tag hasLoadedCommonPages
				// isUpdating: [ ...new Set(state.isUpdating.concat(action.payload.ids)) ],
				isFetching: state.isFetching.filter(v => v != url),
				isUpdating: state.isUpdating.filter(v => ids.indexOf(v) == -1),
				loadedAndValidPages: [ ...new Set(state.loadedAndValidPages.concat(ids)) ],
				// Subtract pageIds from invalidPages array
				invalidPages: state.invalidPages.filter(v => ids.indexOf(v) == -1),
				// TODO; does calling RECEIVE_PAGE even work?
				data: Object.assign({}, state.data, _.mapValues(action.payload.pages, v => page(v, { type: RECEIVE_PAGE, payload: { receivedAt: action.payload.receivedAt } } ))),
				// lastUpdated: action.payload.receivedAt
			})
		default:
			return state
	}
}

function fetchPagesReducer(state = {}, action) {
	switch (action.type) {
		case GET_PAGES:
		case INVALIDATE_PAGES:
		case RECEIVE_PAGES:
			return Object.assign({}, state, {
				pages: pages(state.pages, action)
			})
		default:
			return state
	}
}
function selectedPageReducer(state = '', action) {
	switch (action.type) {
		case SELECT_PAGE:
			return action.url
		default:
			return state
	}
}

const rootReducer = combineReducers({
	fetchPagesReducer,
	selectedPageReducer
})

export default rootReducer
