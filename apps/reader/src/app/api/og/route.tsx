import {ImageResponse} from "next/og";
import bg from '../../../images/asset-bg-2.png';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const { searchParams } = new URL(url)
        const text = searchParams.has('text') ?
            searchParams.get('text') :
            'placeholder'

        const fontData = await fetch(
            new URL('../../../assets/AnekMalayalam-SemiBold.ttf', import.meta.url),
        ).then((res) => res.arrayBuffer());

        return new ImageResponse(
            (
                <div tw="flex flex-col w-full h-full items-center justify-center text-white" style={{
                    backgroundImage: `url("${url.protocol}//${url.host}${bg.src}")`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'none',
                    fontFamily: 'AnekMalayalam',
                }}>
                    <div tw="flex w-full md:items-center p-8 text-left text-2xl"
                        style={{
                            textShadow: 'rgb(255, 102, 255) 0px 0px 4px',
                            // overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        }}>
                        {text}
                    </div>
                </div>),
            {
                width: 400,
                height: 200,
                fonts: [
                    {
                        name: 'AnekMalayalam',
                        data: fontData,
                        style: 'normal',
                    },
                ]
            }
        )
    } catch (e: any) {
        return new Response('Failed to generate image', {status: 500})
    }
}
