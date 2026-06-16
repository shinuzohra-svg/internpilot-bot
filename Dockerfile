# Use the official Playwright image which includes Node.js and Chromium dependencies
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Set the working directory
WORKDIR /app

# Copy root package.json and install frontend dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy backend package.json and install backend dependencies
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm install

# Copy all other source code
COPY . .

# Build the React frontend
RUN npm run build

# Expose the port the Node server will run on
EXPOSE 5000

# Start the Node.js backend daemon
CMD ["node", "backend/server.js"]
