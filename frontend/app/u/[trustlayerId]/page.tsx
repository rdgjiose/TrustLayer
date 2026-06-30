import { ReputationProfileClient } from "./profile-client";

export function generateStaticParams() {
  return [
    {
      trustlayerId: "tl-9f32a"
    }
  ];
}

export default async function ReputationProfilePage({
  params
}: {
  params: Promise<{ trustlayerId: string }>;
}) {
  const { trustlayerId } = await params;

  return <ReputationProfileClient trustlayerId={trustlayerId} />;
}
