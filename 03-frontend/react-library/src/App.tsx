import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Navigate, Route, Routes } from 'react-router-dom';

export const App = () => {
	return (
		<div className="d-flex flex-column min-vh-100">
			<Navbar />
			<div className="flex-grow-1">
				<Routes>
					<Route path="/" element={<Navigate replace to="home" />} />
					<Route path="home" element={<HomePage />} />
					<Route path="search" element={<SearchBooksPage />} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
};
