import { Link } from 'react-router-dom';
import { BookModel } from '../../../models/BookModel';

interface SearchBookProps {
	book: BookModel;
}

export const SearchBook = ({ book }: SearchBookProps) => {
	return (
		<div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
			<div className="row g-0">
				<div className="col-md-2">
					<div className="d-none d-lg-block">
						{book.img ? (
							<img src={book.img} width="123" height="196" alt="Book" />
						) : (
							<img
								src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
								width="123"
								height="196"
								alt="Book"
							/>
						)}
					</div>
					<div className="d-lg-none d-flex justify-content-center align-items-center">
						{book.img ? (
							<img src={book.img} width="123" height="196" alt="Book" />
						) : (
							<img
								src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
								width="123"
								height="196"
								alt="Book"
							/>
						)}
					</div>
				</div>
				<div className="col-md-6">
					<div className="card-body">
						<h5 className="card-title">{book.author}</h5>
						<h4>{book.title}</h4>
						<p className="card-text">{book.description}</p>
					</div>
				</div>
				<div className="col-md-4 d-flex justify-content-center align-items-center">
					<Link
						className="btn btn-secondary main-color text-white"
						to={`/checkout/${book.id}`}
					>
						View Details
					</Link>
				</div>
			</div>
		</div>
	);
};
