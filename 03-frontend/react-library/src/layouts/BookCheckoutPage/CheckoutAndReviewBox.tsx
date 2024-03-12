import { Link } from 'react-router-dom';
import { BookModel } from '../../models/BookModel';
import { useEffect, useState } from 'react';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { useOktaAuth } from '@okta/okta-react';

interface CheckoutAndReviewBoxProps {
	book: BookModel | undefined;
	mobile: boolean;
}

export const CheckoutAndReviewBox = ({
	book,
	mobile,
}: CheckoutAndReviewBoxProps) => {
	const { authState } = useOktaAuth();

	const [currentLoanCount, setCurrentLoanCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [httpError, setHttpError] = useState<string | null>(null);
	useEffect(() => {
		const currentLoanCount = async () => {
			const baseURL =
				'http://localhost:8080/api/books/secure/currentloans/count';

			const response = await fetch(baseURL);
			const responseJson = await response.json();

			setCurrentLoanCount(responseJson);
			setIsLoading(false);
		};
		currentLoanCount().catch((error: any) => {
			setIsLoading(false);
			setHttpError(error.message);
		});
	}, []);

	if (isLoading) {
		return <SpinnerLoading />;
	}

	if (httpError) {
		return (
			<div className="container m-5">
				<p>{httpError}</p>
			</div>
		);
	}

	return (
		<div
			className={
				mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'
			}
		>
			<div className="card-body container">
				<div className="mt-3">
					{authState?.isAuthenticated ? (
						<p>
							<b> {currentLoanCount}/5 </b>
							books checked out
						</p>
					) : (
						<p>
							<b> 0/5 </b>
							books checked out
						</p>
					)}

					<hr />
					{book && book.copiesAvailable && book.copiesAvailable > 0 ? (
						<h4 className="text-success">Available</h4>
					) : (
						<h4 className="text-danger">Wait List</h4>
					)}
					<div className="row">
						<p className="col-6 lead">
							<b>{book?.copies} </b>
							copies
						</p>
						<p className="col-6 lead">
							<b>{book?.copiesAvailable} </b>
							available
						</p>
					</div>
				</div>
				{authState?.isAuthenticated ? (
					<Link to="/#void" className="btn btn-success btn-lg">
						Check Out
					</Link>
				) : (
					<Link to="/#void" className="btn btn-success btn-lg">
						Sign In
					</Link>
				)}
				<hr />
				<p className="mt-3">
					This number can change until placing order has been complete
				</p>
				<p>Sign in to be able to leave a review</p>
			</div>
		</div>
	);
};
