require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const queue = 'export:playlists';

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.consume(queue, listener.listen, { noAck: true });
};

init();
