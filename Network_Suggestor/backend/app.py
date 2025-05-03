from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.main import get_profile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recommendations/")
def get_recommendations(job_title: str = Query(...)):
    result = get_profile(job_title)
    return{"results": result}