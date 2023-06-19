import Authentication from './pages/authentication/Authentication';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgetPassword from './pages/forgetPassword/ForgetPassword';
import MultiStepForm from './pages/multiStepForm/MultiStepForm';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/forgotpassword" element={<ForgetPassword />}></Route>
          <Route path="/" element={<Authentication />}></Route>
          <Route path="/form" element={<MultiStepForm />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
