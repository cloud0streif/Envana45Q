"""Background scheduler service for periodic data processing tasks."""

import logging
from datetime import datetime, timedelta, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings
from ..database import AsyncSessionLocal
from .data_processing import process_sensor_data

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler: AsyncIOScheduler | None = None


async def calculate_rolling_average_task():
    """
    Background task to calculate rolling average based on configuration.

    This task:
    1. Calculates the time window based on rolling_average_window_hours config
    2. Processes data using the rolling_average processor
    3. Stores results in the processed_data table
    """
    try:
        # Calculate time window from configuration
        end_time = datetime.now(timezone.utc)
        start_time = end_time - timedelta(hours=settings.rolling_average_window_hours)

        logger.info(
            f"Running rolling average calculation for {settings.rolling_average_window_hours}-hour window: "
            f"{start_time} to {end_time}"
        )

        # Create database session
        async with AsyncSessionLocal() as db:
            result = await process_sensor_data(
                db=db,
                processor_name="rolling_average",
                start_time=start_time,
                end_time=end_time,
                sensor_type=settings.rolling_average_sensor_type,
                device_id=None,  # Process all devices
            )

            logger.info(
                f"Rolling average calculation completed. "
                f"Processed {result.raw_count} readings. "
                f"Result ID: {result.id}"
            )

    except Exception as e:
        logger.error(f"Error calculating rolling average: {e}", exc_info=True)


def start_scheduler():
    """Initialize and start the background scheduler."""
    global scheduler

    if scheduler is not None:
        logger.warning("Scheduler already running")
        return

    if not settings.enable_scheduler:
        logger.info("Scheduler is disabled in configuration")
        return

    logger.info("Starting background scheduler")

    # Create scheduler with asyncio event loop
    scheduler = AsyncIOScheduler()

    # Add rolling average task - runs based on configuration
    scheduler.add_job(
        calculate_rolling_average_task,
        trigger=IntervalTrigger(minutes=settings.rolling_average_interval_minutes),
        id="rolling_average",
        name=f"Calculate {settings.rolling_average_window_hours}-hour rolling average",
        replace_existing=True,
        max_instances=1,  # Prevent overlapping executions
    )

    # Start the scheduler
    scheduler.start()
    logger.info("Background scheduler started successfully")
    logger.info(
        f"Rolling average task will run every {settings.rolling_average_interval_minutes} minute(s) "
        f"with a {settings.rolling_average_window_hours}-hour window"
    )
    logger.info("Scheduled jobs:")
    for job in scheduler.get_jobs():
        logger.info(f"  - {job.name} (ID: {job.id}, Trigger: {job.trigger})")


def stop_scheduler():
    """Stop the background scheduler gracefully."""
    global scheduler

    if scheduler is None:
        logger.warning("Scheduler not running")
        return

    logger.info("Stopping background scheduler")
    scheduler.shutdown(wait=True)
    scheduler = None
    logger.info("Background scheduler stopped")


def get_scheduler_status() -> dict:
    """Get current scheduler status and job information."""
    global scheduler

    if scheduler is None:
        return {
            "running": False,
            "jobs": [],
        }

    jobs = []
    for job in scheduler.get_jobs():
        next_run = job.next_run_time
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run_time": next_run.isoformat() if next_run else None,
            "trigger": str(job.trigger),
        })

    return {
        "running": True,
        "jobs": jobs,
    }
