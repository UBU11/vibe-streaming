# Video Streaming Platform — Execution Architecture

**Document Purpose**  
This document outlines the architectural execution plan for a video streaming platform built with Next.js, Turso SQLite, Upstash Redis, Cloudflare reverse proxy, Datadog observability, and the Vidfast API.  
It contains only architectural decisions and system design — no implementation code.

---

## 1. System Overview

The platform is a full‑stack video streaming application with the following core capabilities:

- Aggregation and playback of video content via the Vidfast API
- User authentication and personal libraries
- Adaptive bitrate streaming through a custom video player
- Global edge delivery and DDoS protection via Cloudflare
- Real‑time monitoring and analytics via Datadog

**Tech Stack Summary**

| Layer                | Technology / Service                |
|----------------------|-------------------------------------|
| Frontend & API       | Next.js (App Router)                |
| Primary Database     | Turso (libSQL / SQLite compatible)  |
| Cache & Rate Limiting| Upstash Redis                       |
| Reverse Proxy & CDN  | Cloudflare (Edge Workers / WAF)     |
| Observability        | Datadog (RUM, APM, Logs)            |
| Video Source         | Vidfast API (primary)               |
| Optional Encoding    | Mux (if needed for transcoding)     |

---

## 2. Core Architectural Components

### 2.1 Cloudflare Edge Layer

Cloudflare acts as the first line of defence and acceleration layer.

- **DNS & Anycast CDN**  
  All traffic resolves through Cloudflare’s global network, caching static assets (images, JavaScript bundles) at the edge.

- **Reverse Proxy (Cloudflare Worker)**  
  A lightweight Worker intercepts requests to the Next.js origin. Responsibilities:
  - Rewriting `Host` headers to protect origin server identity
  - Injecting security headers (Content‑Security‑Policy, HSTS)
  - Geolocation‑based request routing (if using multiple origins)
  - Early DDoS and bot mitigation

- **WAF & Rate Limiting**  
  Cloudflare’s Web Application Firewall is configured to block common attack patterns.  
  Per‑IP rate limits are enforced *at the edge* to prevent volumetric abuse before requests reach the application.

### 2.2 Next.js Application Layer

The Next.js monolith serves both the user interface and the backend API.

**Application Structure (Logical Separation)**

- **Public Marketing Area**  
  Server‑rendered pages for SEO‑optimised landing, search, and category browsing.

- **Authenticated Dashboard**  
  Protected routes that display the user’s library, watch history, and video player.

- **API Routes (tRPC or REST)**  
  All dynamic data operations flow through a unified API layer.  
  tRPC is preferred for end‑to‑end type safety between server and client.

- **Video Player Context**  
  A persistent React Context keeps the video player mounted across navigation events, enabling background playback and seamless episode switching.

**Streaming Strategy**

- The player uses **HLS.js** to consume HLS manifests.  
- Vidfast API endpoints return source URLs that are passed directly to the player.  
- For enhanced control (e.g., DRM or custom bitrate ladders), an optional Mux integration can proxy and transcode videos.

### 2.3 Data & Caching Layer

#### Turso SQLite Database

Turso provides a globally distributed, SQLite‑compatible database ideal for serverless deployments.

**Schema Design Principles**

- **Users & Profiles** – Stores authentication metadata and preferences.
- **Video Catalog** – Caches metadata from Vidfast (title, description, thumbnail, duration) to reduce external API calls.
- **Watch History** – Tracks playback progress per user, enabling “Continue Watching” features.
- **User Library / Favourites** – Many‑to‑many relationship between users and videos.
- **API Usage Logging** – Tracks calls to Vidfast to monitor consumption and avoid exceeding rate limits.

**Multi‑DB Schema (Scalability Path)**  
For user bases exceeding hundreds of thousands, Turso’s multi‑database schemas can isolate data per user, improving write performance and simplifying backup/restore operations.

#### Upstash Redis

Upstash Redis serves as a shared, durable cache across serverless function instances.

**Cache Invalidation Strategy**

- **Write‑Through Cache** – When new video metadata is fetched from Vidfast, it is written to both Turso and Redis.
- **Time‑Based Expiry** – All cached items have a defined TTL (e.g., 1 hour for video metadata, 5 minutes for search results).
- **Explicit Invalidation** – When an admin updates a video, a Pub/Sub message clears the relevant cache keys across all edge locations.

**Rate Limiting Implementation**

- A sliding‑window rate limiter (powered by Upstash) is applied to all API routes.
- Different tiers of limits are enforced based on endpoint sensitivity (e.g., stricter limits on search endpoints to prevent scraping).

### 2.4 Observability with Datadog

**Frontend Monitoring (RUM)**

- Datadog Real User Monitoring is injected via a Next.js `Script` component in the root layout.
- Tracks:
  - Core Web Vitals (LCP, INP, CLS)
  - Video player errors (HLS.js fatal errors, buffering stalls)
  - User interaction flows (search → click → watch)

**Backend Monitoring (APM & Logs)**

- Datadog’s Node.js tracer instruments all Next.js API routes and server components.
- Custom metrics are emitted for:
  - Vidfast API response times and error rates
  - Turso query durations
  - Cache hit ratios from Upstash
- Structured logs (JSON) are shipped to Datadog Log Management for correlation with traces.

**Alerting & Dashboards**

- Dashboards display:
  - Concurrent stream count (active video sessions)
  - Vidfast API usage vs. quota
  - Error budget consumption (SLOs defined for video start time and playback success rate)
- Alerts trigger on:
  - Elevated 5xx error rates
  - Sudden drop in cache hit ratio
  - Vidfast API outage detection

---

## 3. Data Flow Patterns

### 3.1 Video Playback Flow

1. **User requests a video page** – Next.js server component checks Turso for cached metadata.  
   - If missing, it queries Vidfast API (with Upstash circuit breaker to prevent cascade failures) and stores the result.
2. **Player initialisation** – The client receives the HLS manifest URL (either direct from Vidfast or via a proxied Mux playback ID).  
3. **Streaming** – HLS segments are fetched directly from the CDN origin. Cloudflare caches `.m3u8` and `.ts` files to offload bandwidth.
4. **Watch progress reporting** – Every 10 seconds, the client sends a lightweight `POST /api/progress` request.  
   - Upstash is used to debounce and aggregate writes to Turso, reducing database load.

### 3.2 Search Flow

1. **User types a query** – Debounced client‑side request to `/api/search`.
2. **Cache lookup** – Upstash Redis is checked for the query key.  
3. **Cache miss** – Next.js API route calls Vidfast search endpoint.  
   - Response is transformed to a consistent schema and stored in Redis with a short TTL.
4. **Pagination** – Cursors are passed to Vidfast and returned to the client.

### 3.3 Authentication Flow

- **NextAuth.js** handles user sessions using a JWT strategy.
- Session tokens are stored in an HTTP‑only, secure cookie.
- Middleware on protected routes validates the session by checking Turso for the user record (fallback to Upstash session cache for performance).

---

## 4. Security & Compliance Considerations

| Concern                     | Mitigation Strategy                                                                           |
|-----------------------------|-----------------------------------------------------------------------------------------------|
| **Video source protection** | Cloudflare Worker signs HLS manifest URLs with short‑lived tokens; origin server validates.   |
| **API abuse**               | Multi‑tier rate limiting: Cloudflare edge (volumetric) + Upstash (per‑user precision).        |
| **Data residency**          | Turso database location selected to comply with regional regulations.                          |
| **PII handling**            | User email addresses are stored encrypted at rest in Turso; logs redact sensitive information. |
| **Bot scraping**            | Cloudflare Bot Management enabled with challenge actions for suspicious patterns.              |

---

## 5. Deployment & CI/CD

**Hosting Platform**

- **Next.js Application** – Deployed on Vercel for optimal edge function support and preview deployments.  
  Alternative: Self‑hosted on Fly.io or AWS ECS if more control is required.

**Environment Configuration**

| Environment Variable        | Purpose                                  |
|-----------------------------|------------------------------------------|
| `TURSO_DATABASE_URL`        | Turso connection string                  |
| `TURSO_AUTH_TOKEN`          | Turso authentication token               |
| `UPSTASH_REDIS_REST_URL`    | Upstash Redis endpoint                   |
| `UPSTASH_REDIS_REST_TOKEN`  | Upstash authentication token             |
| `VIDFAST_API_KEY`           | API key for Vidfast                      |
| `NEXTAUTH_SECRET`           | Encryption key for session cookies       |
| `DATADOG_API_KEY`           | Datadog agent API key                    |
| `DATADOG_APPLICATION_ID`    | Datadog RUM application ID               |
| `CLOUDFLARE_ZONE_ID`        | Cloudflare zone identifier for proxy     |

**CI/CD Pipeline**

1. **Git push** triggers GitHub Actions.
2. **Lint & Type Check** – Runs `tsc` and ESLint.
3. **Database Migrations** – Drizzle Kit applies pending migrations to a staging Turso branch.
4. **Build** – Next.js static and serverless build.
5. **Deploy** – Vercel Git integration deploys preview for branches, production for `main`.
6. **Post‑Deploy Smoke Tests** – Datadog Synthetic tests verify critical user journeys.

---

## 6. Scaling Roadmap

### Phase 1 – MVP (Single Region)

- Single Turso primary database
- Minimal caching (metadata only)
- Direct Vidfast API integration
- Basic monitoring

### Phase 2 – Growth (Multi‑Region)

- Turso read replicas in user‑dense regions (e.g., US‑East, EU‑West)
- Upstash Global Database for low‑latency rate limiting
- Mux integration for critical content (to reduce dependency on Vidfast)
- Datadog anomaly detection alerts

### Phase 3 – Enterprise Scale

- Turso multi‑database schemas per user (horizontal sharding)
- Cloudflare Workers for on‑the‑fly manifest signing
- Custom video encoding pipeline with Mux
- Dedicated incident response playbooks integrated with Datadog On‑Call

---

## 7. Observability & Operational Metrics

| Metric Category               | Key Metrics Monitored                                      |
|-------------------------------|------------------------------------------------------------|
| **User Experience**           | Video start time (TTV), buffering ratio, playback errors   |
| **API Performance**           | p95 latency for `/api/video/[id]`, error rate              |
| **Infrastructure**            | Turso query latency, Upstash cache hit ratio               |
| **Business**                  | Daily active streams, library additions, watch time        |
| **External Dependency**       | Vidfast API availability and response time                 |

All metrics are exported to Datadog dashboards and configured with SLO‑based alerting thresholds.

---

## 8. Conclusion

This architectural plan defines a scalable, observable, and secure foundation for a video streaming platform using the specified technology stack. The design prioritises edge delivery, caching efficiency, and real‑time monitoring while maintaining flexibility for future growth.
