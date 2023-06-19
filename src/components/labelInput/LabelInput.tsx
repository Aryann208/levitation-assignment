import React from 'react';
import './LabelInput.module.css';

interface LabelInputProps {
  name: any;
  label: string;
  type: any;
  onChange: (value: string) => void;
}

const LabelInput: React.FC<LabelInputProps> = ({
  name,
  label,
  type,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className=" form-control  w-[100%] ">
      <label className="label w-[100%]">
        <span className="label-text">{label}</span>
      </label>
      <input
        required={true}
        type={type}
        value={name}
        pattern=""
        placeholder="Type here"
        className="input input-bordered  input-info w-[100%]"
        onChange={handleChange}
      />
    </div>
  );
};

LabelInput.defaultProps = {
  type: 'text',
};

export default LabelInput;
