import { ImageResponse } from "next/og";
import { CocktailIcon } from "@/lib/iconArt";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(<CocktailIcon size={192} />, { width: 192, height: 192 });
}
