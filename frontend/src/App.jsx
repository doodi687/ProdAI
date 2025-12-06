import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Compare from './pages/Compare';
import Chat from './pages/Chat';
import Recommendations from './pages/Recommendations';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-mesh flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/recommendations" element={<Recommendations />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f1f5f9',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f1f5f9',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
