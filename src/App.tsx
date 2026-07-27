import { Route, Routes } from 'react-router';
import './App.css'
import AppMain from './pages/AppMain';
import PeritoApp from './pages/peritoMoreno';
import ServiceApp from './pages/services';
import ElChalten from './pages/elchalten';

function App() {


  return (
    <Routes>
      <Route path='/' element={<AppMain/>} />
      <Route path='/services' element={<ServiceApp/>} />
      <Route path='/ourteam' element={<AppMain/>} />
      <Route path='/contact' element={<AppMain/>} />
      <Route path='/elchalten' element={<ElChalten/>} />
      <Route path='/peritomoreno' element={<PeritoApp/>} />
    </Routes>
  )
}

export default App;
