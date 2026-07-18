# Phase 2.10 — Player Data Contract Definition Plan

## Objective

این فاز صرفاً برای تعریف قرارداد داده‌ی آینده بین Episode و Player انجام می‌شود. هدف اصلی این است که:

- مشخص شود Player برای عملکرد خود دقیقاً به چه داده‌هایی نیاز دارد
- مشخص شود Episode چه داده‌هایی را به‌عنوان منبع معتبر برای پخش ارائه می‌کند
- جلوگیری شود که Player به جزئیات داخلی Episode وابسته شود
- جلوگیری شود که Episode به implementation داخلی Player وابسته شود
- یک قرارداد پایدار برای آینده برای Library، Search، Playlist و Recommendations ایجاد شود

این فاز محدود به مستندسازی معماری است و هیچ تغییر runtime، API، type یا dependency را در بر نمی‌گیرد.

---

## Current Episode Data Model

در مدل فعلی، اپیزود در سطح shared types اطلاعات پایه‌ای زیر را ارائه می‌کند:

| Field | Source | Current Usage | Future Owner |
| --- | --- | --- | --- |
| id | [packages/shared-types/src/index.ts](../../packages/shared-types/src/index.ts) | شناسه‌ی یکتا برای رفرنس و انتخاب اپیزود | Shared contract / Episode |
| podcastId | [packages/shared-types/src/index.ts](../../packages/shared-types/src/index.ts) | برای نمایش رابطه با پادکست و آینده‌ی metadata | Episode |
| title | [packages/shared-types/src/index.ts](../../packages/shared-types/src/index.ts) | نمایش عنوان در UI و عنوان پخش | Episode |
| description | [packages/shared-types/src/index.ts](../../packages/shared-types/src/index.ts) | اطلاعات تکمیلی برای نمایش | Episode |
| audioUrl | [packages/shared-types/src/index.ts](../../packages/shared-types/src/index.ts) | منبع فعلی برای پخش در UI و audio element | Shared playable contract |
| publishedAt | [packages/shared-types/src/index.ts](../../packages/shared-types/src/index.ts) | نمایش زمان انتشار | Episode |
| createdAt / updatedAt | [packages/shared-types/src/index.ts](../../packages/shared-types/src/index.ts) | metadata‌ی سیستم | Episode |

### تحلیل فعلی

- Episode فعلاً فقط یک مدل داده‌ی ساده است و اطلاعات پخش را از طریق audioUrl و metadata‌ی پایه ارائه می‌کند.
- در فرانت‌اند، [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx) مستقیماً از audioUrl استفاده می‌کند.
- [apps/web/src/components/AudioPlayer.tsx](../../apps/web/src/components/AudioPlayer.tsx) نیز یک player ساده با HTMLAudioElement و state محلی دارد.
- [apps/web/src/stores/playerStore.ts](../../apps/web/src/stores/playerStore.ts) هنوز از Episode به‌صورت مستقیم به‌عنوان current item استفاده می‌کند؛ این موضوع نشان‌دهنده‌ی وابستگی اولیه‌ی player به مدل اپیزود است.

---

## Playback Data Requirements

Player در آینده باید بتواند از داده‌ی یک item پخش‌پذیر بدون نیاز به دسترسی به ساختار داخلی Episode کار کند.

### Required fields

این فیلدها برای حداقل عملکرد player ضروری‌اند:

- id: شناسه‌ی یکتا برای شناسایی item
- title: عنوان قابل نمایش در UI
- audioUrl: منبع اصلی پخش

### Optional fields

این فیلدها برای تجربه‌ی بهتر و نمایش richer UI مفیدند:

- description
- artworkUrl
- podcastTitle
- podcastId
- duration
- publishedAt

### Future fields

این فیلدها برای ویژگی‌های آینده‌ای مانند resume، queue، playlist و richer media experience لازم خواهند بود:

- resumePosition
- streamUrl / hlsUrl
- subtitleUrl
- chapterMetadata
- contentType
- sourceKind
- playbackMode / availability

### نتیجه

حداقل قرارداد باید روی داده‌ی پخش‌پذیر تمرکز کند و از وابستگی به همه‌ی فیلدهای Episode جلوگیری کند.

---

## Playable Entity Proposal

### گزینه A — استفاده مستقیم از Episode

مزایا:

- ساده‌ترین مسیر برای شروع
- نیاز به تعریف جدید کم‌تر

معایب:

- Player به‌طور مستقیم به یک feature خاص وابسته می‌شود
- استفاده‌ی مجدد برای Library/Search/Playlist سخت‌تر می‌شود
- در آینده مرز ownership مبهم می‌شود

### گزینه B — تعریف یک قرارداد عمومی و مستقل به نام PlayableItem

مزایا:

- Player از یک contract عمومی استفاده می‌کند
- Episode فقط یک producer از این contract است
- Library، Search، Playlist و Recommendations می‌توانند همان contract را استفاده کنند
- مرز feature شفاف‌تر می‌شود

معایب:

- نیاز به یک layer mapping بین domain model و playable contract دارد
- اگر خیلی زود عمومی‌سازی شود، ممکن است contract بیش از حد پیچیده شود

### Recommendation

پیشنهاد این فاز این است که از گزینه B استفاده شود، اما با حداقل‌سازی سطح abstraction.

Contract پیشنهادی باید:

- ساده و read-focused باشد
- فقط اطلاعات لازم برای پخش و نمایش اولیه را ارائه کند
- برای Episode و سایر منابع قابل استفاده باشد
- از وابستگی مستقیم به Episode جلوگیری کند

### Proposed contract shape

یک قرارداد پیشنهادی برای آینده می‌تواند شامل این موارد باشد:

- id
- kind/sourceType
- title
- subtitle
- audioUrl
- artworkUrl
- duration
- description
- podcastId
- podcastTitle

این قرارداد باید به‌عنوان یک ساختار داده‌ای shared و مستقل در نظر گرفته شود، نه به‌عنوان بخشی از implementation Episode.

---

## Ownership Boundary

### Episode owns

Episode باید مالکیت این موارد را حفظ کند:

- business data اپیزود
- metadata‌ی اپیزود
- CRUD اپیزود
- workflow آپلود audio
- validation و rules مربوط به episode

### Player owns

Player باید مالکیت این موارد را بر عهده بگیرد:

- lifecycle پخش
- play/pause/stop/load
- queue و current item
- کنترل‌های پخش
- player UI
- playback-related state
- media-session integration در آینده

### Shared boundary

بخش‌هایی که باید خارج از ownership مستقیم Episode یا Player باقی بمانند:

- UI primitives مشترک
- shared hooks و utilities
- API access layer
- generic data adaptations

---

## Dependency Direction

جهت وابستگی پیشنهادی باید به‌صورت زیر باشد:

Episode
↓
Playable Contract
↓
Player

### Meaning

- Episode داده و metadata‌ی اپیزود را فراهم می‌کند
- یک adapter یا mapper قرارداد playable را تولید می‌کند
- Player فقط از قرارداد playable استفاده می‌کند

### Forbidden direction

این وابستگی‌ها باید اجتناب شوند:

- Player نباید به‌طور مستقیم از internals Episode استفاده کند
- Episode نباید به state یا implementation Player وابسته شود
- Player نباید مسئول CRUD اپیزود یا upload workflow باشد

---

## Future Feature Compatibility

### Library

Library می‌تواند آیتم‌های ذخیره‌شده را به‌عنوان playable item در نظر بگیرد. اگر Library به‌صورت دنبال‌کردن episode یا saved item کار کند، همان قرارداد playable می‌تواند برای شروع پخش استفاده شود.

### Search

Search results می‌توانند از همان contract استفاده کنند تا کاربر بتواند از نتیجه‌ی جستجو وارد پخش شود بدون اینکه Search به مدل Episode خاص وابسته باشد.

### Playlist

Playlist می‌تواند queue itemهای خود را روی همان قرارداد playable استوار کند. این موضوع باعث می‌شود queue و playback برای چند منبع مختلف یکسان باشد.

### Recommendations

Recommendations نیز می‌توانند آیتم‌های پیشنهادی خود را به‌صورت playable item ارائه دهند. این طراحی باعث می‌شود Player در آینده به‌جای وابستگی به Episode، روی یک abstraction عمومی کار کند.

---

## Migration Strategy

### Phase 1 — Document contract

- مستندسازی داده‌ی لازم برای Player
- تعریف مرز Episode vs Player
- ثبت dependency direction

### Phase 2 — Introduce shared playable contract

- تعریف یک contract ساده و عمومی برای playable items
- نگه‌داشتن Episode به‌عنوان source producer
- بدون تغییر runtime behavior

### Phase 3 — Connect Player to contract

- انتقال consumption از Episode direct model به playable contract
- نگه‌داشتن Episode در نقش provider داده

### Phase 4 — Remove direct playback coupling from Episode

- حذف وابستگی مستقیم Episode به audio lifecycle و player state
- تثبیت Player به‌عنوان owner اصلی playback experience

---

## Risks

### 1. Over-generalization too early

اگر contract خیلی زود بیش از حد عمومی شود، complexity آن بالاتر از نیاز MVP می‌رود.

### 2. Player dependency on Episode

اگر Player مستقیماً به Episode یا internals آن وابسته شود، future ownership دوباره مبهم می‌شود.

### 3. Duplication of episode data

اگر در هر لایه داده‌ی مشابهی دوباره نگهداری شود، inconsistency ایجاد می‌شود.

### 4. API coupling

اگر contract به‌صورت مستقیم به endpointهای خاص Episode وابسته شود، migration آینده دشوارتر می‌شود.

### 5. Queue complexity

با رشد feature، queue و history نیاز به state‌ای قوی‌تر از metadata ساده خواهند داشت.

### 6. Metadata inconsistency

اگر Episode و Player هر کدام metadata‌ی متفاوتی را به‌عنوان source در نظر بگیرند، تجربه‌ی کاربری ناپایدار می‌شود.

---

## Guardrails

- این فاز هیچ تغییر runtime ندارد
- هیچ route یا API contractی تغییر نمی‌کند
- هیچ type یا interface‌ای در کد اضافه یا تغییر نمی‌شود
- Player نباید مالک CRUD اپیزود یا upload audio شود
- Episode نباید به‌طور ضمنی مالک playback engine شود
- قرارداد playable باید ساده، قابل‌استفاده و قابل‌توسعه باشد

---

## Future Checklist

- [ ] یک قرارداد ساده‌ی playable در سطح shared یا feature boundary تعریف شود
- [ ] Episode به‌عنوان producer داده‌ی playable شناخته شود
- [ ] Player به‌عنوان consumer اصلی lifecycle پخش شناخته شود
- [ ] Library/Search/Playlist/Recommendations بر اساس همان contract قابل پشتیبانی باشند
- [ ] در مرحله‌ی implementation، از direct dependency به Episode جلوگیری شود

---

## Validation Summary

این فاز به‌صورت documentation-only اجرا شد و موارد زیر تأیید می‌شود:

- هیچ تغییر کد اعمال نشده است
- هیچ فایل implementation جدید ایجاد نشده است
- هیچ type یا API contractی تغییر نکرده است
- هیچ وابستگی جدیدی اضافه نشده است
- هیچ رفتار runtimeی تغییر نکرده است

---

## Final Decision

READY FOR PLAYER IMPLEMENTATION

دلیل: قرارداد داده‌ی پایه برای مرز Episode/Player به‌صورت شفاف تعریف شده است و مرز مالکیت، نیازهای داده‌ای، مسیر مهاجرت و ریسک‌ها برای فاز implementation بعدی روشن شده‌اند.
