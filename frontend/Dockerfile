FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 5173

# Run Vite dev server
CMD ["sh", "-c", "npm run dev 2>&1"]
