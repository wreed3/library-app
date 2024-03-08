import React, { useState, useEffect } from 'react';
import { BookModel } from '../../models/BookModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { SearchBook } from './components/SearchBook';
import { Pagination } from '../../Utils/Pagination';

export const SearchBooksPage = () => {
	const [books, setBooks] = useState<BookModel[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [httpError, setHttpError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [booksPerPage] = useState<number>(5);
	const [totalAmountOfBooks, setTotalAmountOfBooks] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [searchInput, setSearchInput] = useState<string>('');
	const [searchURL, setSearchURL] = useState<string>('');

	useEffect(() => {
		const fetchBooks = async () => {
			const baseURL: string = 'http://localhost:8080/api/books';

			const pagination: string = `page=${currentPage - 1}&size=${booksPerPage}`;

			let url: string = '';

			if (searchURL === '') {
				url = `${baseURL}?${pagination}`;
			} else {
				url = `${baseURL}${searchURL}&${pagination}`;
			}

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const responseJson = await response.json();

			const responseData = responseJson._embedded.books;

			setTotalAmountOfBooks(responseJson.page.totalElements);
			setTotalPages(responseJson.page.totalPages);

			/*
				To make sure that we follow the Book schema:
        */

			const loadedBooks: BookModel[] = [];

			for (const key in responseData) {
				loadedBooks.push({
					id: responseData[key].id,
					title: responseData[key].title,
					author: responseData[key].author,
					description: responseData[key].description,
					copies: responseData[key].copies,
					copiesAvailable: responseData[key].copiesAvailable,
					category: responseData[key].category,
					img: responseData[key].img,
				});
			}

			setBooks(loadedBooks);
			setIsLoading(false);
		};
		fetchBooks().catch((error: any) => {
			setIsLoading(false);
			setHttpError(error.message);
		});
		window.scrollTo(0, 0);
	}, [booksPerPage, currentPage, searchURL]);

	const searchHandler = () => {
		setCurrentPage(1);
		if (searchInput === '') {
			setSearchURL('');
		} else {
			const trimmedSearchInput = searchInput.trim();
			const searchByTitle: string = `/search/findByTitleContaining?title=${trimmedSearchInput}`;
			setSearchURL(searchByTitle);
		}
	};

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

	const indexOfLastBook: number = currentPage * booksPerPage;
	const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
	let lastItem =
		booksPerPage * currentPage <= totalAmountOfBooks
			? booksPerPage * currentPage
			: totalAmountOfBooks;
	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	const enterPressed = (event: any) => {
		if (event.key === 'Enter') {
			searchHandler();
		}
	};

	return (
		<div>
			<div className="container">
				<div>
					<div className="row mt-5">
						<div className="col-6">
							<div className="d-flex">
								<input
									type="search"
									className="form-control me-2"
									placeholder="Search"
									aria-labelledby="Search"
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={(e) => enterPressed(e)}
								/>
								<button
									onClick={searchHandler}
									className="btn btn-outline-success"
								>
									Search
								</button>
							</div>
						</div>
						<div className="col-4">
							<div className="dropdown">
								<button
									className="btn btn-secondary dropdown-toggle"
									type="button"
									id="dropdownMenuButton1"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									Category
								</button>
								<ul
									className="dropdown-menu"
									aria-labelledby="dropdownMenuButton1"
								>
									<li>
										<a className="dropdown-item" href="#void">
											All
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#void">
											Front End
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#void">
											Back End
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#void">
											Data
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#void">
											DevOps
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					{totalAmountOfBooks > 0 ? (
						<>
							<div className="mt-3">
								<h5>Number of results: ({totalAmountOfBooks})</h5>
							</div>
							<p>
								{indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks}{' '}
								items:
							</p>
							{books.map((book) => (
								<SearchBook book={book} key={book.id} />
							))}
						</>
					) : (
						<div className="m-5">
							<h3>Can't find what your looking for?</h3>
							<a
								type="button"
								href="#void"
								className="btn main-color btn-secondary px-4 me-md-2 fw-bold text-white"
							>
								Library Services
							</a>
						</div>
					)}
					{totalPages > 1 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							paginate={paginate}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
