"use client";
import dayjs from "dayjs";
import assetImg1 from "src/images/asset-bg-1.png";
import assetImg2 from "src/images/asset-bg-2.png";
import assetImg3 from "src/images/asset-bg-3.png";
import { Badge } from "./badge.cc";
import { Bookmark } from "./bookmark";
import { CardLink } from "./card-link";
import { useQuery } from "@tanstack/react-query";
import { PaperResponse } from "src/app/api/papers/[id]/route";
import { Spinner } from "../spinner";

const images = [assetImg1, assetImg2, assetImg3];

export function PaperCard({ id, likes }: { id: string; likes?: string[] }) {
  const { data, isLoading } = useQuery<PaperResponse>(
    ["card", id],
    async () => {
      const res = await fetch(`/api/papers/${id}`);
      return await res.json();
    }
  );

  if (isLoading) {
    return (
      <div
        className="h-[222px] md:h-[194px] flex w-full justify-center items-center bg-gradient-to-r from-primary to-primary-gradient opacity-70 shadow-[inset_0_-48px_48px_rgba(0,0,0,0.9)]"
        style={{
          backgroundImage: `url(${image(id)})`,
          backgroundSize: "cover",
        }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="shadow-[inset_0_-48px_48px_rgba(0,0,0,0.9)]"
      style={{
        backgroundImage: `url(${image(id)})`,
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 pt-8 flex flex-col justify-end text-lg font-medium items-center ">
        <div className="w-full flex justify-evenly">
          <PubDate paper={data.paper} />
          <div className="w-full flex justify-end pb-4">
            <Bookmark
              id={id}
              category={data.paper.category}
              bookmarked={!!data.history?.bookmarked}
            />
          </div>
        </div>
        <div>
          <CardLink id={id} text={data.paper.text} />
        </div>
        <div className="w-full pt-6 pb-1 text-xs tracking-wider flex justify-begin gap-2 overflow-scroll no-scrollbar">
          {data.paper.tags
            .map((t) => {
              const text = t.slice(1);
              const liked = likes?.includes(text);
              return { text, liked };
            })
            .sort((value) => (value.liked ? -1 : 1)) // weird side effects
            .map((tag, index) => {
              return (
                <Badge
                  key={index}
                  id={id}
                  category={data.paper.category}
                  text={tag.text}
                  liked={tag.liked}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

function PubDate({ paper }: { paper: { updated: string; published: string } }) {
  const today = dayjs();
  const publishedAt = dayjs(paper.published);
  const updatedAt = dayjs(paper.updated);

  const diff = today.diff(publishedAt, "days");
  const text =
    diff <= 5 // days
      ? `Published at ${publishedAt.format("MMM DD, YYYY")}`
      : `Updated at ${updatedAt.format("MMM DD, YYYY")}`;

  return (
    <div className="w-full flex items-end text-sm text-primary-light text-shadow-purple">
      {text}
    </div>
  );
}

function image(id: string) {
  const lastNum = Number(id.charAt(id.length - 1));
  if (lastNum < 3) return images[0].src;
  if (lastNum < 6) return images[1].src;
  return images[2].src;
}
