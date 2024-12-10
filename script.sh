#!/bin/bash

# Get the local IP address
IPADDR=$(ifconfig | grep -E 'inet (addr:)?' | grep -v '127.0.0.1' | awk '{print $2}' | cut -d':' -f2 | head -n1)

# Export the Backend URL with the IP address
export REACT_APP_BACKEND_URL=http://$IPADDR:5000


echo "Backend URL set to: $REACT_APP_BACKEND_URL"

# Run Backend
(cd BackEnd/ && npm run dev) &

# Run Admin
(cd admin_top_scorer && PORT=3001 npm run start) &

# Run Frontend
(cd FrontEnd/topscorer && PORT=3003 npm run start)
