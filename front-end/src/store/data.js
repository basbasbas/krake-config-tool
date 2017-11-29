// import browserHistory from 'react-router/lib/browserHistory'
import fetch from 'isomorphic-fetch'
import { combineReducers } from 'redux'
import _ from 'lodash'



// ------------------------------------
// Constants
// ------------------------------------
// TODO; extract to config
export const BASE_URL = 'http://localhost/api/public'

// Async
export const FETCH_DATA = 'FETCH_DATA'
export const UPDATE_DATA = 'UPDATE_DATA'

// UI
export const INVALIDATE_DATA_ITEM = 'INVALIDATE_DATA_ITEM'
export const INVALIDATE_DATA = 'INVALIDATE_DATA_ITEM'
export const INVALIDATE_ALL_DATA = 'INVALIDATE_ALL_DATA'
export const RECEIVE_DATA_ITEM = 'RECEIVE_DATA_ITEM'

// DATA
export const GET_DATA_ITEM = 'GET_DATA_ITEM'
export const GET_DATA = 'GET_DATA'
export const GET_ALL_DATA = 'GET_ALL_DATA'
export const GET_COMMON_DATA = 'GET_COMMON_DATA'
export const RECEIVE_DATA = 'RECEIVE_DATA'

// Continuity
export const GET_LOADED_AND_VALID_DATA_ITEM_IDS = 'GET_LOADED_AND_VALID_DATA_ITEM_IDS'

export const SELECT_DATA_ITEM = 'SELECT_DATA_ITEM'

// ------------------------------------
// Sync Actions
// ------------------------------------
// export function getDataItem(url) {
// 	return {
// 		type    : GET_DATA_ITEM,
// 		payload : url
// 	}
// }
// export function receiveDataItem(url, data) {
// 	return {
// 		type    : RECEIVE_DATA_ITEM,
// 		payload : {
// 			url,
// 			data,
// 			receivedAt: Date.now()
// 		}
// 	}
// }

export function getData(url) {
	return {
		type    : GET_DATA,
		payload: {
			url
		}
	}
}
export function getAllData() {
	return {
		type    : GET_DATA,
		payload: {
			type: 'all'
		}
	}
}
export function getCommonData() {
	return {
		type    : GET_COMMON_DATA,
		payload: {
			type: 'common'
		}
	}
}
export function invalidateData(ids) {
	return {
		type    : INVALIDATE_DATA,
		payload : ids
	}
}
export function invalidateAllData() {
	return {
		type    : INVALIDATE_ALL_DATA,
		payload: {
			type: 'all'
		}
	}
}

export function receiveData(url, data) {
	return {
		type    : RECEIVE_DATA,
		payload : {
			url: url,
			data: data.data,
			// dataItemIds: data.data.map(dataItem => dataItem.id),
			ids: _.map(data.data, dataItem => dataItem.id),
			receivedAt: Date.now()
		}
	}
}

export function selectDataItem(url) {
	return {
		type: SELECT_DATA_ITEM,
		url
	}
}
export function getLoadedAndValidDataItemIds() {
	return {
		type    : GET_LOADED_AND_VALID_DATA_ITEM_IDS,
	}
}

// ------------------------------------
// Async Actions
// ------------------------------------
export function fetchData(url = '') {

	return function (dispatch) {
		console.log('fetching data with url: ' + url)
		dispatch(getData(url))


		// TODO; temp url, place this elsewhere
		var fullUrl = BASE_URL + (url ? '/' + url : '')
		return fetch(fullUrl)
			.then(response => response.json())
			.then(json =>


				dispatch(receiveData(url, json))
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
function dataItem(state = {
	isFetching: false,
	hasInvalidated: false,
	data: {}
}, action) {
	switch (action.type) {
		case GET_DATA_ITEM:
			return Object.assign({}, state, {
				isFetching: true
			})
		case INVALIDATE_DATA_ITEM:
			return Object.assign({}, state, {
				hasInvalidated: true
			})
		case RECEIVE_DATA_ITEM:
			return Object.assign({}, state, {
				isFetching: false,
				hasInvalidated: false,
				lastUpdated: action.payload.receivedAt
			})
		default:
			return state
	}
}

function data(state = {
	isFetching: [], // Urls
	isUpdating: [], // Ids
	loadedAndValidData: [], // Ids
	invalidData: [], // Ids
	hasLoadedCommonData: false,
	dataItems: []
}, action) {
	switch (action.type) {
		case GET_DATA:
			var dataItems = Object.assign({}, state.dataItems);
			var { url, ids } = action.payload

			// TODO; This cannot associate dataItem urls with dataItem set urls,
			// TODO; load url sets from server; eg common dataItem url with related specific dataItem urls
			var keys = Object.keys(dataItems)
			for (var key of keys) {
				if (key == url) {
					dataItem(dataItems[key], { type: GET_DATA_ITEM })
				}
			}

			return Object.assign({}, state, {
				// Unique push
				isFetching: [ ...new Set(state.isFetching.concat(url)) ],
				isUpdating: [ ...new Set(state.isUpdating.concat(keys)) ],
				dataItems: dataItems
			})
		case INVALIDATE_DATA:
			var dataItems = Object.assign({}, state.dataItems);
			var { ids } = action.payload

			for (var key in dataItems) {
				if (ids.indexOf(key) > -1) {
					dataItem(dataItems[key], { type: INVALIDATE_DATA_ITEM })
				}
			}

			return Object.assign({}, state, {
				// Unique concat
				invalidData: [ ...new Set(state.invalidData.concat(ids)) ],
				loadedAndValidData: state.loadedAndValidData.filter(v => ids.indexOf(v) == -1),
				dataItems: dataItems
			})
		case RECEIVE_DATA:
			var { url, ids } = action.payload
			return Object.assign({}, state, {
				isFetching: state.isFetching.filter(v => v != url),
				// Subtract dataItemIds from invalidData array
				invalidData: state.invalidData.filter(v => ids.indexOf(v) == -1),
				isUpdating: state.isUpdating.filter(v => ids.indexOf(v) == -1),
				loadedAndValidData: [ ...new Set(state.loadedAndValidData.concat(ids)) ],
				dataItems: Object.assign({}, state.dataItems, _.mapValues(action.payload.data, v => dataItem(v, RECEIVE_DATA_ITEM))),
				lastUpdated: action.payload.receivedAt
			})
		default:
			return state
	}
}


function fetchDataReducer(state = {}, action) {
	switch (action.type) {
		case GET_DATA:
		case INVALIDATE_DATA:
		case RECEIVE_DATA:
			return Object.assign({}, state, {
				data: data(state.data, action)
			})
		default:
			return state
	}
}
function selectedDataItemReducer(state = '', action) {
	switch (action.type) {
		case SELECT_DATA_ITEM:
			return action.url
		default:
			return state
	}
}




const rootReducer = combineReducers({
	fetchDataReducer,
	selectedDataItemReducer
})

export default rootReducer
