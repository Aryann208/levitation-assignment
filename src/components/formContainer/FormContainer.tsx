import { ReactNode } from 'react';
import './FormContainer..css';
interface FormContainerProps {
  children: ReactNode;
}
const FormContainer: React.FC<FormContainerProps> = (props) => {
  return <div className="FormContainer ">{props.children}</div>;
};

export default FormContainer;
