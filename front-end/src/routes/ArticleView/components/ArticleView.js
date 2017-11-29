import React from 'react'
import PropTypes from 'prop-types'

export const ArticleView = (props) => {


	var { view, content } = props

	// TODO: Replace || clause with 'defaults' object

	// Layout that tests store data
	// TODO: organize into more components
	return <div style={{ margin: '0 auto' }} >
		<ul>
				 <div>
					<h4>{ content.title || 'Geen titel gevonden..' }</h4>
					<p>{ content.content || 'Geen content gevonden..' }</p>
					<br />
				</div>
		</ul>
	</div>

}

ArticleView.propTypes = {
}

export default ArticleView
