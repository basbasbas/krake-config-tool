import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'



export const Header = (props) => (
  <div>
    <h1>[Prototype]</h1>
	  {/*<MenuItem key="/">*/}
	  {/*TODO: Automatically make first page home*/}
	 <IndexLink to='/' activeClassName='route--active'>
		Home
	 </IndexLink>
	  {/*</MenuItem>*/}
	  { props.items ? (
			Object.keys(props.items).map(key => (
		  <span>
			  {' · '}
			  <Link to={ '/page/' + key }>
				  { props.items[key].label || 'no label found' }
			  </Link>
		  </span>
			))
		) : (
			<div>Loading..</div>
	  )}
    {/*<Link to='/counter' activeClassName='route--active'>*/}
      {/*Counter*/}
    {/*</Link>*/}
	  {/*{' · '}*/}
     {/*<Link to='/contentlist' activeClassName='route--active'>*/}
        {/*ContentList*/}
     {/*</Link>*/}
  </div>
)

// const MenuItem = ( key ) => (
// 	<Link to="{/${key}}">
// 		Test
// 	</Link>
// )

export default Header
