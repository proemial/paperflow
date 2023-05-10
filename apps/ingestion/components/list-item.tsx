import dayjs from "dayjs";

export default function ListItem({ children }: { children: JSX.Element }) {
  return (
    <li>{children}</li>
  );
}