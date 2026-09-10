import { SpanStatusCode, Span } from '@opentelemetry/api';
import { Prisma } from '@prisma/client';
import { getTracer } from './telemetry';

/**
 * Creates a Prisma extension that maps Prisma queries to OpenTelemetry database spans.
 * This can be used to trace database operations without requiring the `@prisma/instrumentation` package.
 */
export function getOpenTelemetryPrismaExtension() {
  const tracer = getTracer('prisma-client');

  return Prisma.defineExtension({
    name: 'opentelemetry-prisma-mapper',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          return tracer.startActiveSpan(
            `prisma:query:${model}:${operation}`,
            {
              attributes: {
                'db.system': 'postgresql',
                'db.operation': operation,
                'db.sql.table': model,
              },
            },
            async (span: Span) => {
              try {
                const result = await query(args);
                span.setStatus({ code: SpanStatusCode.OK });
                return result;
              } catch (error: any) {
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: error.message,
                });
                span.recordException(error);
                throw error;
              } finally {
                span.end();
              }
            }
          );
        },
      },
    },
  });
}
