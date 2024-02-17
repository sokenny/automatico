import { IMessage } from './types';

function buildMessagesContextString(messages: IMessage[]): string {
  return messages
    .map((message) => {
      return `${message.role}: ${message.content}`;
    })
    .join('\n')
    .replace(/[{}]/g, '');
}

export default buildMessagesContextString;
