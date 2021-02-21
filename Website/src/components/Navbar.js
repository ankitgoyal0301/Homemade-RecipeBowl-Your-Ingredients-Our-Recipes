import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css';
import logo1 from './logo1.png';

function Navbar()
{
	const [click, setClick] = useState(false);
	const [button, setButton] = useState(true);

	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);

	const showButton = () => {
	    if (window.innerWidth <= 960) {
	      setButton(false);
	    } else {
	      setButton(true);
	    }
	};

	const useEffect = (() => {showButton();}, []);

  	window.addEventListener('resize', showButton);

  	function logout() {
  		localStorage.setItem("loggedIn", "false");
		localStorage.setItem("username", "");
		window.open("/","_self");
  	}

	return (
		<>
			<nav className="navbar">
				<div className="navbar-container">
					<a href="/">
						<div className="logo-image">
							<img src={logo1} alt="logo1"/>
				      	</div>
					</a>

					<Link to="/" className="navbar-logo" onClick={closeMobileMenu}>RecipeBowl</Link>

					<div className='menu-icon' onClick={handleClick}>
						<i className={click ? 'fas fa-times' : 'fas fa-bars'} />
					</div>

					<ul className={click ? 'nav-menu active' : 'nav-menu'}>
						<li className='nav-item'>
							<Link to='/' className='nav-links' onClick={closeMobileMenu}>
								Home
							</Link>
						</li>

						{localStorage.getItem("loggedIn")==="true" ?
							<li className='nav-item'>
								<Link to='/feed' className='nav-links' onClick={closeMobileMenu}>
									Feed
								</Link>
							</li> :

							<li className='nav-item'>
								<Link to='/sign_up' className='nav-links' onClick={closeMobileMenu}>
									Feed
								</Link>
							</li>
						}

						<li className='nav-item'>
							<Link to='/about' className='nav-links' onClick={closeMobileMenu}>
								About Us
							</Link>
						</li>

						{localStorage.getItem("loggedIn")==="true" ?
							<li className='nav-item'>
								<Link to='/dashboard' className='nav-links' onClick={closeMobileMenu}>
									Dashboard
								</Link>
							</li> :

							<li className='nav-item'>
								<Link to='/sign_up' className='nav-links' onClick={closeMobileMenu}>
									Dashboard
								</Link>
							</li>
						}


						{localStorage.getItem("loggedIn")==="true" ?
							<li className='nav-item'>
								<Link to='/sign_up' className='nav-links-mobile' onClick={closeMobileMenu}>
									LOGOUT
								</Link>
							</li> :
							<li className='nav-item'>
								<Link to='/sign_up' className='nav-links-mobile' onClick={closeMobileMenu}>
									LOGIN
								</Link>
							</li>
						}
					</ul>

					{localStorage.getItem("loggedIn")==="true" ?
						button && <Button linkTo='/' buttonStyle='btn--outline' onClick={logout}>LOGOUT</Button> :
						button && <Button linkTo='/sign_up' buttonStyle='btn--outline'>LOGIN</Button>
					}


				</div>
			</nav>
		</>
	);
}

export default Navbar;
