# Use the official Playwright image which includes Node.js and Chromium dependencies
FROM mcr.microsoft.com/playwright:v1.61.0-noble

# Set the working directory
WORKDIR /app

# Copy backend package.json and install backend dependencies
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm install

# Copy all other source code (this now includes the pre-built dist folder)
COPY . .

# Expose the port the Node server will run on
EXPOSE 5000

# Start the Node.js backend daemon
CMD ["node", "backend/server.js"]
