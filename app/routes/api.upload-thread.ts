import { ActionFunctionArgs, redirect } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const content = formData.get("content") as string;
  const images = JSON.parse(formData.get("images") as string) as string[];
  console.log("content", content);
  console.log("images", images);
  console.log(request.headers.get("Referer"));

  return redirect(request.headers.get("Referer") || "/app");
};

export const loader = async () => {
  return null;
};
