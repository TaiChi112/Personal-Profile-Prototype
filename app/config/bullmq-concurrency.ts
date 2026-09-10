/**
 * Concurrency configurations for BullMQ workers.
 * Defines the number of jobs that a worker will process in parallel.
 */
export const BULLMQ_CONCURRENCY = {
  /**
   * High concurrency for quick, lightweight tasks (e.g., sending emails)
   */
  HIGH: 25,

  /**
   * Default concurrency for standard queues
   */
  DEFAULT: 10,

  /**
   * Medium concurrency for moderate tasks
   */
  MEDIUM: 5,

  /**
   * Low concurrency for CPU-intensive or memory-heavy tasks (e.g., image processing)
   */
  LOW: 1,
} as const;
