import React from 'react';

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
			<div className="container-fluid">
				<span data-testid="brandName" className="navbar-brand">
					Library Your Way
				</span>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavDropdown"
					aria-controls="navbarNavDropdown"
					aria-expanded="false"
					aria-label="Toggle Navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNavDropdown">
					<ul className="navbar-nav">
						<li className="nav-item">
							<a className="nav-link" href="#void">
								Home
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="#void">
								Search Books
							</a>
						</li>
					</ul>
					<ul className="navbar-nav ms-auto">
						<li className="nav-item m-1">
							<a type="button" className="btn btn-outline-light" href="#void">
								Sign In
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
