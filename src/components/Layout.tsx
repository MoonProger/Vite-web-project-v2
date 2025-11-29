import { PropsWithChildren } from 'react';
import NavBar from './NavBar';

const Layout = ({ children }: PropsWithChildren) => (
  <div className="container">
    <NavBar />
    <main className="page-content">{children}</main>
  </div>
);

export default Layout;

