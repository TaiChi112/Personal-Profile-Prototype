import { Worker } from 'bullmq';

const worker = new Worker('analytics-queue', async (job) => {
  console.log('Processing analytics job', job.data);
});
