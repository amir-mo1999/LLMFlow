cd server
python3 generate_api_docs.py

cd ..
cd client
npx openapi-codegen gen api
