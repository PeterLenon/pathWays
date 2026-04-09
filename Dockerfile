# ─── Stage 1: Install dependencies ───────────────────────────────────────────
# Uses the lockfile for a reproducible install. Alpine keeps the image small.
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts


# ─── Stage 2: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are baked into the client JS bundle at build time.
# Pass them via `build.args` in docker-compose.yml (or --build-arg on the CLI).
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
# Tells next.config.mjs to enable output:"standalone" for the Docker image.
# The standalone mode is gated on this flag because @vercel/nft trace collection
# hits macOS XProtect timeouts on local builds but runs fine on Linux in Docker.
ENV DOCKER_BUILD=1

RUN npm run build


# ─── Stage 3: Runtime ────────────────────────────────────────────────────────
# Minimal image: only the standalone bundle, static assets, and public/.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run as non-root for security.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public                    ./public
COPY --from=builder --chown=nextjs:nodejs \
     /app/.next/standalone                         ./
COPY --from=builder --chown=nextjs:nodejs \
     /app/.next/static                             ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# next/standalone produces server.js at the bundle root.
CMD ["node", "server.js"]
