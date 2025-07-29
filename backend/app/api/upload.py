from fastapi import APIRouter, UploadFile, File
from app.utils.s3_upload import upload_image_to_s3

router = APIRouter(prefix="/api", tags=["Upload"])

@router.post("/upload-image/")
def upload_image(file: UploadFile = File(...)):
    url = upload_image_to_s3(file)
    return {"url": url} 