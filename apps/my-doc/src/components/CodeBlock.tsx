"use client";

import { useState } from "react";

type CodeBlockProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export function CodeBlock({ children, className, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, "");

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const language = className?.replace("language-", "") || "";

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      {title && (
        <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
          <span className="text-sm text-gray-700 font-medium">{title}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 z-10 p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
          title="Copy code"
          aria-label="Copy code"
        >
          {copied ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
        {language && (
          <div className="absolute top-3 left-4 text-xs text-gray-500 uppercase font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {language}
          </div>
        )}
        <pre className={`${className || ""} overflow-x-auto p-4 text-sm bg-gray-50`}>
          <code className={className}>{children}</code>
        </pre>
      </div>
    </div>
  );
}
