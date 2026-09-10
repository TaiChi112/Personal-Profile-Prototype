export interface RedisShardConfig {
  id: string;
  host: string;
  port: number;
  weight?: number;
}

export interface RedisClusterConfig {
  shards: RedisShardConfig[];
  options: {
    connectionTimeout: number;
    maxRetries: number;
  };
}

export const redisConfig: RedisClusterConfig = {
  shards: [
    { id: 'shard-001', host: 'redis-node-1.internal', port: 6379, weight: 100 },
    { id: 'shard-002', host: 'redis-node-2.internal', port: 6379, weight: 100 },
    { id: 'shard-003', host: 'redis-node-3.internal', port: 6379, weight: 50 },
  ],
  options: {
    connectionTimeout: 5000,
    maxRetries: 3,
  },
};
