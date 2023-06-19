import FormContainer from '../../components/formContainer/FormContainer';
import LabelInput from '../../components/labelInput/LabelInput';
import { useState } from 'react';
import './ForgetPassword.css';
const ForgetPassword = () => {
  const [name, setName] = useState('');
  const handleInputChange = (value: string) => {
    setName(value);
    console.log(name);
  };
  const buttonClickHandler = () => {
    console.log('f' + name);
    setName('');
  };
  return (
    <div className="ForgetPasswordContainer">
      <FormContainer>
        <h2 className="text-xl width-[100%]  text-left text-blue-400 ">
          Forgot Password?
        </h2>
        <LabelInput
          label="Username"
          onChange={handleInputChange}
          name={name}
          type={'text'}
        />
        <button
          onClick={buttonClickHandler}
          className="btn btn-active btn-primary bg-purple-600 text-white mt-[1em] w-[100%] "
        >
          Reset Password
        </button>
      </FormContainer>
    </div>
  );
};

export default ForgetPassword;
