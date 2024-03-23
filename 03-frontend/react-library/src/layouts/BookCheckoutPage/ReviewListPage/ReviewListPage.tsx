import { useEffect, useState } from 'react';
import { ReviewModel } from '../../../models/ReviewModel';
import { SpinnerLoading } from '../../../Utils/SpinnerLoading';
import { Pagination } from '../../../Utils/Pagination';
import { Review } from '../../../Utils/Review';

export const ReviewListPage = () => {
	const [reviews, setReviews] = useState<ReviewModel[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [httpError, setHttpError] = useState<string | null>(null);

	//Pagination
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [reviewsPerPage] = useState<number>(5);
	const [totalAmountOfReviews, setTotalAmountOfReviews] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(0);

	const bookId = window.location.pathname.split('/')[2];

	useEffect(() => {
		const fetchBookReviews = async () => {
			const baseURL = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

			const pagination: string = `&page=${
				currentPage - 1
			}&size=${reviewsPerPage}`;

			const url = `${baseURL}${pagination}`;

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error('Something went wrong');
			}

			const responseJson = await response.json();

			const responseData = responseJson._embedded.reviews;

			setTotalAmountOfReviews(responseJson.page.totalElements);
			setTotalPages(responseJson.page.totalPages);

			const loadedReviews: ReviewModel[] = [];

			for (const key in responseData) {
				loadedReviews.push({
					id: responseData[key].id,
					userEmail: responseData[key].userEmail,
					date: responseData[key].date,
					rating: responseData[key].rating,
					bookId: responseData[key].bookId,
					reviewDescription: responseData[key].reviewDescription,
				});
			}

			setReviews(loadedReviews);
			setIsLoading(false);
		};
		fetchBookReviews().catch((error: any) => {
			setIsLoading(false);
			setHttpError(error.message);
		});
	}, [currentPage, bookId, reviewsPerPage]);

	if (isLoading) {
		return <SpinnerLoading />;
	}

	if (httpError) {
		<div className="container m-5">
			<p>{httpError}</p>
		</div>;
	}

	const indexOfLastReview: number = currentPage * reviewsPerPage;
	const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

	let lastItem =
		reviewsPerPage * currentPage <= totalAmountOfReviews
			? reviewsPerPage * currentPage
			: totalAmountOfReviews;

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<div className="container m-5">
			<div>
				<h3>Comments: ({reviews.length})</h3>
			</div>
			<p>
				{indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
			</p>
			<div className="row">
				{reviews.map((review) => (
					<Review review={review} key={review.id} />
				))}
			</div>
			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					paginate={paginate}
				/>
			)}
		</div>
	);
};
