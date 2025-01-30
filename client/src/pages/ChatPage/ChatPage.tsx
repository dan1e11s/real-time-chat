import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getChannelInfo,
  getChannelMembers,
  getChannelMessages,
} from '../../features/channel/requests';

import { setMessages } from '../../features/channel/channelSlice';

import { getSocket } from '../../services/socket';
import api from '../../services/api';

import { IMessage } from '../../interfaces/message.interface';

import styles from './style.module.css';

function ChatPage() {
  const [newMessage, setNewMessage] = useState<string>('');

  const dispatch = useAppDispatch();
  const {
    channelMessages: messages,
    channelMembers: members,
    channelInfo,
  } = useAppSelector((state) => state.channels);

  const { id } = useParams<{ id: string }>();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const socket = getSocket();
    socket.emit('joinChannel', { channelId: Number(id) });

    socket.on('joinedChannel', (data) => {
      console.log('joinedChannel', data);
    });

    socket.on('messageReceived', (message: IMessage) => {
      dispatch(setMessages([...messages, message]));
    });

    return () => {
      socket.off('joinedChannel');
      socket.off('messageReceived');
    };
  }, [id, messages, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getChannelInfo(id));
      dispatch(getChannelMessages(id));
      dispatch(getChannelMembers(id));
    }
  }, [dispatch, id]);

  const handleSend = async (): Promise<void> => {
    if (!newMessage) return;
    const token = localStorage.getItem('token');
    const socket = getSocket();

    socket.emit('sendMessage', {
      token,
      channelId: Number(id),
      content: newMessage,
    });
    setNewMessage('');
  };

  const handleRemoveMember = async (userId: number): Promise<void> => {
    try {
      if (id) {
        await api.delete(`/channels/${id}/remove/${userId}`);
        await dispatch(getChannelMembers(id));
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении участника (возможно, вы не владелец)');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{channelInfo?.name}</h2>

      <div className={styles.content}>
        <div className={styles.chatSection}>
          <div className={styles.messageList}>
            {messages.map((msg) => (
              <div key={msg.id} className={styles.message}>
                <strong className={styles.sender}>
                  {msg.sender.username}:
                </strong>
                <span className={styles.messageText}>{msg.content}</span>
              </div>
            ))}
          </div>
          <div className={styles.inputContainer}>
            <input
              className={styles.messageInput}
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className={styles.sendButton} onClick={handleSend}>
              Отправить
            </button>
          </div>
        </div>

        <div className={styles.membersSection}>
          <h4 className={styles.membersTitle}>Участники</h4>
          <ul className={styles.membersList}>
            {members.map((member) => (
              <li key={member.id} className={styles.memberItem}>
                <span className={styles.memberName}>{member.username}</span>
                {Number(userId) === channelInfo?.owner.id &&
                  member.id !== Number(userId) && (
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Удалить
                    </button>
                  )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
