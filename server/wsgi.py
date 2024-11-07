import os

import uvicorn
from dotenv import load_dotenv

load_dotenv()

MODE = os.getenv("MODE")
host = "0.0.0.0"

if MODE == "PROD":
    host = "::"

# entry point to fastAPI application
if __name__ == "__main__":
    uvicorn.run(
        "App.__init__:app",
        host=host,
        port=4000,
        reload=True,
        reload_dirs=["/App", "/home/appuser", "App/"],
        forwarded_allow_ips="*",
    )
