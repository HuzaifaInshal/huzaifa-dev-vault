import { NavNode } from "./navigationType";

export const navConfig: NavNode[] = [
  {
    title: "AI Tools Assistants and Prompts",
    route: "/ai-tools-assistants&prompts",
    subroutes: [
      {
        title: "Frontend",
        route: "/frontend", // should become /ai-tools-assistants&prompts/frontend
        subroutes: [
          {
            title: "Creating UI with ss or figma json",
            route: "creating-ui-with-ss"
          }
        ]
      }
    ]
  }
];
