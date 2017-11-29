import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import makeRootReducer from './reducers'
import { updateLocation } from './location'
import { fetchPages } from './page'
import { fetchData } from './data'
import { fetchMenu } from './menu'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []

  let composeEnhancers = compose

  if (__DEV__) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
	// const store = {}
	// const persistedState =
	// 	localStorage.getItem('testCacheState')
	// 		? JSON.parse(localStorage.getItem('testCacheState'))
	// 		: {}

	// if (localStorage.getItem('testCacheState')) {
	// 	store = createStore(reducer, persistedState)
	// }
	// else {
	const store = createStore(
			makeRootReducer(),
			initialState,
			composeEnhancers(
				applyMiddleware(...middleware),
				...enhancers
			)
		)
	// }


  store.asyncReducers = {}

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }


// TODO: Extract these, implement with routing
store.dispatch(fetchPages('api/pages')).then(() =>
	console.log('pages fetched and received')
)
store.dispatch(fetchData('api/data')).then(() =>
	console.log('data fetched and received')
)
store.dispatch(fetchMenu('api/menu')).then(() =>
	console.log('menu fetched and received')
)

   // TODO: Wrap in subscribe event; run after dispatchers are finished
 // store.subscribe(()=>{
	// 	localStorage.setItem('testCacheState',
	// 		JSON.stringify(store.getState()))
 // })


	return store
}
