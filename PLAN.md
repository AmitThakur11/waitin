# CarCall — Product & Engineering Plan

A QR-based "contact my car's owner" app. Owners register their cars and print a
unique QR sticker. Anyone can scan it (no app, no login) and trigger an action —
"please move your car", "lights left on", "you're blocking me", "emergency", or
start an **anonymous** masked call / chat. The owner receives an instant **flash**
push notification in the app.

---

## 1. System overview

```
┌─────────────────────┐         ┌──────────────────────────────┐
│  Owner mobile app    │  REST   │   Backend (NestJS + Postgres) │
│  (React Native 0.85) │◄───────►│                               │
│  - phone OTP login   │  push   │  - Auth (phone OTP)           │
│  - add cars          │◄────────│  - Cars + QR tokens           │
│  - QR sticker        │  (FCM)  │  - Scan events + notifications│
│  - flash alerts      │         │  - Masked call (Twilio)       │
│  - chat (owner side) │  WS     │  - Chat (WebSocket)           │
└─────────────────────┘◄───────►│  - Public scan web page (SSR) │
                                 └──────────────┬───────────────┘
                                                │  HTTPS
                              ┌─────────────────▼─────────────────┐
                              │  Scanner's phone browser            │
                              │  scan QR → carcall.app/c/<token>    │
                              │  → quick-action buttons             │
                              │  → optional masked call / chat      │
                              └─────────────────────────────────────┘
```

Three deployables:
1. **carcall** — React Native app (owner-facing). Already scaffolded (RN 0.85, bare, TS).
2. **carplay_backend** — NestJS API + the public scan web page (one service to start).
3. **(included in #2)** Public scan page — server-rendered by NestJS to keep MVP to one deploy.

---

## 2. Core flows

### A. Owner onboarding
1. Open app → phone number → receive SMS OTP → verify → JWT issued.
2. Register device FCM token for push.
3. Add first car (nickname, make/model, color, plate*, optional photo). *plate stays private unless opted in.
4. Backend mints a QR **token** for the car → app renders the QR + "share / print sticker".

### B. Stranger scans the QR
1. QR encodes `https://carcall.app/c/<token>` (opaque token, no personal data).
2. Browser opens the scan page → shows owner-approved minimal info ("Silver Honda") + action buttons.
3. Scanner taps an action (or writes optional note / starts call / chat). No login required.
4. Backend records a `scan_event` and pushes a **flash** notification to the owner.

### C. Owner gets the flash + responds
1. Full-screen / high-priority notification ("Someone needs you to move your car").
2. Owner can: acknowledge, send a quick reply, call back (masked), or open chat.

### D. Anonymous call / chat
- **Masked call:** Twilio proxy number bridges scanner ↔ owner; neither sees the other's number.
- **Chat:** ephemeral WebSocket session tied to the scan event; owner replies from the app.

---

## 3. Data model (Postgres)

| Table | Key columns |
|---|---|
| `users` | id, phone (unique), name, created_at |
| `devices` | id, user_id, fcm_token, platform (ios/android), last_seen |
| `otp_codes` | id, phone, code_hash, expires_at, attempts (or use Twilio Verify, no table) |
| `cars` | id, user_id, nickname, make, model, color, plate, photo_url, display_label, created_at |
| `car_display_settings` | car_id, show_label bool, allow_call bool, allow_chat bool, allow_message bool |
| `qr_tokens` | id, car_id, token (unique, opaque), active, created_at, revoked_at |
| `scan_events` | id, car_id, token_id, action_type, message, scanner_ip_hash, created_at |
| `notifications` | id, user_id, scan_event_id, read_at, created_at |
| `call_sessions` | id, scan_event_id, twilio_sid, status, started_at, ended_at |
| `chat_sessions` | id, scan_event_id, status, created_at |
| `chat_messages` | id, chat_session_id, sender (owner/scanner), body, created_at |

**Action types:** `move_car`, `lights_on`, `blocking`, `damage`, `emergency`, `custom_message`, `call`, `chat`.

**Why token rotation matters:** a printed sticker can be copied/photographed. `qr_tokens`
lets an owner revoke a token and generate a fresh QR without losing the car record.

---

## 4. API surface (NestJS)

**Auth (public)**
- `POST /auth/request-otp` `{ phone }`
- `POST /auth/verify-otp` `{ phone, code }` → `{ accessToken, refreshToken }`
- `POST /auth/refresh`

**Devices (auth)**
- `POST /devices` `{ fcmToken, platform }`

**Cars (auth)**
- `GET /cars` · `POST /cars` · `PATCH /cars/:id` · `DELETE /cars/:id`
- `GET /cars/:id/qr` → QR image/SVG + share URL
- `POST /cars/:id/qr/rotate` → new token, revoke old
- `PATCH /cars/:id/display` → display & permission settings

**Public scan (no auth, rate-limited)**
- `GET /c/:token` → SSR scan page (or JSON for the page's JS)
- `POST /c/:token/notify` `{ actionType, message? }` → creates scan_event + push
- `POST /c/:token/call` → starts masked call session, returns dial info
- `WS  /c/:token/chat` → ephemeral chat session

**Notifications (auth)**
- `GET /notifications` (feed/history) · `POST /notifications/:id/read`
- `WS /events` → live flash delivery to an open app

---

## 5. Mobile app screens (RN)

1. **Onboarding** — phone entry → OTP verify.
2. **Home / Dashboard** — car list + recent activity feed.
3. **Add / Edit Car** — details, photo, display & permission toggles.
4. **Car Detail** — big QR, share/print sticker, rotate token.
5. **Flash Alert** — full-screen high-priority notification on scan; quick reply / call back / chat.
6. **Notification History** — past scan events.
7. **Chat** — owner-side conversation for a scan session.
8. **Settings / Profile**.

---

## 6. Key libraries

**RN app**
- Navigation: `@react-navigation/native` (+ native-stack)
- Push: `@react-native-firebase/app` + `/messaging`; `@notifee/react-native` for full-screen "flash"
- QR render: `react-native-qrcode-svg`
- Data: `@tanstack/react-query` + `axios`
- Secure token storage: `react-native-keychain`
- Realtime (chat/flash): `socket.io-client`

**Backend (NestJS)**
- ORM: Prisma (or TypeORM) + Postgres
- Auth: `@nestjs/jwt` + Passport; `@nestjs/throttler` for rate limiting
- Validation: `class-validator` / `class-transformer`
- SMS OTP + masked call: `twilio` (Verify API for OTP, Voice/Proxy for masked call)
- Push: `firebase-admin`
- QR: `qrcode` (server-side image gen)
- Chat + live flash: `@nestjs/websockets` + `socket.io`
- Scan page render: `@nestjs/serve-static` + a templating engine (Handlebars/EJS) or a tiny Vite bundle served static

---

## 7. Privacy, safety & abuse controls (designed in, not bolted on)

- **No PII in the QR** — only an opaque token; the page reveals only what the owner opts to show.
- **Rate limiting** per token + per scanner IP to stop spam/harassment.
- **Masked calls/chat** — neither party ever sees the other's phone number.
- **Token rotation** — invalidate a copied/stolen sticker instantly.
- **IP hashing** — store a hash of scanner IP for abuse tracing, never the raw IP.
- **Per-car permission toggles** — owner decides if calls/chat/messages are allowed.
- **Block/mute** abusive scan sessions.

---

## 8. Infrastructure

- **Postgres:** managed (Neon / Supabase / RDS).
- **Backend host:** Railway / Render / Fly.io to start.
- **Domain:** short path for QR, e.g. `carcall.app/c/<token>` (HTTPS required for browser camera/geo).
- **Push:** Firebase project (FCM) + APNs auth key for iOS.
- **Twilio:** account with Verify + a proxy phone number.

---

## 9. Milestones

| Phase | Deliverable |
|---|---|
| **0 — Foundations** | NestJS scaffold, Postgres via Docker, env config, CI lint/test. RN app: navigation, design system, API client. |
| **1 — Auth** | Phone OTP end-to-end (Twilio Verify), JWT + refresh, device/FCM registration. |
| **2 — Cars + QR** | Car CRUD, QR token mint/rotate, Car Detail screen, share/print sticker. |
| **3 — Scan + Flash** | Public scan web page, quick-action `notify`, FCM push, full-screen flash alert, notification feed/history. |
| **4 — Call + Chat** | Twilio masked call, WebSocket chat, owner chat UI. |
| **5 — Hardening** | Rate limiting, abuse controls, token rotation UX, analytics, polish, App Store / Play prep. |

---

## 10. Open items to confirm later

- Domain name for the QR short link.
- One car per user at launch, or multiple? (Model supports multiple.)
- iOS full-screen "flash" — APNs critical/time-sensitive entitlement may be needed for true full-screen.
- Twilio vs. alternative SMS/voice provider by region/cost.
- Whether the scan page should also capture optional gelocation ("car is at X").
