import React, { useState, useEffect, useContext } from 'react';
import LabelInput from '../../components/labelInput/LabelInput';
import FormContainer from '../../components/formContainer/FormContainer';
import StepControlButton from '../../components/stepControlButton/StepControlButton';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { AuthContext } from '../../store/AuthContext';
import axios from 'axios';
import './MultiStepForm.css';
interface FormData {
  name: string;
  email: string;
  password: string;
  address_1: string;
  address_2: string;
  state: string;
  city: string;
  pincode: string;
  country: string;
  phone_number: string;
  single_file: any;
  multi_file: File[];
  geolocation: string;
}

const MultiStepForm: React.FC = () => {
  const authContext = useContext(AuthContext) || {
    authCode: '',
    authStore: () => {},
  };
  const authToken = authContext.authCode;

  const [step, setStep] = useState(1);

  const [button1Disabled, setButton1Disabled] = useState(true);
  const [button2Disabled, setButton2Disabled] = useState(true);
  const [button3Disabled, setButton3Disabled] = useState(true);
  const [button4Disabled, setButton4Disabled] = useState(true);

  const [errorStep1, setErrorStep1] = useState<string[]>([]);
  const [errorStep2, setErrorStep2] = useState<string[]>([]);
  const [errorStep3, setErrorStep3] = useState<string[]>([]);
  const [errorStep4, setErrorStep4] = useState<string[]>([]);

  const [fileStore, setFileStore] = useState<any>([]);

  const [response, setResponse] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    address_1: '',
    address_2: '',
    state: '',
    city: '',
    pincode: '',
    country: '',
    phone_number: '',
    single_file: '',
    multi_file: [],
    geolocation: '',
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone_number: string) => {
    const phoneRegex = /^\d{12}$/;
    return phoneRegex.test(phone_number);
  };

  const isValidPincode = (pincode: string) => {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  };

  useEffect(() => {
    let len1 = errorStep1.length;
    setButton1Disabled(len1 === 0 ? false : true);

    let len2 = errorStep2.length;
    setButton2Disabled(len2 === 0 ? false : true);

    let len3 = errorStep3.length;
    setButton3Disabled(len3 === 0 ? false : true);
    let len4 = errorStep4.length;
    setButton4Disabled(len4 === 0 ? false : true);
  }, [errorStep1, errorStep2, errorStep3, errorStep4]);

  useEffect(() => {
    setErrorStep1(
      step1Validate(formData.name, formData.email, formData.phone_number)
    );
    setErrorStep2(
      step2Validate(
        formData.address_1,
        formData.address_2,
        formData.city,
        formData.state,
        formData.pincode,
        formData.country
      )
    );
    setErrorStep3(step3Validate(formData.single_file));
    setErrorStep4(step4Validate(formData.multi_file));
  }, [formData]);

  const step1Validate = (name: string, email: string, phone: string) => {
    captureGeolocation();
    const errors: string[] = [];

    if (name.trim().length < 3) {
      errors.push('Username is required (min length: 3 characters)');
    }

    if (email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!isValidEmail(email)) {
      errors.push('Email is invalid');
    }

    if (phone.trim().length === 0) {
      errors.push('Phone Number is required');
    } else if (!isValidPhoneNumber(phone)) {
      errors.push('Phone Number is invalid');
    }

    return errors;
  };

  const step2Validate = (
    address_1: string,
    address_2: string,
    city: string,
    state: string,
    pincode: string,
    country: string
  ) => {
    const errors: string[] = [];

    if (address_1.trim().length === 0) {
      errors.push('Address Line 1 is required');
    }

    if (address_2.trim().length === 0) {
      errors.push('Address Line 2 is required');
    }

    if (city.trim().length === 0) {
      errors.push('City is required');
    }

    if (state.trim().length === 0) {
      errors.push('State is required');
    }

    if (pincode.trim().length === 0) {
      errors.push('Pincode is required');
    } else if (!isValidPincode(pincode)) {
      errors.push('Pincode is invalid');
    }

    if (country.trim().length === 0) {
      errors.push('Country is required');
    }

    return errors;
  };

  const step3Validate = (file: string) => {
    const errors: string[] = [];

    if (!file || file.length === 0) {
      errors.push('Only one file is required');
    }

    return errors;
  };

  const step4Validate = (file: File[]) => {
    const errors: any[] = [];

    if (!file || file.length === 0) {
      errors.push('Upto 5 file only');
    }

    return errors;
  };
  const handleOnChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      phone_number: value,
    }));
  };

  const handleFormReset = () => {
    setStep(1);
    setFormData({
      name: '',
      email: '',
      password: '',
      address_1: '',
      address_2: '',
      state: '',
      city: '',
      pincode: '',
      country: '',
      phone_number: '',
      single_file: '',
      multi_file: [],
      geolocation: '',
    });
  };
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (value: string, inputName: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [inputName]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileStore(e.target.files?.[0].name);

    // setFileLists(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      single_file: file,
    }));
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);

      if (fileList.length > 5) {
        // Limit the number of files to 5
        fileList.splice(5);
      }

      fileList.map((file) => setFileStore([...fileStore, file.name]));

      setFormData((prevData) => ({
        ...prevData,
        multi_file: fileList,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(null);
    const url = `https://x8ki-letl-twmt.n7.xano.io/api:XooRuQbs/form`;
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone_number', formData.phone_number);
    data.append('address_1', formData.address_1);
    data.append('address_2', formData.address_2);
    data.append('city', formData.city);
    data.append('state', formData.state);
    data.append('pincode', formData.pincode);
    data.append('country', formData.country);
    data.append('geolocation', formData.geolocation);
    if (formData.single_file) {
      data.append('single_file', formData.single_file);
    }
    formData.multi_file.forEach((file) => {
      data.append('multi_file[]', file); // Update the parameter name to 'multi_file[]'
    });
    console.log('data');
    console.log(data);
    try {
      setStep((prevStep) => prevStep + 1);
      const response = await axios.post(url, data, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      });

      setResponse(response);
    } catch (err) {
      setResponse(err);
    }

    console.log('response');
    console.log(response);
  };
  const captureGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const geolocation = `Latitude: ${latitude}, Longitude: ${longitude}`;
        setFormData((prevData) => ({
          ...prevData,
          geolocation: geolocation,
        }));
      },
      (error) => {
        console.error('Error retrieving geolocation:', error);
      }
    );
  };

  useEffect(() => {
    captureGeolocation();
    console.log(formData.geolocation);
  }, []);

  return (
    <div className="MultiStepFormContainer">
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <FormContainer>
            <h2 className="Heading-2">Step 1: Personal Information</h2>

            {errorStep1.length > 0 && (
              <p className="text-red-300">{errorStep1[0]}</p>
            )}
            <LabelInput
              label="Username"
              name={formData.name}
              type={'text'}
              onChange={(value) => handleInputChange(value, 'name')}
            />
            <LabelInput
              label="Email"
              name={formData.email}
              type={'email'}
              onChange={(value) => handleInputChange(value, 'email')}
            />
            <label className="label w-[100%]">
              <span className="label-text">Phone Number</span>
            </label>
            <PhoneInput
              specialLabel={''}
              country={'in'}
              onChange={handleOnChange}
              inputStyle={{
                background: 'black',
                width: '100%',
                marginTop: '1em',
              }}
            />
            <button
              className="Button btn btn-info mt-5"
              type="button"
              onClick={handleNextStep}
              disabled={button1Disabled}
            >
              Next
            </button>
          </FormContainer>
        )}
        {step === 2 && (
          <FormContainer>
            <h2 className="Heading-2">Step 2: Address</h2>
            {errorStep2.length > 0 && (
              <p className="text-red-300">{errorStep2[0]}</p>
            )}
            <div className="flex flex-wrap">
              <LabelInput
                label="Address Line 1"
                name={formData.address_1}
                type={'text'}
                onChange={(value) => handleInputChange(value, 'address_1')}
              />
              <LabelInput
                label="Address Line 2"
                name={formData.address_2}
                type={'text'}
                onChange={(value) => handleInputChange(value, 'address_2')}
              />
              <LabelInput
                label="City"
                name={formData.city}
                type={'text'}
                onChange={(value) => handleInputChange(value, 'city')}
              />
              <LabelInput
                label="State"
                name={formData.state}
                type={'text'}
                onChange={(value) => handleInputChange(value, 'state')}
              />
              <LabelInput
                label="Pincode"
                name={formData.pincode}
                type={'number'}
                onChange={(value) => handleInputChange(value, 'pincode')}
              />
              <LabelInput
                label="Country"
                name={formData.country}
                type={'text'}
                onChange={(value) => handleInputChange(value, 'country')}
              />
            </div>
            <StepControlButton
              onClick1={handlePreviousStep}
              disabled1={false}
              disabled2={button2Disabled}
              text1="Previous"
              text2="Next"
              onClick2={handleNextStep}
            />
          </FormContainer>
        )}
        {step === 3 && (
          <FormContainer>
            <h2 className="Heading-2">Step 3: Upload File</h2>
            {errorStep3.length > 0 && (
              <p className="text-red-300">{errorStep3[0]}</p>
            )}
            {fileStore.length > 0 && (
              <p className="text-blue-500">{fileStore}</p>
            )}
            <label htmlFor="file-upload" className="label">
              Select Files (Up to 1)
            </label>
            <input
              required={true}
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="flex flex-column border-blue-500 border-[2px]"
            />
            <StepControlButton
              onClick1={handlePreviousStep}
              onClick2={handleNextStep}
              text1="Previous"
              text2="Next"
              disabled1={false}
              disabled2={button3Disabled}
            />
          </FormContainer>
        )}
        {step === 4 && (
          <FormContainer>
            <h2 className="Heading-2">Step 4: Upload Files</h2>
            {errorStep4.length > 0 && (
              <p className="text-red-300">{errorStep4[0]}</p>
            )}

            <div>
              <label htmlFor="file-upload" className="label">
                Select Files (Up to 5)
              </label>

              <input
                required={true}
                id="file-upload"
                type="file"
                multiple
                onChange={handleFilesChange}
                className="flex flex-column border-blue-500 border-[2px]"
              />
            </div>
            <div className="text-center my-5 p-3 rounded-md bg-slate-700">
              <h2 className="font-semibold text-yellow-200">
                Your Coordinates
              </h2>
              <p className="text-blue-500 px-5 text-xl text-center">
                {formData.geolocation
                  ? formData.geolocation
                  : 'Waiting for geolocation...'}
              </p>
            </div>
            <StepControlButton
              onClick1={handlePreviousStep}
              onClick2={handleNextStep}
              text1="Previous"
              text2="Next"
              disabled1={false}
              disabled2={button4Disabled}
            />
          </FormContainer>
        )}
        {step === 5 && (
          <FormContainer>
            <h2 className="Heading-2">Are you sure you want to continue ?</h2>
            <div className="flex w-[100%] justify-evenly">
              <button
                className="Button btn btn-info mt-5"
                type="button"
                onClick={handleSubmit}
                disabled={button1Disabled}
              >
                Submit
              </button>
            </div>
          </FormContainer>
        )}
        {step === 6 && (
          <FormContainer>
            <h2 className="Heading-2">Server Response</h2>
            {!response && (
              <h2 className="font-semibold text-slate-100 h-[20vh] flex justify-center items-center ">
                Waiting for server response ...
              </h2>
            )}

            {response?.status !== 200 && (
              <div className="p-5">
                {' '}
                <p className="text-red-200 text-center px-5">
                  {response?.message}
                </p>{' '}
                <p className="text-red-500 text-center px-5">
                  {response?.response?.data?.message}
                </p>
              </div>
            )}
            {response?.status === 200 && (
              <p className="text-green-500">
                Success ! Your Form was submitted with [Response :
                {response?.status}]
              </p>
            )}
            <button
              className="Button btn btn-info mt-5"
              type="button"
              onClick={handleFormReset}
              disabled={false}
            >
              Reset
            </button>
          </FormContainer>
        )}
      </form>
    </div>
  );
};

export default MultiStepForm;
