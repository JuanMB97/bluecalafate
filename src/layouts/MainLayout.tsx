import { Outlet } from 'react-router';
import { NavBar } from '../components/navbar/navbar';
import { Footer } from '../components/footer/footer';

export function MainLayout() {
  return (
    <div className="main-layout">
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
