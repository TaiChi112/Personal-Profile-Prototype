# Adapter Pattern Guide

## Intent
แปลง interface ของ source ต่างชนิดให้กลายเป็น contract กลางที่ระบบหลักใช้งานได้.

## Where Used in App
- `app/services/content/ContentTreeSetup.ts` (`adapt*ToUnified` functions)

## Scale Concerns
- Adapter proliferation เมื่อ source เพิ่มขึ้น
- Transform rules ซ้ำกันหลาย adapter

## Scale TODO (3 features)
1. Add adapter plugin registry with typed source capability metadata.
2. Add shared normalization utilities for tags/date/author fields.
3. Add reverse adapter path for exporting unified data back to source formats.
