# FROM python:3.11-slim

# WORKDIR /app


# RUN apt-get update && apt-get install -y \
#     build-essential \
#     curl \
#     libpoppler-cpp-dev \
#     tesseract-ocr \
#     && rm -rf /var/lib/apt/lists/*


# RUN curl -sSL https://install.python-poetry.org | python3 -
# ENV PATH="/root/.local/bin:$PATH"


# COPY pyproject.toml poetry.lock* ./


# RUN poetry config virtualenvs.create false \
#     && poetry install --no-root --no-interaction --no-ansi


# COPY . .

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]









FROM python:3.11-slim

WORKDIR /app

# 1. Install System Dependencies (Kept your list + added procps for process management)
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpoppler-cpp-dev \
    tesseract-ocr \
    procps \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# 3. Install Python Dependencies
COPY pyproject.toml poetry.lock* ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --no-interaction --no-ansi

# 4. Copy Code
COPY . .

# 5. [CRITICAL CHANGE] Create a startup script to run BOTH services
# - Starts Celery in background (&)
# - Starts Uvicorn in foreground on port 7860 (REQUIRED by HF Spaces)
RUN echo '#!/bin/bash \n\
echo "🚀 Starting Celery Worker..." \n\
celery -A app.core.celery_app worker --loglevel=info & \n\
echo "🚀 Starting FastAPI on port 7860..." \n\
uvicorn app.main:app --host 0.0.0.0 --port 7860 \n\
wait' > /start.sh && chmod +x /start.sh

# 6. Expose the Hugging Face port
EXPOSE 7860

# 7. Run the script
CMD ["/start.sh"]