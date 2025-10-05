from oven/bun:latest

WORKDIR /app

COPY package.json .
COPY bun.lock .
COPY bunfig.toml .

RUN bun i

COPY . .

RUN bunx prisma migrate deploy
RUN bunx prisma generate
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "server.ts"]