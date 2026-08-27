import { ImageResponse } from "next/og";
import { CocktailIcon } from "@/lib/iconArt";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(<CocktailIcon size={512} />, { width: 512, height: 512 });
}
