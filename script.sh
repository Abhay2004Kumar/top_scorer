#!/bin/bash

# Run Backend
(cd BackEnd/ && npm run dev) &

# Run Admin
(cd admin_top_scorer && PORT=3001 npm run start) &

# Run Frontend
(cd FrontEnd/topscorer && PORT=3003 npm run start)

