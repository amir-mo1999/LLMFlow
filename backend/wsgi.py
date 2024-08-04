import uvicorn
from dotenv import load_dotenv

load_dotenv()

# entry point to fastAPI application
if __name__ == "__main__":
    uvicorn.run(
        "App.__init__:app",
        host="0.0.0.0",
        port=4000,
        reload=True,
        reload_dirs=["/App", "/home/appuser", "App/"],
        forwarded_allow_ips="*",
    )
