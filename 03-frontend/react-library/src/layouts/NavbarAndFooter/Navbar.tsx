import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

export const Navbar = () => {
	const { oktaAuth, authState } = useOktaAuth();

	if (!authState) {
		return <SpinnerLoading />;
	}

	const handleLogout = async () => oktaAuth.signOut();

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
							<NavLink className="nav-link" to="/home">
								Home
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/search">
								Search Books
							</NavLink>
						</li>
					</ul>
					<ul className="navbar-nav ms-auto">
						{!authState.isAuthenticated ? (
							<li className="nav-item m-1">
								<NavLink
									type="button"
									className="btn btn-outline-light"
									to="/login"
								>
									Sign In
								</NavLink>
							</li>
						) : (
							<li>
								<button
									className="btn btn-outline-light"
									onClick={handleLogout}
								>
									Logout
								</button>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};
