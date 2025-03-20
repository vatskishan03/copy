import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClipboardArea from './components/ClipboardArea';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import TextEditor from './components/TextEditor';


const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div className="space-y-8">
                <h1 className="text-3xl font-bold">Welcome to Clipboard</h1>
                <TextEditor />
              </div>
            } />
            <Route path="/clipboard" element={<ClipboardArea />} />
            <Route path="/create" element={<TextEditor />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;