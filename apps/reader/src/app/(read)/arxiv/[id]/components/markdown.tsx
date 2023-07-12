"use client";
import ReactMarkdown from "react-markdown";
import MathJax from "react-mathjax";
import RemarkMathPlugin from "remark-math";

export default function Markdown({ children }: { children: string }) {
  const newProps = {
    children,
    plugins: [RemarkMathPlugin],
    renderers: {
      math: (props) => <MathJax.Node formula={props.value} />,
      inlineMath: (props) => <MathJax.Node inline formula={props.value} />,
    },
  };
  return (
    <MathJax.Provider input="tex">
      {/* @ts-ignore */}
      <ReactMarkdown plugins={newProps.plugins} renderers={newProps.renderers}>
        {newProps.children}
      </ReactMarkdown>
    </MathJax.Provider>
  );
}
