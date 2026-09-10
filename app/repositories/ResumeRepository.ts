import redis from '../lib/redis';
import { getTracer } from '../lib/telemetry';

const tracer = getTracer('ResumeRepository');

export class ResumeRepository {
  public async getResumeData(): Promise<any> {
    return tracer.startActiveSpan('getResumeData', async (span) => {
      try {
        const cacheKey = 'resume_data';
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
          return JSON.parse(cachedData);
        }

        // Cache miss: generate mock default data
        const mockData = {
          name: 'Jane Doe',
          title: 'Software Engineer',
          bio: 'Passionate software developer with experience in building scalable web applications.',
          skills: ['TypeScript', 'Node.js', 'React', 'Redis'],
          experience: [
            {
              company: 'Tech Solutions Inc.',
              position: 'Senior Developer',
              duration: '2021 - Present',
            },
            {
              company: 'WebDev Agency',
              position: 'Web Developer',
              duration: '2018 - 2021',
            }
          ],
        };

        // Store the mock data in Redis
        await redis.set(cacheKey, JSON.stringify(mockData));

        return mockData;
      } catch (error) {
        console.error('Error fetching resume data:', error);
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
