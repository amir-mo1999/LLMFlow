import { PromptForm } from "@/components/Prompt"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  return <PromptForm aiFunctionID={params.aiFunctionID}></PromptForm>
}
