import { FormEvent } from 'react';
import styles from './style.module.css';

interface AuthFormProps {
  title: string;
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitButtonText: string;
}

function AuthForm({
  title,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  submitButtonText,
}: AuthFormProps) {
  return (
    <div className={styles.authFormContainer}>
      <h2 className={styles.authFormTitle}>{title}</h2>

      <form onSubmit={onSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <label>Логин</label>
          <input
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
        </div>

        <button type="submit">{submitButtonText}</button>
      </form>
    </div>
  );
}

export default AuthForm;
