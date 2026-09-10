import { trace } from '@opentelemetry/api';

export function getTracer(name: string) {
  return trace.getTracer(name);
}
