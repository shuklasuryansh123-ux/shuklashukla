#!/bin/bash

# Keep the server running continuously
while true; do
    echo "Starting server..."
    node server.js
    echo "Server stopped. Restarting in 5 seconds..."
    sleep 5
done
