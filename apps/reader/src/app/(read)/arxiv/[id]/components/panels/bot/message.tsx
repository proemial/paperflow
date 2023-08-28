"use client";
import { User } from "data/storage/users.models";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "src/components/shadcn-ui/Avatar";

export type Role = "function" | "system" | "user" | "assistant";

function applyExplainLinks(
  msg: string,
  onClick: (concept: string) => void
): React.ReactNode {
  const re = /\(\(.*?\)\)/gi;

  const asLink = (input: string) => {
    const sanitized = input.replace("((", "").replace("))", "");

    return (
      <span
        className="underline cursor-pointer text-primary font-medium"
        onClick={() => onClick(sanitized)}
      >
        {sanitized}
      </span>
    );
  };

  const arr = msg.replace(re, "~~$&~~").split("~~");
  return arr.map((s, i) => (
    <span key={i}>
      {s.match(re) ? <span>{s.match(re) ? asLink(s) : s}</span> : s}
    </span>
  ));
}

const style = "mb-4 rounded-b-2xl py-2 px-4 shadow bg-gradient-to-r";

export function Answer({ user, children }: { user?: User; children: string }) {
  return (
    <>
      <UserAvatar user={user} />
      <div className={`clamp2 ${style} bg-[#60A040] rounded-tr-2xl self-start`}>
        <Text>{children}</Text>
      </div>
    </>
  );
}

type QuestionProps = {
  user?: User;
  children: string;
  className?: string;
};

export function Question({ user, children, className }: QuestionProps) {
  return (
    <>
      <UserAvatar user={user} />
      <div
        className={`${className} ${style} from-primary to-primary-gradient rounded-tr-2xl self-start`}
      >
        {children}
      </div>
    </>
  );
}

const BotAvatar = {
  info: {
    name: "PaperFlowBot",
    nickname: "paperflowbot",
    picture: "/bot-avatar.svg",
  },
};

function Text({ children }: { children: string }) {
  return <>{applyExplainLinks(children, () => {})}</>;
}

function UserAvatar({ user }: { user?: User }) {
  const userInfo = user?.info ? user.info : BotAvatar.info;

  const { name, nickname, picture } = userInfo;
  const initials = name.split(" ").map((n) => n.charAt(0));

  return (
    <div className="flex my-1 gap-1" style={{ fontSize: 14 }}>
      <Avatar className="inline-flex h-[24px] w-auto mr-1">
        <AvatarImage src={picture} alt="avatar" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {name} <span className="text-muted">{` @${nickname}`}</span>
    </div>
  );
}
