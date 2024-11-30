import { Kafka } from 'kafkajs';
import Message from '../../db/models/message';
import mongoose from "mongoose";

const kafka = new Kafka({ clientId: 'messaging-service', brokers: ['localhost:29092'] });
const consumer = kafka.consumer({ groupId: 'message-service-group' });

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'message-queue', fromBeginning: true });
  await consumer.subscribe({ topic: 'update-chat-status', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message, topic, partition }) => {
      try {
        const offset = message.offset;
        if (topic === 'update-chat-status') {
          const messageData = JSON.parse(message.value?.toString());
          await Message.updateChatStatus(new mongoose.Types.ObjectId(messageData.chat_id), new mongoose.Types.ObjectId(messageData.user_id), "read");
        } else if (topic === 'message-queue') {
          const messageData = JSON.parse(message.value?.toString());
          const newMessage = new Message(messageData);
          await newMessage.save();
        }
        await consumer.commitOffsets([{ topic, partition, offset: (parseInt(offset, 10) + 1).toString() }]);
      } catch (error) {
        console.error(`Error processing message from ${topic}: ${error}`);
      }
    },
  });
};
