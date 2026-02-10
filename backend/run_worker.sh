#!/bin/bash

# 1. Start a dummy web server in the background (to satisfy Render's port requirement)
# This simply says "I am alive" on port $PORT
python -m http.server $PORT &

# 2. Start the actual Celery Worker
celery -A app.core.celery_app worker --loglevel=info