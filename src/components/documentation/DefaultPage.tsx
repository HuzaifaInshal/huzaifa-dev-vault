import { CommonPageProps } from "@/features/navigation/navigationType";
import DocumentationWrapper from "./DocumentationWrapper";

const DefaultPage = ({ description, title }: CommonPageProps) => {
  // This is the default page it will feature all the child components/subroutes and their links to be displayed
  return (
    <DocumentationWrapper description={description} title={title}>
      <div className="flex-1">Custom created here</div>
    </DocumentationWrapper>
  );
};

export default DefaultPage;
