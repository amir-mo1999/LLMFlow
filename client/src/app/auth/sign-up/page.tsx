"use client"

import React, { useState } from "react"
import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material"
import { usePostUser } from "@/api/apiComponents"

export default function Page() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMsg, setEmailErrorMsg] = useState("")
  const [password, setPassword] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)

  const { mutate: postUser, isPending } = usePostUser({
    onSuccess: () => {
      setSuccess(true)
      setName("")
      setEmail("")
      setPassword("")
    },
    onError: (err) => {
      //@ts-expect-error: Fetcher does not parse error correctly
      if (err.stack.status === 409) {
        setEmailError(true)
        setEmailErrorMsg("User with this email already exists")
      }
      setEmailError(true)
      setEmailErrorMsg("Please enter a valid email")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setEmailError(false)
    postUser({ body: { name: name, email: email, password: password } })
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 400,
          padding: 4,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Create Account
        </Typography>

        {success && (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Signup successful! You can now sign in.
            </Alert>
            <Button variant="contained" href="/auth/sign-in">
              Sign in
            </Button>
          </>
        )}

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          error={emailError}
          helperText={emailError && emailErrorMsg}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setEmailError(false)
          }}
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isPending}
          sx={{ mt: 2 }}
        >
          {isPending ? "Submitting..." : "Sign Up"}
        </Button>

        <Typography sx={{ mt: 2 }} align="center">
          Already have an account? <Link href="/auth/sign-in">Sign In</Link>
        </Typography>
      </Box>
    </Box>
  )
}
