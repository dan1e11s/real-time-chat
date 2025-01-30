import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  channelCreate,
  channelJoin,
  getChannels,
} from '../../features/channel/requests';
import { getUser, searchUsers } from '../../features/user/requests';

import styles from './style.module.css';

function ChannelsPage() {
  const [channelName, setChannelName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const dispatch = useAppDispatch();
  const { user, foundUsers } = useAppSelector((state) => state.user);
  const { channels } = useAppSelector((state) => state.channels);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getChannels());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
    }
  }, [dispatch, userId]);

  // for create channel
  const handleCreateChannel = async (): Promise<void> => {
    if (!channelName) return;
    try {
      await dispatch(channelCreate({ name: channelName }));
      setChannelName('');
      await dispatch(getChannels());
    } catch (err) {
      console.error(err);
    }
  };

  // for join channel
  const handleJoin = async (channelId: number): Promise<void> => {
    try {
      await dispatch(channelJoin(channelId));
      navigate(`/channels/${channelId}`);
    } catch (err) {
      console.error(err);
    }
  };

  // logout
  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  // for search users
  const handleSearchUser = async (): Promise<void> => {
    if (!searchTerm) return;
    try {
      await dispatch(searchUsers(searchTerm));

      setSearchTerm('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{user?.username}</h2>
        <button onClick={handleLogout}>Выйти</button>
      </div>

      <div className={styles.formGroup}>
        <input
          placeholder="Название канала"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <button onClick={handleCreateChannel}>Создать канал</button>
      </div>

      <div className={styles.formGroup}>
        <input
          placeholder="Поиск пользователя"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearchUser}>Поиск</button>
      </div>

      <ul className={styles.channelsList}>
        {channels.map((channel) => (
          <li
            key={channel.id}
            className={styles.channelItem}
            onClick={() => handleJoin(channel.id)}
          >
            {channel.name}
          </li>
        ))}
      </ul>

      {foundUsers.length > 0 && (
        <div className={styles.foundUsers}>
          <h3>Найденные пользователи:</h3>
          <ul>
            {foundUsers.map((usr) => (
              <li key={usr.id}>{usr.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ChannelsPage;
