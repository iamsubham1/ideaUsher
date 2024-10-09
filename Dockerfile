# Use the official Ubuntu base image
FROM ubuntu

# Install dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on (adjust if necessary)
EXPOSE 8080

# Specify the start command
CMD ["node", "index.js"]
