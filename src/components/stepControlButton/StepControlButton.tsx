import React from 'react';
import './StepControlButton.css';
interface StepControlButtonProps {
  text1: string;
  text2: string;
  onClick1: (value: string) => void;
  onClick2: (value: string) => void;
  disabled1: boolean;
  disabled2: boolean;
}

const StepControlButton: React.FC<StepControlButtonProps> = ({
  text1,
  text2,
  onClick1,
  onClick2,
  disabled1,
  disabled2,
}) => {
  return (
    <div className="StepControlButton">
      <button
        className=" Button btn btn-info"
        type="button"
        onClick={() => onClick1('Previous')}
        disabled={disabled1}
      >
        {text1}
      </button>
      <button
        className="Button btn btn-info"
        type="button"
        onClick={() => onClick2('Next')}
        disabled={disabled2}
      >
        {text2}
      </button>
    </div>
  );

  StepControlButton.defaultProps = {
    text1: 'Previous',
    text2: 'Next',
  };
};

export default StepControlButton;
