# Template Method Pattern Guide

## Intent
กำหนดโครง algorithm หลักไว้ใน base class แล้วให้ subclass เติมรายละเอียดบางขั้นตอน.

## Where Used in App
- `app/services/content/ResumeExporters.ts`

## Scale Concerns
- Base template เปลี่ยนบ่อยและกระทบ subclass ทั้งหมด
- Hook methods ไม่พอรองรับ format ใหม่

## Scale TODO (3 features)
1. Add extension hooks for pre/post processing around export steps.
2. Add streaming template method for large resume/content exports.
3. Add exporter capability matrix to validate subclass completeness.
