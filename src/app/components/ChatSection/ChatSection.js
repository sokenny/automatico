'use client';

import { useChat } from 'ai/react';
import Message from './Message';
import EmptyState from './EmptyState';
import styles from './ChatSection.module.css';

const ChatSection = () => {
  const { messages, handleSubmit, input, handleInputChange, isLoading } =
    useChat({
      api: '/api/ask_tt_db',
    });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <div
            className={`${styles.logo} ${isLoading ? styles.loading : ''}`}
          ></div>
        </div>
        <h1 className={styles.title}>Ask TT Database</h1>
      </div>
      <div>
        <div className={styles.messages}>
          {messages.length === 0 && <EmptyState />}
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}

          {isLoading && (
            <div className={styles.fetching}>generating answer...</div>
          )}
        </div>
      </div>
      <div className={styles.bottom}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="How many renters have participated in signature requests the last month?"
          />
          <button
            className={`${styles.button} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            ASK
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;
