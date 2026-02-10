# import os
# from celery import Celery

# redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# celery_app = Celery("docunexus", broker=redis_url, backend=redis_url)

# celery_app.conf.update(
#     task_serializer="json",
#     accept_content=["json"],
#     result_serializer="json",
#     timezone="UTC",
#     enable_utc=True,
# )

# celery_app.autodiscover_tasks(["app.workers"])




import os
import ssl
from celery import Celery
from app.core.config import settings


celery_app = Celery(
    "docunexus", 
    broker=settings.REDIS_URL,
    include=["app.agents.rag"] 
)

# 2. Configure Cloud SSL correctly
celery_app.conf.update(
    broker_use_ssl={'ssl_cert_reqs': ssl.CERT_NONE},
    redis_backend_use_ssl={'ssl_cert_reqs': ssl.CERT_NONE},
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    broker_connection_retry_on_startup=True,
)

# 3. Auto-discover tasks (Backup)
celery_app.autodiscover_tasks(["app.agents"])