import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light mb-3">
      <div className="container">
        <Link classname="navbar-brand" to="/">
          vidly
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto">
            {!user && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            {user && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/movies">
                    Movies
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/customers">
                    Customers
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/rentals">
                    Rentals
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/profile">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-item nav-link" to="/logout">
                    Logout
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            <li className="nav-item"></li>
          </ul>
        </div>
      </div>
    </nav>

    // <nav className="navbar navbar-expand-lg navbar-light bg-light">
    //   <Link classname="navbar-brand" to="/">
    //     vidly
    //   </Link>
    //   <button
    //     className="navbar-toggler"
    //     type="button"
    //     data-toggle="collapse"
    //     data-target="#navbarNavAltMarkup"
    //     aria-controls="navbarNavAltMarkup"
    //     aria-expanded="false"
    //     aria-label="Toggle navigation"
    //   >
    //     <span className="navbar-toggler-icon" />
    //   </button>
    //   <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
    //     <div className="navbar-nav">
    //       <NavLink className="nav-item nav-link" to="/movies">
    //         Movies
    //       </NavLink>
    //       <NavLink className="nav-item nav-link" to="/customers">
    //         Customers
    //       </NavLink>
    //       <NavLink className="nav-item nav-link" to="/rentals">
    //         Rentals
    //       </NavLink>
    //       {!user && (
    //         <React.Fragment>
    //           <NavLink className="nav-item nav-link" to="/login">
    //             Login
    //           </NavLink>
    //           <NavLink className="nav-item nav-link" to="/register">
    //             Register
    //           </NavLink>
    //         </React.Fragment>
    //       )}
    //       {user && (
    //         <React.Fragment>
    //           <NavLink className="nav-item nav-link" to="/profile">
    //             Profile
    //           </NavLink>
    //           <NavLink className="nav-item nav-link" to="/logout">
    //             Logout
    //           </NavLink>
    //         </React.Fragment>
    //       )}
    //     </div>
    //   </div>
    // </nav>
  );
};

export default NavBar;
