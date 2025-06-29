import React from 'react'

import Header from './components/Header'
import Footer from './components/Footer'

import AppRouter from './routes/AppRouter'




const App: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <Header />
        <div className="grid grid-cols-1 md:grid-cols-10 min-h-screen">
          <main className="md:col-span-9 p-6 bg-white">
            {/* <h1 className="text-2xl font-bold mb-4 "> */}
              {/* <Home/> */}
              <AppRouter/>
            {/* </h1> */}
          </main>
        </div>
      <Footer />
    </div>
  )
}

export default App
