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

	useEffect(() => {
		const fetchBooks = async () => {
			const baseURL: string = 'http://localhost:8080/api/books';

			const pagination: string = `?page=${
				currentPage - 1
			}&size=${booksPerPage}`;
			const url: string = `${baseURL}${pagination}`;

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const responseJson = await response.json();
			console.log('responseJson', responseJson);

			const responseData = responseJson._embedded.books;

			setTotalAmountOfBooks(responseJson.page.totalElements);
			setTotalPages(responseJson.page.totalPages);

			/*
		
				To make sure that we follow the Book schema:

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
      
          */

			setBooks(responseData);
			setIsLoading(false);
		};
		fetchBooks().catch((error: any) => {
			setIsLoading(false);
			setHttpError(error.message);
		});
		window.scrollTo(0, 0);
	}, [currentPage]);

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

	// const indexOfLastBook: number = currentPage * booksPerPage;
	// const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
	// let lastItem =
	// 	booksPerPage * currentPage <= totalAmountOfBooks
	// 		? booksPerPage * currentPage
	// 		: totalAmountOfBooks;
	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
								/>
								<button className="btn btn-outline-success">Search</button>
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
					<div className="mt-3">
						<h5>Number of results: ({totalAmountOfBooks})</h5>
					</div>
					<p>
						{currentPage} to {booksPerPage} of {totalAmountOfBooks} items:
					</p>
					{books.map((book) => (
						<SearchBook book={book} key={book.id} />
					))}
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
