"""Data processing endpoints."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..processors import PROCESSORS
from ..schemas.processing import (
    ProcessedDataResponse,
    ProcessingJobRequest,
    ProcessingJobResponse,
    ProcessorInfo,
)
from ..services.data_processing import process_sensor_data, query_processed_data
from ..services.scheduler import get_scheduler_status

router = APIRouter(prefix="/api/v1/processing", tags=["processing"])


@router.post("/run", response_model=ProcessingJobResponse, status_code=status.HTTP_201_CREATED)
async def run_processing_job(
    job: ProcessingJobRequest,
    db: AsyncSession = Depends(get_db),
) -> ProcessingJobResponse:
    """
    Run a data processing job.

    Processes raw sensor data using the specified algorithm and time range.
    """
    try:
        result = await process_sensor_data(
            db,
            processor_name=job.processor,
            start_time=job.start_time,
            end_time=job.end_time,
            sensor_type=job.sensor_type,
            device_id=job.device_id,
        )

        return ProcessingJobResponse(
            job_id=result.id,
            status="completed",
            result=result.result,
            raw_count=result.raw_count,
            created_at=result.created_at,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing failed: {str(e)}",
        ) from e


@router.get("/processors", response_model=dict[str, list[ProcessorInfo]])
async def list_processors() -> dict[str, list[ProcessorInfo]]:
    """
    List all available data processors.

    Returns information about each processor including name, version, and description.
    """
    processors = [
        ProcessorInfo(
            name=proc.name,
            version=proc.version,
            description=proc.description,
        )
        for proc in PROCESSORS.values()
    ]

    return {"processors": processors}


@router.get("/results", response_model=dict[str, int | list[ProcessedDataResponse]])
async def get_processed_results(
    processor: str | None = Query(None, description="Filter by processor name"),
    sensor_type: str | None = Query(None, description="Filter by sensor type"),
    start: datetime | None = Query(None, description="Start of time range"),
    end: datetime | None = Query(None, description="End of time range"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of results"),
    db: AsyncSession = Depends(get_db),
) -> dict[str, int | list[ProcessedDataResponse]]:
    """
    Query processed data results with optional filters.

    Returns paginated processed data matching the specified criteria.
    """
    results = await query_processed_data(
        db,
        processor_name=processor,
        sensor_type=sensor_type,
        start_time=start,
        end_time=end,
        limit=limit,
    )

    return {
        "count": len(results),
        "data": [ProcessedDataResponse.model_validate(r) for r in results],
    }


@router.get("/scheduler/status")
async def get_scheduler_info() -> dict:
    """
    Get the current scheduler status.

    Returns information about running background jobs and their schedules.
    """
    return get_scheduler_status()
