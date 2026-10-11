import { createApp } from './app';
import { InMemoryTrackRepository } from './repositories/InMemoryTrackRepository';

const port = Number(process.env.PORT ?? 3000);

const app = createApp(new InMemoryTrackRepository());

app.listen(port, () => {
  console.log(`Tracks service listening on http://localhost:${port}`);
});
