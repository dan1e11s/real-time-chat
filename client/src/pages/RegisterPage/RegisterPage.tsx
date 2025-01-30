import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../store/hooks';
import { register } from '../../features/user/requests';

import AuthForm from '../../components/AuthForm/AuthForm';
import styles from './style.module.css';

function RegisterPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleRegister = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await dispatch(register({ username, password }));

      alert('Регистрация успешна!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerPageWrapper}>
        <AuthForm
          title="Регистрация"
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleRegister}
          submitButtonText="Зарегистрироваться"
        />
      </div>
    </div>
  );
}

export default RegisterPage;
