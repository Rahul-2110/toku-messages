import { Kafka } from 'kafkajs';

const kafka = new Kafka({ clientId: 'messaging-service', brokers: ['localhost:29092'] });
const producer = kafka.producer();

export const sendMessageToQueue = async (message: object) => {
  await producer.connect();
  await producer.send({
    topic: 'message-queue',
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};


export const updateChatStatusStatus = async (message: object) => {
    await producer.connect();
    await producer.send({
      topic: 'update-chat-status',
      messages: [{ value: JSON.stringify(message) }],
    });
    await producer.disconnect();
  };



