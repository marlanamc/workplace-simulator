import { BrowserShell, defaultWorkspaceHost } from "@/exportable-workspace";

export default function ExportableWorkspacePreviewPage() {
  return (
    <main className="min-h-screen bg-[#f1f3f4] p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[#202124]">Exportable Workspace Preview</h1>
          <p className="mt-1 text-[14px] text-[#5f6368]">
            Standalone browser, mail, drive, calendar, portal, and PDF reader components.
          </p>
        </div>
        <BrowserShell host={defaultWorkspaceHost} />
      </div>
    </main>
  );
}
