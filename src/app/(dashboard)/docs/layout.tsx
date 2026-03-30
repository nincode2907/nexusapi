import React from "react";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsClientWrapper from "@/components/docs/DocsClientWrapper";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <DocsClientWrapper sidebar={<DocsSidebar />}>
            {children}
        </DocsClientWrapper>
    );
}