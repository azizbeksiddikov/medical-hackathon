import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// CRITICAL FIX: Intercept fetch calls to prevent mixed content errors
// This ensures that even if old cached code tries to use HTTP URLs on HTTPS pages,
// we'll automatically rewrite them to relative URLs
if (typeof window !== "undefined" && window.location.protocol === "https:") {
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let url: string;
    
    if (typeof input === "string") {
      url = input;
    } else if (input instanceof Request) {
      url = input.url;
    } else {
      url = input.toString();
    }
    
    // If we're on HTTPS and the URL is HTTP, rewrite it to relative
    if (url.startsWith("http://152.42.238.178") || (url.startsWith("http://") && !url.includes("localhost"))) {
      console.error("🚨 BLOCKED HTTP URL in fetch:", url);
      // Extract the path and make it relative
      try {
        const urlObj = new URL(url);
        url = urlObj.pathname + urlObj.search;
        console.log("✅ Rewritten to relative URL:", url);
      } catch (e) {
        console.error("Failed to parse URL:", url);
      }
    }
    
    // Create new request with rewritten URL
    if (typeof input === "string") {
      return originalFetch.call(this, url, init);
    } else if (input instanceof Request) {
      return originalFetch.call(this, new Request(url, input), init);
    } else {
      return originalFetch.call(this, url, init);
    }
  };
  
  console.log("🔒 Fetch interceptor installed to prevent mixed content errors");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
