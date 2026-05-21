import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/slices/authSlice';

type TLocationState = {
  from?: {
    pathname: string;
  };
};

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as TLocationState)?.from?.pathname || '/';

  const { error } = useSelector((state) => state.auth);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(registerUser({ email, password, name: userName }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      });
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
