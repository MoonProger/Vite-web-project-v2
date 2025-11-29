import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NewsPage from './pages/NewsPage';
import CatsPage from './pages/CatsPage';
import MealsPage from './pages/MealsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<NewsPage />} />
        <Route path="/cats" element={<CatsPage />} />
        <Route path="/meals" element={<MealsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;

