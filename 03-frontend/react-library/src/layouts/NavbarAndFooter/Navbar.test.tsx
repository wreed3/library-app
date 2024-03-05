import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
	it('renders', () => {
		render(<Navbar />);

		const brandName = screen.getByTestId('brandName').innerHTML;
		const homeButtonLink = screen.getByText('Home').innerHTML;
		const searchBooksLink = screen.getByText('Search Books').innerHTML;
		const signInLink = screen.getByText('Sign In').innerHTML;

		expect(brandName).toEqual('Library Your Way');
		expect(homeButtonLink).toEqual('Home');
		expect(searchBooksLink).toEqual('Search Books');
		expect(signInLink).toEqual('Sign In');
	});
});
