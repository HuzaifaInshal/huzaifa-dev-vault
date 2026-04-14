export interface NavNode {
  title: string;
  description?: string;
  route: string; // always absolute, e.g. /ai/prompts
  returnPage?: (args: CommonPageProps) => React.ReactNode;
  subroutes?: NavNode[];
}

export interface CommonPageProps {
  title: string;
  description?: string;
}
