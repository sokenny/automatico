import copyToClipboard from '../../../utils/copyToClipboard';
import Copy from '../../../icons/Copy';

import styles from './Message.module.css';

const Message = ({ message }) => {
  function getMessageContent() {
    let userContent, description, sql;
    if (message.role === 'user') {
      userContent = message.content;
    }

    if (message.role === 'assistant') {
      const content = JSON.parse(message.content);
      description = content.description;
      sql = content.sql;
    }

    return { userContent, description, sql };
  }

  function handleClick() {
    if (message.role === 'assistant') {
      copyToClipboard(getMessageContent().sql);
    }
  }

  return (
    <div
      className={`${styles.container} ${
        message.role === 'user' ? styles.user : styles.assistant
      }`}
      onClick={handleClick}
    >
      {message.role === 'user' && (
        <div className={styles.userContent}>
          {getMessageContent().userContent}
        </div>
      )}

      {message.role === 'assistant' && (
        <div className={styles.assistantContent}>
          <span className={styles.description}>
            {getMessageContent().description}
          </span>
          <span className={styles.sql}>
            {getMessageContent().sql}{' '}
            <span className={styles.copy}>
              <Copy width={18} height={18} />
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Message;
