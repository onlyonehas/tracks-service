import { createApp } from './app.js';
import { MemoryTrackStorage } from './model/memoryTrackStorage.js';

const port = Number(process.env.PORT ?? 3000);

const app = createApp(new MemoryTrackStorage());

app.listen(port, () => {
  console.log(`Tracks service listening on http://localhost:${port}`);
});
