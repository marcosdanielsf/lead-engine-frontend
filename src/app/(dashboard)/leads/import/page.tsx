"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/layout/header";
import { useImportLeads } from "@/lib/hooks/use-leads";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileText,
  Webhook,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Lead } from "@/lib/types";
import { format } from "date-fns";

const SAMPLE_CSV = `ig_handle,email,phone,name,notes
@coach1,coach@example.com,+123****7890,John Coach,found via ad
@fitness_pro,,+0987654321,Maria Fitness,manual import`;

const RECENT_IMPORTS = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    method: "csv" as const,
    lead_count: 127,
    status: "success" as const,
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    method: "webhook" as const,
    lead_count: 45,
    status: "partial" as const,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    method: "api" as const,
    lead_count: 300,
    status: "success" as const,
  },
];

function importStatusStyle(status: string): React.CSSProperties {
  if (status === "success")
    return { background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" };
  if (status === "partial")
    return { background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" };
  return { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" };
}

export default function ImportPage() {
  const [csvText, setCsvText] = useState("");
  const [parsedLeads, setParsedLeads] = useState<Partial<Lead>[]>([]);
  const [parseError, setParseError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importLeads = useImportLeads();

  const parseCsv = (text: string): Partial<Lead>[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const vals = line.split(",").map((v) => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        if (vals[i]) obj[h] = vals[i].replace(/^@/, "");
      });
      return {
        ig_handle: obj.ig_handle,
        email: obj.email,
        phone: obj.phone,
        name: obj.name,
        source: "manual" as const,
      };
    });
  };

  const handleCsvChange = (text: string) => {
    setCsvText(text);
    setParseError("");
    try {
      const leads = parseCsv(text);
      if (leads.length > 5000) {
        setParseError("Max 5,000 leads per upload");
        return;
      }
      setParsedLeads(leads);
    } catch {
      setParseError("Invalid CSV format");
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a .csv file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      handleCsvChange(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleImport = async () => {
    if (!parsedLeads.length) {
      toast.error("No leads to import");
      return;
    }
    try {
      const result = await importLeads.mutateAsync(parsedLeads);
      toast.success(`Successfully imported ${result.imported || parsedLeads.length} leads`);
      setCsvText("");
      setParsedLeads([]);
    } catch {
      toast.error("Import failed. Check API connection.");
    }
  };

 const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <div className="flex flex-col h-full">
      <Header title="Import Leads" subtitle="Bulk import from CSV, Webhook, or API" />

      <div className="flex-1 p-6 space-y-6">
        <Tabs defaultValue="csv">
          <TabsList>
            <TabsTrigger value="csv" className="gap-2">
              <FileText className="h-4 w-4" /> CSV Upload
            </TabsTrigger>
            <TabsTrigger value="webhook" className="gap-2">
              <Webhook className="h-4 w-4" /> Webhook API
            </TabsTrigger>
          </TabsList>

          {/* CSV Tab */}
          <TabsContent value="csv" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV File</CardTitle>
                <CardDescription>
                  Expected format: ig_handle, email, phone, name, notes. Max 5,000 leads.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drop Zone */}
                <div
                  className="rounded-xl p-8 text-center cursor-pointer transition-colors"
                  style={{
                    border: isDragging
                      ? "2px dashed #5e6ad2"
                      : "2px dashed rgba(255,255,255,0.12)",
                    background: isDragging
                      ? "rgba(94,106,210,0.08)"
                      : "rgba(255,255,255,0.02)",
                  }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload
                    className="h-10 w-10 mx-auto mb-3"
                    style={{ color: "#62666d" }}
                  />
                  <p className="text-sm font-medium" style={{ color: "#d0d6e0" }}>
                    Drag & drop CSV here, or click to browse
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#62666d" }}>
                    .csv files only, up to 5,000 leads
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </div>

                {/* Or paste CSV */}
                <div className="space-y-2">
                  <Label>Or paste CSV content</Label>
                  <Textarea
                    placeholder={SAMPLE_CSV}
                    value={csvText}
                    onChange={(e) => handleCsvChange(e.target.value)}
                    className="font-mono text-xs h-32"
                  />
                </div>

                {parseError && (
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#f87171" }}
                  >
                    <AlertCircle className="h-4 w-4" />
                    {parseError}
                  </div>
                )}

                {/* Download template */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-xs"
                  style={{ color: "#8a8f98" }}
                  onClick={() => {
                    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "lead-import-template.csv";
                    a.click();
                  }}
                >
                  <Download className="h-3 w-3" /> Download Template
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            {parsedLeads.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Preview ({parsedLeads.length} leads)
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 h-7"
                        onClick={() => { setCsvText(""); setParsedLeads([]); }}
                      >
                        <X className="h-3 w-3" /> Clear
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1 h-7"
                        onClick={handleImport}
                        disabled={importLeads.isPending}
                      >
                        {importLeads.isPending ? (
                          "Importing..."
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Import {parsedLeads.length} Leads
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-64 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Handle</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedLeads.slice(0, 20).map((lead, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs font-mono">
                              {lead.ig_handle ? `@${lead.ig_handle}` : "—"}
                            </TableCell>
                            <TableCell className="text-xs">{lead.name || "—"}</TableCell>
                            <TableCell className="text-xs">{lead.email || "—"}</TableCell>
                            <TableCell className="text-xs">{lead.phone || "—"}</TableCell>
                          </TableRow>
                        ))}
                        {parsedLeads.length > 20 && (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center text-xs py-2"
                              style={{ color: "#62666d" }}
                            >
                              +{parsedLeads.length - 20} more leads
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Webhook Tab */}
          <TabsContent value="webhook" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhook API Endpoint</CardTitle>
                <CardDescription>
                  Use this endpoint to push leads from Zapier, n8n, or any automation tool.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Endpoint</Label>
                  <div className="flex items-center gap-2">
                    <code
                      className="flex-1 px-4 py-3 rounded-lg text-sm font-mono"
                      style={{
                        background: "#0d0e0f",
                        color: "#34d399",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      POST {apiBase}/api/leads/import
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${apiBase}/api/leads/import`);
                        toast.success("Copied!");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Example Request</Label>
                  <pre
                    className="px-4 py-4 rounded-lg text-xs font-mono overflow-auto"
                    style={{
                      background: "#0d0e0f",
                      color: "#34d399",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
{`curl -X POST ${apiBase}/api/leads/import \\
  -H "Authorization: Bearer *** \\
  -H "Content-Type: application/json" \\
  -d '{
  "leads": [
    {
      "ig_handle": "@coach1",
      "email": "coach@example.com",
      "source": "manual"
    }
  ]
}'`}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p className="text-xs font-medium mb-2" style={{ color: "#d0d6e0" }}>
                      Zapier Integration
                    </p>
                    <p className="text-xs" style={{ color: "#8a8f98" }}>
                      Use Webhooks by Zapier → POST action to push leads from forms, CRMs, or landing pages.
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p className="text-xs font-medium mb-2" style={{ color: "#d0d6e0" }}>
                      n8n Integration
                    </p>
                    <p className="text-xs" style={{ color: "#8a8f98" }}>
                      Use HTTP Request node in n8n to forward leads from any trigger to this endpoint.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Imports */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Recent Imports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_IMPORTS.map((imp) => (
                  <TableRow key={imp.id}>
                    <TableCell className="text-xs">
                      {format(new Date(imp.timestamp), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex h-5 items-center px-2 rounded-full text-xs font-medium capitalize"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "#d0d6e0",
                          border: "1px solid rgba(255,255,255,0.10)",
                        }}
                      >
                        {imp.method}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {imp.lead_count}
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex h-5 items-center px-2 rounded-full text-xs font-medium capitalize"
                        style={importStatusStyle(imp.status)}
                      >
                        {imp.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
