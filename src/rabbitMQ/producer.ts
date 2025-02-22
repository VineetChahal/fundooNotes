// import { createRabbitMQConnection } from "../config/rabbitmq";
// const QUEUE_NAME = process.env.QUEUE_NAME || "EmailQueue";

// export const sendMessageToQueue = async (message: object) => {
//     const { channel } = await createRabbitMQConnection();

//     channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
//         persistent: true,
//     });

//     console.log("📤 Sent message to queue:", message);
// };
//-----------------------------------------------------------------------------------
// has been set up as a seperate project (as demanded by PT)
//-----------------------------------------------------------------------------------