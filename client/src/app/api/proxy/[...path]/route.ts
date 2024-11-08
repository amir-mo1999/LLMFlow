// app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

type HandlerFunction = (_: NextRequest, __: { path: string[] }) => Promise<NextResponse>

/**
 * Common handler to process all HTTP methods.
 */
const handleRequest: HandlerFunction = async (request, { path }) => {
  // Retrieve the token using next-auth's getToken
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  })

  // parse url
  const query = new URL(request.url).search

  // If no token is found, return a 401 Unauthorized response
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Extract the JWT token (adjust based on your token structure)
  const jwtToken = token.accessToken

  // Construct the backend URL
  const backendPath = path.join("/")
  const backendUrl = `${process.env.BACKEND_URL}/${backendPath}${query}`


const headers = new Headers()
headers.append("api_key", request.headers.get("api_key") || "")
headers.append("Content-type", "application/json")
headers.append("authorization", `Bearer ${jwtToken}`)

  // Prepare the fetch options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  }

  const contentType = request.headers.get("Content-Type") || ""
  const isJson = contentType.includes("application/json")

  const contentLength = request.headers.get("Content-Length")
  const hasBody = contentLength && parseInt(contentLength) > 0

  // If the method is not GET or HEAD, include the request body
  if (isJson && hasBody) {
    try {
      const requestBody = await request.json()
      fetchOptions.body = JSON.stringify(requestBody)
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }
  }
  try {
    // Forward the request to the backend
    const backendResponse = await fetch(backendUrl, fetchOptions)
    // Clone the backend response to read its body
    const responseBody = await backendResponse.json()
    // Create a new NextResponse with the backend's status and body
    return NextResponse.json(responseBody, { status: backendResponse.status })
  } catch (error) {
    console.error("Error forwarding request:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

/**
 * Exported handlers for different HTTP methods.
 * You can add more methods (e.g., PUT, DELETE) as needed.
 */
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params)
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params)
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params)
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params)
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params)
}

// Optionally, handle other HTTP methods as needed
