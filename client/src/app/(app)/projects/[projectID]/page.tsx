"use client"
import { ProjectSingleOverview } from "@/components"
import { useContext } from "react"
import { ProjectContext } from "@/contexts"
import { useGetProjectApiDocs } from "@/api/apiComponents"
import { useRouter } from "next/navigation"

export default function Page({ params }: { params: { projectID: string } }) {
  const router = useRouter()

  const { projects, onDeleteProject, aiFunctions, onClickEdit, setSelectedProjectIndx } =
    useContext(ProjectContext)
  const { data: apiDocs, isFetching: isFetchingApiDocs } = useGetProjectApiDocs({
    pathParams: { projectId: params.projectID },
  })

  const project = projects.find((project) => project._id === params.projectID)

  if (project === undefined) return <></>
  setSelectedProjectIndx(projects.findIndex((project) => project._id === params.projectID))

  const onClickViewDocs = () => {
    router.push(`/projects/${params.projectID}/docs`)
  }

  return (
    <ProjectSingleOverview
      onDeleteProject={onDeleteProject}
      project={project}
      apiDocs={apiDocs}
      isFetchingApiDocs={isFetchingApiDocs}
      aiFunctions={aiFunctions}
      onClickEdit={onClickEdit}
      onClickViewDocs={onClickViewDocs}
    ></ProjectSingleOverview>
  )
}
