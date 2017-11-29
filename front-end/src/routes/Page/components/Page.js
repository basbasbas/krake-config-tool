import React from 'react'
import PropTypes from 'prop-types'
import ListView from '../../ListView/components/ListView'
import ArticleView from '../../ArticleView/components/ArticleView'

export const Page = (props) => {

	var { pages, dataItems } = props
	var page = Object.values(pages).find(page => (page.id == props.params.pageId));
	// Object.keys(props.items).map(key => (
	console.log('PAGE: ')
	console.log(page)

	console.log('hello')
	// Layout that tests store data
	// TODO: organize into more components
	return (
		<span>
		{ page ? (
				<div style={{ margin: '0 auto', textAlign: 'left' }} >
					{ page.views ? (
							<span>
							{ page.views.map(view => {
								{/*var Component = view.type*/}

								var data = Object.values(dataItems).find(item => (item.id == view.id)) || {}
								var content = data.data || []
								if (view.type == 'ArticleView') {
									// TODO: Remove content dependance
									content = data.data.find(item => (item.ARTICLE_ID == view.content_id))

									console.log(content)
								}

								var rest = { view, content }
								var Component = React.createClass({
									render: function() {
										// TODO: This should be easier
										if (view.type == 'ListView') {
											return <ListView { ...rest }>
											</ListView>;
										} else if (view.type == 'ArticleView') {
											return <ArticleView { ...rest }>
											</ArticleView>;
										}
									}
								});

								return (
								<Component { ...rest }></Component>
							)})}
							</span>
						) : (
							<div>Page has no views..</div>
						)}
					{/*{ page.id }*/}
				</div>
			) : (
				<div>No content found..</div>
			)
		}
		</span>)
}

Page.propTypes = {
}

export default Page
