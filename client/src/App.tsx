import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClipboardHub from './components/ClipboardHub';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ThemeProvider } from './components/provider/ThemeProvider';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-[#f0e6d6] dark:bg-slate-950">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="space-y-8">
                  <ClipboardHub />
                  <div className="mt-8 p-4 bg-[#f8f3e9] dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-lg shadow-sm md:col-span-3">
                    <h3 className="text-lg font-medium text-amber-900 dark:text-amber-200 mb-2">
                      How to use CopyIt
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-amber-800 dark:text-amber-300">
                      <li>Enter your text in the editor</li>
                      <li>Click <strong>Create</strong> to generate a unique token</li>
                      <li>Share the token with others</li>
                      <li>Others can paste the token in <strong>Join Collaboration</strong> field and click <strong>Receive</strong> to join your session</li>
                      <li>You can <strong>collaborate</strong> with others and edit the text (like google docs) in <strong>real-time</strong> </li>
                    </ol>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
          <SpeedInsights />
          <Analytics />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;