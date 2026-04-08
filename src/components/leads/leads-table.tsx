"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Lead } from "@/lib/types";
import { ScoreBadge } from "./score-badge";
import { StageBadge } from "./stage-badge";
import { SourceBadge } from "./source-badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const col = createColumnHelper<Lead>();

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  onAction?: (action: string, lead: Lead) => void;
}

export function LeadsTable({
  leads,
  loading,
  onSelectionChange,
  onAction,
}: LeadsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const columns = useMemo(
    () => [
      col.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
        size: 40,
      }),
      col.accessor((r) => r.name || r.ig_handle || r.username || "—", {
        id: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting()}
            className="-ml-2 text-xs font-medium"
          >
            Name <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => {
          const lead = row.original;
          const display = lead.name || lead.ig_handle || lead.username || "—";
          const handle = lead.ig_handle || lead.username;
          return (
            <Link
              href={`/leads/${lead.id}`}
              className="flex items-center gap-2 hover:underline"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {display[0]?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{display}</p>
                {handle && handle !== display && (
                  <p className="text-xs text-gray-500 truncate">@{handle}</p>
                )}
              </div>
            </Link>
          );
        },
      }),
      col.accessor("source", {
        header: "Source",
        cell: ({ getValue }) => <SourceBadge source={getValue()} />,
      }),
      col.accessor("score", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting()}
            className="-ml-2 text-xs font-medium"
          >
            Score <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ getValue }) => <ScoreBadge score={getValue()} />,
      }),
      col.accessor((r) => r.stage || r.funnel_stage, {
        id: "stage",
        header: "Stage",
        cell: ({ getValue }) => <StageBadge stage={getValue() as string} />,
      }),
      col.accessor("followers", {
        header: "Followers",
        cell: ({ getValue }) => {
          const v = getValue();
          if (!v) return <span className="text-gray-400 text-xs">—</span>;
          return (
            <span className="text-xs font-mono">
              {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
            </span>
          );
        },
      }),
      col.accessor("created_at", {
        header: "Age",
        cell: ({ getValue }) => {
          const v = getValue();
          if (!v) return <span className="text-gray-400 text-xs">—</span>;
          return (
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(v), { addSuffix: true })}
            </span>
          );
        },
      }),
      col.display({
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.location.href = `/leads/${row.original.id}`}>
                <ExternalLink className="mr-2 h-3 w-3" /> View Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction?.("enrich", row.original)}
              >
                Re-enrich
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction?.("exclude", row.original)}
                className="text-red-600"
              >
                Exclude
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 40,
      }),
    ],
    [onAction]
  );

  const table = useReactTable({
    data: leads,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
      const selected = leads
        .filter((_, i) => next[String(i)])
        .map((l) => l.id);
      onSelectionChange?.(selected);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-gray-400 py-16"
              >
                No leads found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  "hover:bg-gray-50 dark:hover:bg-gray-900",
                  row.getIsSelected() && "bg-blue-50 dark:bg-blue-950/20"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
