import { ImageResponse } from "next/og";
import { CocktailIcon } from "@/lib/iconArt";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<CocktailIcon size={32} />, size);
}
