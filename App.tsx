
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import States from './pages/States';
import StateDetail from './pages/StateDetail';
import Districts from './pages/Districts';
import Predictor from './pages/Predictor';
import Dataset from './pages/Dataset';
import About from './pages/About';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/states" element={<States />} />
            <Route path="/states/:stateName" element={<StateDetail />} />
            <Route path="/districts" element={<Districts />} />
            <Route path="/predictor" element={<Predictor />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </HashRouter>
  );
};

export default App;
