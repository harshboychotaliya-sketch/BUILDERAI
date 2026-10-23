// Pulls the source text out of a saved file, whatever shape it was stored in
function getCode(content) {
  if (typeof content === "string") return content;
  return content?.code || content?.content || "";
}

// Scans source files to detect npm dependencies from import statements
export function detectDependencies(files) {
  const deps = {};
  if (!files) return deps;

  const allCode = Object.values(files).map(getCode).join("\n");
  const filePaths = Object.keys(files);

  const isLocalFileOrFolder = (pkgName) => {
    const name = pkgName.startsWith("@/") ? pkgName.substring(2) : pkgName;
    return (
      pkgName.startsWith("@/") ||
      pkgName === "@" ||
      filePaths.some(
        (p) =>
          p === `/${name}` ||
          p.startsWith(`/${name}/`) ||
          p.replace(/\.[^/.]+$/, "") === `/${name}`
      )
    );
  };

  const importRegex = /from\s+['"]([^./][^'"]*)['"]/g;
  let match;
  while ((match = importRegex.exec(allCode)) !== null) {
    const rawImport = match[1];

    const pkg =
      rawImport.startsWith("@") && !rawImport.startsWith("@/")
        ? rawImport.split("/").slice(0, 2).join("/")
        : rawImport.split("/")[0];

    if (pkg !== "react" && pkg !== "react-dom" && !isLocalFileOrFolder(pkg)) {
      deps[pkg] = "latest";
    }
  }
  return deps;
}

// Returns a simple loading-state placeholder file set, used when a project
// has no live files yet (e.g. still generating). Plain JS template strings —
// no JSX — so this file stays valid as a .js module.
export function getLoadingPlaceholderFiles() {
  return {
    "/App.jsx": {
      code: `export default function App() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
      <p style={{ color: "#71717a", fontSize: 13 }}>Generating your project…</p>
    </div>
  )
}`,
    },
  };
}

// Turns saved project files into files Sandpack can run:
// - drops /backend/* (Sandpack can't run a server)
// - moves /frontend/* to the root, where Sandpack expects it
// - adds an /index.js entry that mounts the App
// - falls back to the loading placeholder if there is no App yet
// Returns the preview files, plus a map from preview path to saved path.
export function toPreviewFiles(files = {}) {
  const preview = {};
  const pathMap = {};

  for (const [path, content] of Object.entries(files || {})) {
    if (path.startsWith("/backend/")) continue;
    const previewPath = path.startsWith("/frontend/")
      ? path.slice("/frontend".length)
      : path;
    preview[previewPath] = getCode(content);
    pathMap[previewPath] = path;
  }

  let appFile = ["/App.jsx", "/App.js"].find((p) => preview[p] !== undefined);

  if (!appFile) {
    appFile = "/App.jsx";
    preview[appFile] = getLoadingPlaceholderFiles()["/App.jsx"].code;
  }

  preview["/index.js"] = `import React from "react";
import { createRoot } from "react-dom/client";
import App from ".${appFile}";

createRoot(document.getElementById("root")).render(<App />);
`;

  return { preview, pathMap };
}