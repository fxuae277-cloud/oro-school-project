import { Route, Routes } from 'react-router';
import { Footer, Navbar } from '@/components/Layout';
import About from '@/pages/About';
import Create from '@/pages/Create';
import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import Templates from '@/pages/Templates';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffdf8]">
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
