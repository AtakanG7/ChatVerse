import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { setupSocketServer } from './controllers/chatController.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? '', true);
    handle(req, res, parsedUrl);
  });

  setupSocketServer(server);

  server.listen(3000, () => {
    console.log('> Ready on port 3000');
  });
});
