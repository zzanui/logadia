import React from 'react'

import Header from './components/Header'
import Footer from './components/Footer'

import AppRouter from './routes/AppRouter'




const App: React.FC = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-200">
      <Header />
        <div className="grid grid-cols-1 md:grid-cols-10 min-h-screen">
          <main className="md:col-span-9 p-6 bg-emerald">
              <AppRouter/>
          </main>
        </div>
      <Footer />
    </div>
  )
}

export default App
