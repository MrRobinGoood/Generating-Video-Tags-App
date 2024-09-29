from fastapi import FastAPI, UploadFile, File, Body,Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/upload_file")
def submit(
    description: str = Form(...),
    video_title: str = Form(...),
    file: UploadFile = File(...), 
):
    return