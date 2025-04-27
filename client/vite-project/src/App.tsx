import Signup from './components/Signup.tsx'
import PWABadge from './PWABadge.tsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Signin from './components/Signin.tsx';
import Otp from './components/Otp.tsx';
import Dashboard from './components/Dashboard.tsx';
import Example from './components/ShimmerNotes.tsx';
import Landing from './components/Landing.tsx';
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />}/>
        <Route path='/Signup' element={<Signup />}/>
        <Route path='/signin' element={<Signin />}/>
        <Route path='/otp' element={<Otp />}/>
        <Route path='/lo' element={<Example />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
      </BrowserRouter>



      <Toaster  
       position="bottom-right"
       reverseOrder={false} 
       toastOptions={{
        className: '',
        style: {
          border: '1px solid #713200',
          marginRight:"100px",
          padding: '10px',
          
        },
      }}
       /> 
    <PWABadge />
    </>
  )
}

export default App
