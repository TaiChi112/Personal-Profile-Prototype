import { Queue, Job } from 'bullmq';

jest.mock('bullmq');

describe('BullMQ Dead-Letter Queue (Failed Jobs) Retries', () => {
  let queue: jest.Mocked<Queue>;

  beforeEach(() => {
    jest.clearAllMocks();
    queue = new Queue('test-queue') as jest.Mocked<Queue>;
  });

  it('should retry a specific failed job', async () => {
    const mockJob = {
      id: '123',
      retry: jest.fn().mockResolvedValue(undefined),
      isFailed: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Job>;

    // Mock Queue.getJob to return our mock job
    queue.getJob = jest.fn().mockResolvedValue(mockJob);

    const job = await queue.getJob('123');
    
    if (job && await job.isFailed()) {
      await job.retry();
    }

    expect(queue.getJob).toHaveBeenCalledWith('123');
    expect(mockJob.isFailed).toHaveBeenCalled();
    expect(mockJob.retry).toHaveBeenCalled();
  });

  it('should bulk retry jobs from the failed state (dead-letter)', async () => {
    queue.retryJobs = jest.fn().mockResolvedValue(undefined);

    // Retry up to 100 failed jobs
    await queue.retryJobs({ count: 100, state: 'failed' });

    expect(queue.retryJobs).toHaveBeenCalledWith({ count: 100, state: 'failed' });
  });
});
