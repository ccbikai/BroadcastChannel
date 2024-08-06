# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

RUN npm install -g astro

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./
RUN npm install i --force

# Install pnpm
# RUN npm install -g astro

# Install dependencies
# RUN pnpm install

# Copy the rest of the application code to the working directory
COPY . .
# RUN astro build

# Build the project
# RUN pnpm run build

# Expose the port the app runs on
EXPOSE 4321

# Define the command to run the app
# CMD ["pnpm", "run", "preview", "--host", "0.0.0.0", "--port", "4321"]
# CMD ["astro", "build", "&&" "preview", "--host", "0.0.0.0", "--port", "4321"]
# CMD astro build && astro preview --host 0.0.0.0 --port 4321
CMD [ "/bin/sh", "./run.sh" ]
