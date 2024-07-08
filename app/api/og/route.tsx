import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

const interBold = fetch(
    new URL("../../../assets/fonts/Inter-Bold.ttf", import.meta.url))
    .then((res) => res.arrayBuffer())

export async function GET(req: NextRequest) {
    try {
        const fontBold = await interBold;

        const { searchParams } = req.nextUrl;
        const title = searchParams.get("title")

        if (!title) {
            return new Response("No title provided.", { status: 500 })
        }

        const heading = title.length > 140 ? `${title.substring(0, 140)}...` : title;

        return new ImageResponse(
            <div tw="flex relative flex-col p-12 w-full h-full items-start text-black bg-white">
                <div tw="flex items-center">
                    <svg height="23" width="23" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512">
                        <g>
                            <g>
                                <path className="accent" fill="currentColor" d="M353.178,91.779h-77.512v-6.556c0-25.304,20.586-45.89,45.89-45.89V0c-46.992,0-85.224,38.231-85.224,85.224v6.556
			h-77.512c-58.475,0-106.047,47.573-106.047,106.047c0,13.456,2.532,26.328,7.129,38.178h392.194
			c4.597-11.85,7.129-24.721,7.129-38.178C459.226,139.352,411.654,91.779,353.178,91.779z"/>
                            </g>
                        </g>
                        <g>
                            <g>
                                <path fill="currentColor" d="M78.997,275.338v41.412h0c0,61.516,30.155,114.727,87.206,153.882c41.691,28.614,83.09,39.617,84.833,40.072L256,512
			l4.964-1.295c1.742-0.455,43.141-11.458,84.833-40.072c57.051-39.156,87.206-92.367,87.206-153.882v-41.412H78.997z"/>
                            </g>
                        </g>
                    </svg>
                    <p tw="ml-2 font-bold text-2xl">bolota.eu</p>
                </div>
                <div tw="flex flex-col flex-1 py-10">
                    <div tw="flex text-xl uppercase font-bold tracking-tight font-normal">
                        BLOG POST
                    </div>
                    <div tw="flex text-[80px] font-bold text-[50px]">{heading}</div>
                </div>
                <div tw="flex items-center w-full justify-between">
                    <div tw="flex text-xl">{siteConfig.url}</div>
                    <div tw="flex items-center text-xl">
                        <div tw="flex ml-2">{siteConfig.links.github}</div>
                    </div>
                </div>
            </div>
            , {
                width: 1200,
                height: 630,
                fonts: [{
                    name: "Inter",
                    data: fontBold,
                    style: "normal",
                    weight: 700,
                }
                ],
            });

    } catch (error) {
        return new Response("Failed to generate image", { status: 500 })
    }
}