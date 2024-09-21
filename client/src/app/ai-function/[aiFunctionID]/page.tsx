import { AIFunctionSingleOverview } from "@/components"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  return <AIFunctionSingleOverview aiFunctionID={params.aiFunctionID}></AIFunctionSingleOverview>
}
