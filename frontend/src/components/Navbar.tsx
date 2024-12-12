import React from 'react';
import { User } from '../../../backend/src/shared/interfaces/index'
import { Link } from 'react-router-dom';

interface NavbarProps {
	user:User,
	handleLogout:()=>void
}

const Navbar:React.FC<NavbarProps> = ({ user, handleLogout }) => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: '#004a77' }}
    >
      <div className="container-fluid">
        {/* Navbar Brand */}
        <a className="navbar-brand" href="/">
          MyApp
        </a>
        {/* Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Posts Link */}
            <li className="nav-item">
              <a className="nav-link" href="/public/posts">
                Posts
              </a>
            </li>            
          </ul>
			 <ul className="navbar-nav ms-auto">
            {/* Profile Dropdown */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"                
              >
                Profile
              </Link>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                  <span className="dropdown-item-text text-muted">
                    {user?.email || 'Guest'}
                  </span>
                </li>
                <li>
                  <Link className="dropdown-item" to="/user/profile" state={{ user }}>
                  <i className="bi bi-person-lines-fill mx-2"></i>View Profile
                  </Link>
                </li>                
              </ul>
            </li>

            {/* Logout Button */}
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger ms-3"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
