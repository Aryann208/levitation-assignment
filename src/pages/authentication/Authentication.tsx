import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../store/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../../components/formContainer/FormContainer';
import LabelInput from '../../components/labelInput/LabelInput';
import './Authentication.css';

const Authentication = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext) || {
    authCode: '',
    authStore: () => {},
  };

  const [email, setEmail] = useState('');
  const [auth, setAuth] = useState<any>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNameChange = (value: string) => {
    setEmail(value);
    setErrorMsg(errorMsg);
    setErrorMsg('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrorMsg('');
  };

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://x8ki-letl-twmt.n7.xano.io/api:XooRuQbs/auth/login`;
    const data = {
      email: email,
      password: password,
    };

    try {
      const res = await axios.post(url, data);

      authContext.authStore(res?.data.authToken);
      setAuth(res.data.authToken);

      if (res.status === 200) {
        setError(false);
        setErrorMsg('');
        navigate('/form');
      } else {
        setError(true);
        setErrorMsg('Invalid credentials');
      }
    } catch (err: any) {
      setError(true);
      setErrorMsg('An error occurred');
      setAuth(err);
    }
    if (authContext?.authCode.trim().length > 0) {
      navigate('/form');
    }
  };

  const buttonClickHandler = (e: React.FormEvent) => {
    formSubmitHandler(e);
    if (!error) {
      setEmail('');
      setPassword('');
    }
  };

  const isButtonDisabled = () => {
    return email.length === 0 || password.length === 0;
  };

  return (
    <div className="Authentication">
      <FormContainer>
        <form className="AuthForm" onSubmit={formSubmitHandler}>
          <h2 className="text-xl width-[100%]  text-left text-blue-400 ">
            LOGIN
          </h2>

          <div className="AuthFieldContainer">
            {auth?.status !== 200 && (
              <div className="p-5">
                <p className="text-red-500 text-center px-5">
                  {auth?.response?.data?.message}
                </p>
              </div>
            )}

            {auth?.status === 200 && (
              <span className="text-green-500">Login Success</span>
            )}
            <LabelInput
              label={'Username'}
              onChange={handleNameChange}
              name={email}
              type={'email'}
            />
            <LabelInput
              label={'Password'}
              onChange={handlePasswordChange}
              name={password}
              type={'password'}
            />
            <Link to="/forgotpassword">
              <h3 className="py-1">Forgot Password?</h3>
            </Link>
          </div>
          <button
            onClick={buttonClickHandler}
            disabled={isButtonDisabled()}
            className="btn btn-active btn-primary bg-purple-600 text-white mt-[1em]"
          >
            Log In
          </button>
        </form>
      </FormContainer>
    </div>
  );
};

export default Authentication;
