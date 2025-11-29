import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'News' },
  { to: '/cats', label: 'Cats' },
  { to: '/meals', label: 'Recipes' },
];

const NavBar = () => (
  <header className="site-nav">
    <nav className="nav-center">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </header>
);

export default NavBar;

