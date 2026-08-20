import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import './student.css'
import StudentApp from './StudentApp'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StudentApp />
  </React.StrictMode>,
)
