// import { Fragment } from "@/generated/prisma";
// import { useState } from "react";
// import { ExternalLinkIcon, RefreshCwIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Hint } from "@/components/hint";

// interface FragmentWebProps {
//     data: Fragment;
// };

// export const FragmentWeb = ({data}: FragmentWebProps) => {
//     const [fragmentKey, setFragmentKey] = useState(0);
//     const [copied, setCopied] = useState(false);

//     const onRefresh = () =>{
//         setFragmentKey((prev)=>prev+1);
//     };

//     const handleCopy =()=>{
//         navigator.clipboard.writeText(data.sandboxUrl);
//         setCopied(true);
//         setTimeout(()=>{
//             setCopied(false);
//         },2000);
//     }

//     return(
//         <div className="flex flex-col w-full h-full">
//             <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">

//                 <Hint text="Refresh" side="bottom" align="start">
//                 <Button size="sm" variant="outline" onClick={onRefresh}>
//                     <RefreshCwIcon/>
//                 </Button>
//                 </Hint>
//                 <Hint text="Click to copy" side="bottom">
//                  <Button 
//                    size="sm" 
//                    variant="outline" 
//                    onClick={handleCopy}
//                    disabled={!data.sandboxUrl || copied}
//                    className="flex-1 justify-start text-start font-normal"
//                  >
//                     <span className="truncate">
//                         {data.sandboxUrl}
//                     </span>
//                 </Button>
//                 </Hint>
//                 <Hint text="Open in new tab" side="bottom" align="start">
//                 <Button
//                   size="sm"
//                   disabled={!data.sandboxUrl}
//                   variant="outline"
//                   onClick={()=>{
//                     if(!data.sandboxUrl)return;
//                     window.open(data.sandboxUrl,"_blank");
//                   }}
//                 >
//                     <ExternalLinkIcon/>
//                 </Button>
//                 </Hint>
//             </div>
//             <iframe
//                 key={fragmentKey}
//                 className="w-full h-full"
//                 sandbox="allow-forms allow-scripts allow-same-origin"
//                 loading="lazy"
//                 src={data.sandboxUrl}
//             />
//         </div>
//     )
// };


import { Fragment } from "@/generated/prisma";
import { useEffect, useMemo, useState } from "react";
import { ExternalLinkIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

interface FragmentWebProps {
  data: Fragment;
}

export const FragmentWeb = ({ data }: FragmentWebProps) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loadingState, setLoadingState] = useState<"idle" | "loading" | "loaded" | "failed">("idle");

  // derive useful values
  const rawUrl = data?.sandboxUrl ?? "";
  const pageIsHttps = typeof window !== "undefined" && window.location?.protocol === "https:";
  const isHttpUrl = rawUrl.startsWith("http://");
  const isMixedContent = pageIsHttps && isHttpUrl;

  // suggest a https variant (won't force)
  const httpsVariant = useMemo(() => {
    if (!rawUrl) return "";
    if (rawUrl.startsWith("http://")) return rawUrl.replace(/^http:\/\//i, "https://");
    return rawUrl;
  }, [rawUrl]);

  const srcForIframe = useMemo(() => {
    // prefer https variant if it already was https; otherwise still feed original (we don't auto-force)
    return rawUrl;
  }, [rawUrl]);

  const onRefresh = () => setFragmentKey((p) => p + 1);

  const handleCopy = async () => {
    try {
      if (!rawUrl) return;
      await navigator.clipboard.writeText(rawUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard write failed", err);
      // fallback: select + execCommand (deprecated but optional). For simplicity we just alert:
      alert("Copy failed — try selecting and copying manually.");
    }
  };

  const openInNewTab = (url: string) => {
    if (!url) return;
    // safer open to avoid opener leak
    const w = window.open("", "_blank");
    if (w) {
      try {
        w.opener = null;
      } catch {
        /* ignore - some browsers restrict */
      }
      w.location.href = url;
    } else {
      // popup blocked — fallback to location assignment (user can open in same tab)
      window.location.href = url;
    }
  };

  // iframe load/fallback detection
  useEffect(() => {
    if (!srcForIframe) return;
    setLoadingState("loading");
    // if iframe hasn't fired onload after 6s show 'failed' — helps detect blocked mixed content
    const t = setTimeout(() => {
      if (loadingState !== "loaded") setLoadingState("failed");
    }, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fragmentKey, srcForIframe]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh} aria-label="Refresh preview">
            <RefreshCwIcon />
          </Button>
        </Hint>

        <Hint text="Click to copy" side="bottom">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!rawUrl || copied}
            className="flex-1 justify-start text-start font-normal"
            aria-label="Copy preview URL"
            title={rawUrl}
          >
            <span className="truncate">{rawUrl || "No preview URL"}</span>
          </Button>
        </Hint>

        <Hint text="Open in new tab" side="bottom" align="start">
          <Button
            size="sm"
            disabled={!rawUrl}
            variant="outline"
            onClick={() => openInNewTab(rawUrl)}
            aria-label="Open preview in new tab"
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>

      {/* mixed content warning */}
      {isMixedContent && (
        <div className="p-2 text-sm bg-yellow-50 text-yellow-800 border-b flex items-center gap-3">
          <div className="flex-1">
            This preview URL is insecure (uses <code>http://</code>) and may be blocked when embedded on HTTPS pages.
            Try the secure variant or use a tunnel (ngrok/cloudflared) or deploy with HTTPS.
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                // try opening https variant (user can inspect whether it resolves)
                if (!httpsVariant) return;
                openInNewTab(httpsVariant);
              }}
            >
              Try HTTPS version
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // copy https variant so they can test it quickly
                if (!httpsVariant) return;
                navigator.clipboard?.writeText(httpsVariant).catch(() => {});
                alert("HTTPS variant copied to clipboard. Try opening it directly in a new tab to verify TLS.");
              }}
            >
              Copy HTTPS URL
            </Button>
          </div>
        </div>
      )}

      {/* iframe container */}
      <div className="flex-1 relative">
        {(!rawUrl || loadingState === "failed") && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center">
              {!rawUrl ? (
                <div>No preview URL provided.</div>
              ) : (
                <>
                  <div>Preview failed to load. This may be due to mixed-content blocking or the remote server not allowing frames.</div>
                  <div className="mt-2 text-sm">
                    Try opening the URL in a new tab to inspect console and response headers, or use a secure tunnel (ngrok).
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* the actual iframe */}
        {rawUrl && (
          <iframe
            key={fragmentKey}
            className="w-full h-full"
            sandbox="allow-forms allow-scripts allow-same-origin"
            loading="lazy"
            src={srcForIframe}
            title="Preview"
            onLoad={() => setLoadingState("loaded")}
            // onError is not reliable cross-origin but keep it for completeness
            onError={() => setLoadingState("failed")}
            style={{ border: "none" }}
          />
        )}
      </div>
    </div>
  );
};
