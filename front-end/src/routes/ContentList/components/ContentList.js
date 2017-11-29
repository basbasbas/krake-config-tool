import React from 'react'
import PropTypes from 'prop-types'

export const ContentList = (props) => {

	// TODO; possibly redundant
	// function getData(id) {
	// 	{Object.keys(props.dataItems).map(function(item){
	// 		if (item.id == id) {
	// 			return item.data
	// 		}
	// 	})};
	//
	// 	return []
	// }

	// Layout that tests store data
	// TODO: organize into more components
	return <div style={{ margin: '0 auto' }} >
		<ul>
			{Object.keys(props.pages).map(function(url){
				let page = props.pages[url]
				return <div>
					<h4>API url: {url}</h4>
					<h4>Front-end url: {page.id}</h4>
					{page.views.map(function(view) {
						return <div>
							<h5>View that shows data with id: {view.id}</h5>
							{Object.keys(props.dataItems).map(function(url){
								let bundle = props.dataItems[url]
								let htmlArr = []
								let amount = view.amount
								let currAmount = 0

								if (bundle.id == view.id) {
									{bundle.data.map(function(item) {

										if (currAmount < amount) {
											htmlArr.push(<div>
												<p>---------------------</p>
												<p>Author: {item.author}</p>
												<p>Title: {item.title}</p>
												<p>Content: {item.content}</p>
											</div>)
										}

										currAmount++
									})}
								}

								return <div>{htmlArr}</div>
							})}
						</div>
					})}
					<br />
				</div>
			})}
		</ul>
	</div>
}

ContentList.propTypes = {
}

export default ContentList
