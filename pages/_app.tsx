import "@/styles/globals.css";
import type { AppProps } from "next/app";
// Import PostHog instrumentation - this ensures PostHog is initialized when the app starts
import "../instrumentation-client";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
