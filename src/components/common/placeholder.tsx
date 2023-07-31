import { CustomIcon } from "../ui/custom-icon";
import { SEO } from "./seo";

export function Placeholder(): JSX.Element {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <SEO
        title="4Real"
        description="Browser all the content on the Crossbell network."
        image="/home.png"
      />
      <i>
        <CustomIcon className="w-20 h-20" iconName="ForRealIcon" />
      </i>
    </main>
  );
}
