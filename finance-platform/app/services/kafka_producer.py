import json
import logging
from functools import lru_cache
from typing import Any

from kafka import KafkaProducer

from app.core.config import settings

logger = logging.getLogger(__name__)


@lru_cache
def get_kafka_producer() -> KafkaProducer | None:
    if not settings.kafka_enabled:
        return None
    return KafkaProducer(
        bootstrap_servers=settings.kafka_bootstrap_servers,
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    )


def publish_expense_created(event: dict[str, Any]) -> None:
    producer = get_kafka_producer()
    if producer is None:
        return
    future = producer.send(settings.kafka_topic_expense_created, event)
    future.get(timeout=5)
    logger.info("Published event to Kafka topic %s", settings.kafka_topic_expense_created)
