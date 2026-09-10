import { prisma } from '@/lib/prisma';

export class TenantRepository {
  async createTenant(name: string, domain: string) {
    return prisma.tenant.create({
      data: {
        name,
        domain,
      },
    });
  }

  async getTenantUsers(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      include: {
        users: true,
      },
    });
    return tenant?.users || [];
  }
}
