"use client"
import {
  AIFunctionOverview,
  MainContentContainer,
  SideBarContainer,
  PageContainer,
  SearchField,
} from "@/components"
import Button from "@mui/material/Button"
import { useRouter } from "next/navigation"
import { useGetAiFunctions } from "@/api/apiComponents"
import { useState } from "react"

export default function Home() {
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()

  const { data: aiFunctions, isFetching } = useGetAiFunctions({})

  return (
    <PageContainer>
      <SideBarContainer>
        <SearchField
          value={searchValue}
          setValue={setSearchValue}
          placeholder="AI Function Name"
        ></SearchField>
        <Button
          sx={{ marginTop: 2 }}
          variant="contained"
          onClick={() => {
            router.push("/create/ai-function")
          }}
        >
          Create AI Function
        </Button>
        <AIFunctionOverview
          aiFunctions={isFetching || !aiFunctions ? [] : aiFunctions}
        ></AIFunctionOverview>
      </SideBarContainer>
      <MainContentContainer></MainContentContainer>
    </PageContainer>
  )
}
