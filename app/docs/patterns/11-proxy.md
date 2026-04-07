# Proxy Pattern Guide

## Intent
ควบคุมการเข้าถึง object จริง เช่น auth/permission/check ก่อนใช้งาน resource.

## Where Used in App
- `app/components/content/ProtectedDecoratedContent.tsx`

## Scale Concerns
- Permission logic ซ้ำหลาย proxy points
- Access decision latency ถ้า proxy ต้องเช็คหลายเงื่อนไข

## Scale TODO (3 features)
1. Add centralized access policy evaluator shared by all proxy components.
2. Add cached policy decision layer with invalidation rules.
3. Add audit trail logging for denied/allowed proxy decisions.
