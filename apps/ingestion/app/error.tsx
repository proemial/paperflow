"use client";

export default function ErrorPage({ error }: any) {
  return <div style={{ color: 'white' }}>
    Error!
    {error.message}
  </div>;
}
