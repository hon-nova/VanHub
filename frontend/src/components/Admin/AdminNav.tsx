import React from 'react';
import { User } from '../../../../backend/src/shared/interfaces/index'

interface AdminNavProps {
	user:User,
	handleLogout:()=>void
}

const AdminNav:React.FC<AdminNavProps> = ({ user, handleLogout }) => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: 'black' }}
    >
      <div className="container-fluid">
        {/* Navbar Brand */}
        <a className="navbar-brand" href="/">
		  		<i className="bi bi-incognito"></i>
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
            {/*  <Route path="/auth/admin/" element={<Admin />}>
                  <Route path="posts" element={<AdminPosts />} /> */}
            <li className="nav-item">
              <a className="nav-link" href="/auth/admin/posts">
                Posts
              </a>
            </li>  
				<li className="nav-item">
              <a className="nav-link" href="/auth/admin">
                Users
              </a>
            </li>            
          </ul>
			 <ul className="navbar-nav ms-auto">
            {/* Profile Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/auth/profile"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Profile
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                  <span className="dropdown-item-text text-muted">
                    {user?.email || 'Guest'}
                  </span>
                </li>
                <li>
                  <a className="dropdown-item" href="/auth/profile">
                    Secret Profile
                  </a>
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

export default AdminNav;
