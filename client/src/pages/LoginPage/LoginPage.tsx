import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { unwrapResult } from '@reduxjs/toolkit';

import { useAppDispatch } from '../../store/hooks';
import { login } from '../../features/user/requests';

import AuthForm from '../../components/AuthForm/AuthForm';
import styles from './style.module.css';

function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const actionResult = await dispatch(login({ username, password }));
      const result = unwrapResult(actionResult);
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('userId', `${result.user.id}`);

      navigate('/channels');
    } catch (err) {
      console.error(err);
      alert('Ошибка входа');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPageWrapper}>
        <AuthForm
          title="Вход"
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          submitButtonText="Войти"
        />
        <span onClick={() => navigate('/register')}>Регистрация</span>
      </div>
    </div>
  );
}

export default LoginPage;
