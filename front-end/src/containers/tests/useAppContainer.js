
// TODO: Utilize with enzyme, apply this test to test routing

const [, wrapper] = renderAppWithState({
	// Apply basic structure
});
const articlesButton = wrapper.find(' ... ');

expect(store.getState()).toContain({
	id: 'Home',
});

articlesButton.simulate('click');

return flushAllPromises().then(() => {
	expect(store.getState()).toContain({
		id: 'Articles',
	});
});
