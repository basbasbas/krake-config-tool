import { connect } from 'react-redux'


import ContentList from '../components/ContentList'


const mapDispatchToProps = {
}

const mapStateToProps = (state) => {
	return {
		dataItems : state.data.fetchDataReducer.data.dataItems,
		pages : state.page.fetchPagesReducer.pages.data
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(ContentList)
