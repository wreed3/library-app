import { useEffect, useState } from 'react';
import { BookModel } from '../../models/BookModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { StarsReview } from '../../Utils/StarsReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';
import { ReviewModel } from '../../models/ReviewModel';
import { LatestReviews } from './LatestReviews';
import { useOktaAuth } from '@okta/okta-react';

export const BookCheckoutPage = () => {
	const { authState } = useOktaAuth();

	const [book, setBook] = useState<BookModel>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [httpError, setHttpError] = useState<string | null>(null);

	//Review State
	const [reviews, setReviews] = useState<ReviewModel[]>([]);
	const [totalStars, setTotalStars] = useState<number>(0);
	const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true);

	//Loans Count State
	const [currentLoansCount, setCurrentLoansCount] = useState<number>(0);
	const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
		useState<boolean>(true);

	//Book Checked Out?
	const [isCheckedOut, setIsCheckedOut] = useState<boolean>(false);
	const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] =
		useState<boolean>(true);

	//grab id params off url
	const bookId = window.location.pathname.split('/')[2];

	useEffect(() => {
		const fetchBook = async () => {
			const baseURL: string = `http://localhost:8080/api/books/${bookId}`;

			const response = await fetch(baseURL);

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const responseJson = await response.json();

			const loadedBook: BookModel = {
				id: responseJson.id,
				title: responseJson.title,
				author: responseJson.author,
				description: responseJson.description,
				copies: responseJson.copies,
				copiesAvailable: responseJson.copiesAvailable,
				category: responseJson.category,
				img: responseJson.img,
			};
			setBook(loadedBook);
			setIsLoading(false);
		};
		fetchBook().catch((error: any) => {
			setIsLoading(false);
			setHttpError(error.message);
		});
	}, [bookId, isCheckedOut]);

	useEffect(() => {
		const fetchBookReviews = async () => {
			const baseURL = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

			const response = await fetch(baseURL);

			if (!response.ok) {
				throw new Error('Something went wrong');
			}

			const responseJson = await response.json();

			const responseData = responseJson._embedded.reviews;

			const loadedReviews: ReviewModel[] = [];

			let weightedStarReviews: number = 0;

			for (const key in responseData) {
				loadedReviews.push({
					id: responseData[key].id,
					userEmail: responseData[key].userEmail,
					date: responseData[key].date,
					rating: responseData[key].rating,
					bookId: responseData[key].bookId,
					reviewDescription: responseData[key].reviewDescription,
				});
				weightedStarReviews = weightedStarReviews + responseData[key].rating;
			}
			if (loadedReviews) {
				const round = (
					Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
				).toFixed(1);
				setTotalStars(Number(round));
			}

			setReviews(loadedReviews);
			setIsLoadingReview(false);
		};
		fetchBookReviews().catch((error: any) => {
			setIsLoadingReview(false);
			setHttpError(error.message);
		});
	}, [bookId]);

	useEffect(() => {
		const fetchUserCurrentLoansCount = async () => {
			if (authState && authState.isAuthenticated) {
				const URL = `http://localhost:8080/api/books/secure/currentloans/count`;
				const requestOptions = {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${authState.accessToken?.accessToken}`,
						'Content-Type': 'application/json',
					},
				};

				const currentLoansCountResponse = await fetch(URL, requestOptions);

				if (!currentLoansCountResponse.ok) {
					throw new Error('Something went wrong!');
				}

				const currentLoansCountResponseJson =
					await currentLoansCountResponse.json();

				setCurrentLoansCount(currentLoansCountResponseJson);
			}
			setIsLoadingCurrentLoansCount(false);
		};
		fetchUserCurrentLoansCount().catch((error: any) => {
			setIsLoadingCurrentLoansCount(false);
			setHttpError(error.message);
		});
	}, [authState, isCheckedOut]);

	useEffect(() => {
		const fetchUserCheckedOutBook = async () => {
			if (authState && authState.isAuthenticated) {
				const URL = `http://localhost:8080/api/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
				const requestOptions = {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${authState.accessToken?.accessToken}`,
						'Content-Type': 'application/json',
					},
				};

				const bookCheckedOut = await fetch(URL, requestOptions);

				if (!bookCheckedOut.ok) {
					throw new Error('Something went wrong!');
				}

				const bookCheckedOutJson = await bookCheckedOut.json();

				setIsCheckedOut(bookCheckedOutJson);
			}
			setIsLoadingBookCheckedOut(false);
		};
		fetchUserCheckedOutBook().catch((error: any) => {
			setIsLoadingBookCheckedOut(false);
			setHttpError(error.message);
		});
	}, [authState, bookId]);

	if (
		isLoading ||
		isLoadingReview ||
		isLoadingCurrentLoansCount ||
		isLoadingBookCheckedOut
	) {
		return <SpinnerLoading />;
	}

	if (httpError) {
		return (
			<div className="container m-5">
				<p>{httpError}</p>
			</div>
		);
	}

	const checkoutBook = async () => {
		const URL = `http://localhost:8080/api/books/secure/checkout/?bookId=${book?.id}`;

		const requestOptions = {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
				'Content-Type': 'application/json',
			},
		};

		const checkoutResponse = await fetch(URL, requestOptions);

		if (!checkoutResponse.ok) {
			throw new Error('Something went wrong');
		}
		setIsCheckedOut(true);
	};

	return (
		<div>
			<div className="container d-none d-lg-block">
				<div className="row mt-5">
					<div className="col-sm-2 col-md-2">
						{book?.img ? (
							<img src={book?.img} width="226" height="349" alt="Book" />
						) : (
							<img
								src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
								width="226"
								height="349"
								alt="book"
							/>
						)}
					</div>
					<div className="col-4 col-md-4 container">
						<div className="ml-2">
							<h2>{book?.title}</h2>
							<h5 className="text-primary">{book?.author}</h5>
							<p className="lead">{book?.description}</p>
							<StarsReview rating={totalStars} size={32} />
						</div>
					</div>
					<CheckoutAndReviewBox
						currentLoansCount={currentLoansCount}
						book={book}
						mobile={false}
						isCheckedOut={isCheckedOut}
						isAuthenticated={authState?.isAuthenticated}
						checkoutBook={checkoutBook}
					/>
				</div>
				<hr />
				<LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
			</div>
			<div className="container d-lg-none mt-5">
				<div className="d-flex justify-content-center align-items-center">
					{book?.img ? (
						<img src={book?.img} width="226" height="349" alt="Book" />
					) : (
						<img
							src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
							width="226"
							height="349"
							alt="book"
						/>
					)}
				</div>
				<div className="mt-4">
					<div className="ml-2">
						<h2>{book?.title}</h2>
						<h5 className="text-primary">{book?.author}</h5>
						<p className="lead">{book?.description}</p>
						<StarsReview rating={totalStars} size={32} />
					</div>
				</div>
				<CheckoutAndReviewBox
					currentLoansCount={currentLoansCount}
					book={book}
					mobile={true}
					isCheckedOut={isCheckedOut}
					isAuthenticated={authState?.isAuthenticated}
					checkoutBook={checkoutBook}
				/>
				<hr />
				<LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
			</div>
		</div>
	);
};
