import React from 'react'
import PropTypes from 'prop-types'

export const ListView = (props) => {


	var { view, content } = props

	// TODO: Replace || clause with 'defaults' object
	var amount = view.amount || 5

	// Layout that tests store data
	// TODO: organize into more components
	return <div style={{ margin: '0 auto' }} >
		<ul>
			{ [...Array(amount)].map((x, i) => {
				var item = props.content[i] || {}
				var maxLength = 300

				return <div>
					<h4>{ item.title || 'Geen titel gevonden..' }</h4>
					<p>{ (item.content.length > maxLength ? item.content.substring(0, maxLength) + '..' : item.content) || 'Geen content gevonden..' }</p>
					<br />
				</div>
			})}
		</ul>
	</div>

}

ListView.propTypes = {
	view     : PropTypes.object.isRequired,
	content  : PropTypes.array.isRequired,
}

export default ListView
