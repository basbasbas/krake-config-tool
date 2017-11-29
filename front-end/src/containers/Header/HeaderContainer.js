import { connect } from 'react-redux'


import Header from '../../components/Header/Header'


const mapDispatchToProps = {
}

const mapStateToProps = (state) => {
	return {
		items : state.menu.fetchMenuReducer.menu.items,
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(Header)
