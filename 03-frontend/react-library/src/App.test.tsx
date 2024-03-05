import { App } from './App';

import { screen, render } from '@testing-library/react';

describe('App', () => {
	it('renders', () => {
		render(<App />);
	});
});
