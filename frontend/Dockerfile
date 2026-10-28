FROM node:22-alpine

WORKDIR /app

# Dependencies are installed in the image once; the Compose startup command keeps
# them in sync with the lockfile because the source is bind-mounted in dev.
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .

EXPOSE 5173 3000
CMD ["npm", "run", "dev"]
