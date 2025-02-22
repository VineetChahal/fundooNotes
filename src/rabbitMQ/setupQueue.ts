// import amqp, { Channel, Connection } from 'amqplib';

// async function setupQueue(): Promise<void> {
//   let connection: Connection | null = null;
//   let channel: Channel | null = null;

//   try {
//     connection = await amqp.connect('amqp://localhost');
//     channel = await connection.createChannel();

//     // Declare the EmailQueue
//     await channel.assertQueue('EmailQueue', { durable: true });

//     console.log('✅ EmailQueue is ready');
//   } catch (error) {
//     console.error('❌ Error setting up queue:', error);
//   } finally {
//     if (channel) await channel.close();
//     if (connection) await connection.close();
//   }
// }

// setupQueue().catch(console.error);
//-----------------------------------------------------------------------------------
// has been set up as a seperate project (as demanded by PT)
//-----------------------------------------------------------------------------------