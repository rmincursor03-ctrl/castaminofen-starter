# گزارش Audit مجدد پروژه Castaminofen

## تاریخ بررسی
2026-07-18 08:25

## نسخه / وضعیت پروژه
- نسخه فعلی: 0.1.0
- وضعیت کلی: پروژه در مرحله‌ی MVP foundation و توسعه‌ی featureهای اصلی قرار دارد
- وضعیت فعلی شامل: scaffold monorepo، Frontend Next.js، Backend NestJS، Auth، Podcasts، Episodes و زیرساخت‌های اولیه‌ی storage و Docker
- وضعیت در حال پیشرفت: Player هنوز یک feature مستقل نیست و مرز مالکیت آن به‌صورت مکتوب اما نشده‌ی کامل باقی مانده است

## خلاصه اجرایی
این بررسی بر اساس مستندات پروژه، ساختار فعلی ریپو و اجرای مستقیم بررسی‌ها انجام شد. بر اساس شواهد موجود، پروژه درک مناسبی از معماری خود دارد و آماده‌ی ادامه‌ی توسعه است. مهم‌ترین نکته‌ی فعلی، حفظ مرزهای feature و تثبیت زیرساخت بک‌اند است؛ به‌ویژه خطاهای Prisma و build API که مانع از وضعیت fully green برای build کلی هستند.

## بررسی قوانین پروژه و copilot-instructions.md
مستند راهنمای توسعه در [\.github/copilot-instructions.md](../../.github/copilot-instructions.md) بر اصول زیر تأکید دارد:
- سادگی، maintainability و scalability
- معماری feature-first و MVP-first
- استفاده از TypeScript strict و اجتناب از abstractions غیرضروری
- حفظ ساختار feature boundaries
- جلوگیری از duplicated logic و over-engineering
- اهمیت documentation، changelog و verification قبل از تکمیل کار

این قوانین با ساختار فعلی پروژه سازگار هستند و در مستندات جاری مثل [docs/architecture.md](../architecture.md) و [docs/folder-structure.md](../folder-structure.md) نیز بازتاب یافته‌اند.

## درک معماری فعلی
معماری فعلی پروژه بر اساس اصول زیر شکل گرفته است:
- Mobile-first
- Feature-based frontend
- API-first برای آینده
- Foundation layer برای shared infrastructure و Feature layer برای ظرفیت‌های MVP

### معماری فرانت‌اند
- مسیرهای اپ در [apps/web/src/app](../../apps/web/src/app)
- کامپوننت‌های shared در [apps/web/src/components](../../apps/web/src/components)
- featureهای فعلی در [apps/web/src/features](../../apps/web/src/features)
- stateهای سراسری در [apps/web/src/stores](../../apps/web/src/stores)

### معماری بک‌اند
- ماژول‌های اصلی در [apps/api/src](../../apps/api/src)
- پوشه‌های اصلی: auth، podcasts، episodes، users، storage، prisma
- ساختار فعلی feature-based مستقیم است و هنوز به full Nest module migration تبدیل نشده است، اما برای MVP قابل قبول است

## بررسی ساختار Repository
### ساختار اصلی
- Frontend: [apps/web](../../apps/web)
- Backend: [apps/api](../../apps/api)
- Shared packages: [packages/config](../../packages/config) و [packages/shared-types](../../packages/shared-types)
- Infra: [docker-compose.yml](../../docker-compose.yml)
- Documentation: [docs](../)

### ساختار فرانت‌اند
- [apps/web/src/app](../../apps/web/src/app): routeها و صفحات
- [apps/web/src/features](../../apps/web/src/features): feature-owned UI و logic
- [apps/web/src/lib](../../apps/web/src/lib): API helpers و utilities
- [apps/web/src/stores](../../apps/web/src/stores): Zustand stores
- [apps/web/src/components](../../apps/web/src/components): UI primitives و layout

### ساختار بک‌اند
- [apps/api/src/auth](../../apps/api/src/auth)
- [apps/api/src/podcasts](../../apps/api/src/podcasts)
- [apps/api/src/episodes](../../apps/api/src/episodes)
- [apps/api/src/users](../../apps/api/src/users)
- [apps/api/src/storage](../../apps/api/src/storage)

## بررسی Technology Stack

| حوزه | مستند شده | وضعیت واقعی | نتیجه |
|---|---|---|---|
| Frontend Framework | Next.js App Router | Next.js 14.2.15 | ✅ سازگار |
| زبان Frontend | TypeScript | TypeScript 5.x | ✅ سازگار |
| Styling | Tailwind CSS | پیکربندی شده | ✅ سازگار |
| State Management | Zustand | در auth/player store استفاده شده | ✅ سازگار |
| Data Fetching | TanStack Query | استفاده شده | ✅ سازگار |
| Forms & Validation | React Hook Form + Zod | استفاده شده | ✅ سازگار |
| Backend Framework | NestJS | NestJS 10.x | ✅ سازگار |
| Database/ORM | PostgreSQL + Prisma | schema موجود | ✅ سازگار |
| Auth | JWT + bcrypt | پیاده‌سازی شده | ✅ سازگار |
| Storage | MinIO/S3-compatible | Docker + storage module | ✅ سازگار |
| Queue/Background Jobs | Redis/BullMQ | Redis در Docker و BullMQ هنوز در فاز بعدی | ⚠️ جزئی |
| Tests/CI | در مستندات به‌صورت roadmap | هنوز به‌صورت رسمی وجود ندارد | ⚠️ موجود نیست |

### بررسی واقعی استک
- Frontend در عمل با Next.js، React Query، Zustand، React Hook Form و Zod اجرا می‌شود.
- Backend بر اساس NestJS و Prisma پیاده شده است.
- محیط محلی با Docker Compose برای PostgreSQL، Redis و MinIO فراهم شده است.

## بررسی Feature Ownership
### مرزهای فعلی
- Routes به‌عنوان entry points در [apps/web/src/app](../../apps/web/src/app) باقی مانده‌اند.
- منطق و UI feature-specific در [apps/web/src/features](../../apps/web/src/features) نگهداری شده‌اند.
- زیرساخت‌های مشترک در [apps/web/src/lib](../../apps/web/src/lib)، [apps/web/src/components](../../apps/web/src/components) و [apps/web/src/shared](../../apps/web/src/shared) باقی مانده‌اند.

### Auth
- مرز auth در سطح فرانت‌اند به‌صورت تدریجی و قابل قبول تثبیت شده است.
- routeهای auth در [apps/web/src/app/login/page.tsx](../../apps/web/src/app/login/page.tsx) و [apps/web/src/app/register/page.tsx](../../apps/web/src/app/register/page.tsx) به‌عنوان entry point عمل می‌کنند.
- زیرساخت session/auth در [apps/web/src/lib/auth.ts](../../apps/web/src/lib/auth.ts) و [apps/web/src/stores/authStore.ts](../../apps/web/src/stores/authStore.ts) باقی مانده است.

### Podcast
- مرز podcast در فرانت‌اند به‌خوبی شکل گرفته است.
- فرم و validation مربوط به podcast در feature boundary قرار گرفته‌اند.
- routeهای [apps/web/src/app/podcasts/page.tsx](../../apps/web/src/app/podcasts/page.tsx) و [apps/web/src/app/podcasts/new/page.tsx](../../apps/web/src/app/podcasts/new/page.tsx) هنوز entry points هستند.

### Episode
- مرز episode نسبتاً واضح است و بخش‌های detail/upload به feature-owned components منتقل شده‌اند.
- page orchestration در [apps/web/src/app/episodes/[id]/page.tsx](../../apps/web/src/app/episodes/[id]/page.tsx) باقی مانده است.

### Player
- Player هنوز یک feature مستقل و fully formed نیست.
- بخش‌های فعلی در [apps/web/src/components/AudioPlayer.tsx](../../apps/web/src/components/AudioPlayer.tsx) و [apps/web/src/stores/playerStore.ts](../../apps/web/src/stores/playerStore.ts) پراکنده‌اند.
- این نقطه، واضح‌ترین ambiguity در نگهداشتن مرزهای معماری است.

## وضعیت Featureهای اصلی

| Feature | وضعیت | مالکیت فعلی | ریسک |
|---|---|---|---|
| Auth | اجرا شده | Feature UI + shared infra | نیاز به دقت در session refresh و hydration |
| Podcast | اجرا شده | Feature-owned form logic و routes entry point | نسبتاً سالم |
| Episode | اجرا شده | Feature-owned detail/upload flow | کمی به playback surface نزدیک شده |
| Player | نیمه‌اجرا / برنامه‌ریزی شده | هنوز شفاف نیست | ریسک بالاتر در آینده |

## بررسی Migrationهای انجام‌شده
مهاجرت‌های انجام‌شده در مستندات فازهای مختلف ثبت شده‌اند:
- Auth Feature Boundary Adoption
- Podcast Feature Boundary Adoption
- Episode Feature Boundary Adoption
- Episode Create Flow Migration
- Episode Detail Presentation Migration
- Episode Detail Logic Extraction
- Player Boundary Plan به‌صورت documentation-only

این مهاجرت‌ها عمدتاً روی فرانت‌اند انجام شده‌اند و بدون تغییر routeها، API contracts یا runtime behavior اصلی اجرا شده‌اند. این رویکرد دقیقاً با اصول MVP و incremental migration سازگار است.

## بررسی Quality و استانداردهای کدنویسی
### نقاط قوت
- TypeScript strict mode در [packages/config/tsconfig.base.json](../../packages/config/tsconfig.base.json) فعال است
- ساختار feature-based در فرانت‌اند به‌خوبی رعایت شده است
- lint برای وب و API در حال حاضر پاس می‌شود
- build فرانت‌اند در حال حاضر موفق است

### نقاط ضعف / مشکلات فعلی
- build بک‌اند در حالت فعلی شکست می‌خورد به دلیل خطاهای Prisma typing در سرویس‌های [apps/api/src/podcasts/podcasts.service.ts](../../apps/api/src/podcasts/podcasts.service.ts)، [apps/api/src/episodes/episodes.service.ts](../../apps/api/src/episodes/episodes.service.ts) و [apps/api/src/prisma/prisma.service.ts](../../apps/api/src/prisma/prisma.service.ts)
- تست‌ها و CI در این نسخه هنوز به‌صورت رسمی فراهم نشده‌اند
- Player هنوز به‌صورت feature مستقل و fully scoped آماده نیست

### شواهد اجرا
- اجرای `pnpm lint`: موفق
- اجرای `pnpm build`: Frontend build موفق، Backend build با خطاهای TypeScript Prisma شکست خورد

## ریسک‌های فعلی
### Critical
- شکست build بک‌اند به دلیل Prisma typing issues

### High
- ambiguity در ownership Player و احتمال coupling بیشتر در آینده

### Medium
- نیاز به تثبیت session/auth flow در شرایط refresh و hydration
- نبود CI و test suite پایه

### Low
- برخی از dependencies برنامه‌ریزی‌شده مانند next-intl، PWA و BullMQ هنوز پیاده‌نشده‌اند که برای MVP قابل قبول است

## مواردی که نباید تغییر کنند
در این مرحله، بهتر است موارد زیر بدون تغییر اساسی باقی بمانند:
- ساختار کلی feature-based frontend
- routeهای فعلی و قراردادهای API موجود
- مرزهای فعلی auth/podcast/episode به‌صورت incremental
- استراتژی foundation + feature layer
- استفاده از TypeScript strict و linting استاندارد

این موارد بخشی از هویت معماری پروژه هستند و نباید به‌صورت غیرضروری بازنویسی شوند.

## پیشنهاد قدم بعدی
قدم بعدی منطقی و قابل تأیید از روی شواهد موجود، این است:
1. تثبیت بک‌اند و رفع خطاهای Prisma/build API
2. حفظ و تقویت boundaryهای feature بدون اضافه‌کردن complexity غیرضروری
3. پس از تثبیت بک‌اند، شروع incremental extraction برای Player به‌صورت feature مستقل

این ترتیب از نظر معماری، کم‌ریسک‌تر و قابل‌پیش‌بینی‌تر از شروع بازنویسی‌های گسترده است.

## نتیجه نهایی
پروژه در وضعیت قابل قبول و قابل ادامه‌ی توسعه قرار دارد. درک معماری و وضعیت فعلی به‌خوبی شکل گرفته است و مستندات موجود با واقعیت ریپو هم‌خوانی زیادی دارند. با این حال، برای ورود به مرحله‌ی بعدی، باید تمرکز بر تثبیت بک‌اند و رفع مشکلات build آغاز شود.

PROJECT UNDERSTOOD: YES

READY TO CONTINUE: YES
