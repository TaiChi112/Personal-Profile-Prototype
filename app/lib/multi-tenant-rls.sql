-- Enable Row-Level Security on the Tenant table
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;

-- Force RLS so that even table owners are subject to the policies
ALTER TABLE "Tenant" FORCE ROW LEVEL SECURITY;

-- Create a policy to ensure users can only access their own Tenant data.
-- This policy relies on a runtime configuration variable (e.g., 'app.current_tenant_id')
-- which should be set by the application when a user connects or establishes a session.
-- Example: SET LOCAL app.current_tenant_id = 'your-tenant-uuid';

CREATE POLICY "Tenant_Isolation_Policy" 
    ON "Tenant" 
    FOR ALL 
    USING (id = NULLIF(current_setting('app.current_tenant_id', TRUE), '')::uuid);
