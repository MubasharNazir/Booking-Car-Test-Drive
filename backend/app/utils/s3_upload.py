import os
import boto3
from PIL import Image
from io import BytesIO
from fastapi import UploadFile, HTTPException
from uuid import uuid4

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}


def validate_image(file: UploadFile):
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only jpg, jpeg, png images are allowed.")
    return ext


def compress_image(file: UploadFile, ext: str) -> BytesIO:
    image = Image.open(file.file)
    img_bytes = BytesIO()
    # Compress: JPEG quality 85, PNG optimize
    if ext in ["jpg", "jpeg"]:
        image.save(img_bytes, format="JPEG", quality=85, optimize=True)
    else:
        image.save(img_bytes, format="PNG", optimize=True)
    img_bytes.seek(0)
    return img_bytes


def upload_image_to_s3(file: UploadFile) -> str:
    ext = validate_image(file)
    img_bytes = compress_image(file, ext)
    key = f"images/{uuid4()}.{ext}"
    s3_client.upload_fileobj(
        img_bytes,
        AWS_S3_BUCKET,
        key,
        ExtraArgs={"ACL": "public-read", "ContentType": file.content_type},
    )
    url = f"https://{AWS_S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{key}"
    return url 