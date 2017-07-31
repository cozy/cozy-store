
import React from 'react'

import Sidebar from './Sidebar'
import AppRoutes from './AppRoutes'

const App = () => (
  <div className='sto-wrapper coz-sticky'>
    <Sidebar />
    <main className='sto-content'>
      <AppRoutes />
    </main>
  </div>
)
export default App
