# Phase 2.3 — Episode Storage Report

Status: Completed

## Objective
پیاده‌سازی ذخیره‌سازی صوتی برای اپیزودهای کاستامینوفن و افزودن endpoint آپلود audio به backend.

## Scope
- StorageModule
- StorageService
- Endpoint آپلود audio
- اعتبارسنجی فایل صوتی
- یکپارچه‌سازی `Episode.audioUrl`

## Completed Work
- پیاده‌سازی `StorageService` با پشتیبانی از MinIO-compatible object storage.
- افزودن `POST /api/v1/episodes/:id/audio` برای آپلود فایل صوتی.
- اعتبارسنجی MIME type و محدودیت حجم فایل (100 مگابایت).
- نتظیم `Episode.audioUrl` پس از آپلود موفق.
- رفع هشدارهای ESLint و تأیید اجرای `pnpm --filter @castaminofen/api lint` و `pnpm --filter @castaminofen/api build`.

## Files Changed
- apps/api/src/storage/storage.module.ts
- apps/api/src/storage/storage.service.ts
- apps/api/src/episodes/episodes.controller.ts
- apps/api/src/episodes/episodes.service.ts
- docs/development/changelog.md
- docs/project-status.md

## Status
- [x] Report created
- [x] Implementation started
- [x] Backend changes completed
- [x] Changelog updated
- [x] project-status updated
- [x] Final summary آماده
