"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { type UrlType } from "~/server/db/schema";

export const columns: ColumnDef<UrlType>[] = [
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "tinyurl",
    header: "TinyUrl",
  },
  {
    accessorKey: "endTime",
    header: "Expire Time",
  },
  {
    accessorKey: "isAuthRequired",
    header: "Authentication",
  },
  {
    accessorKey: "isNotificationRequired",
    header: "Notification",
  },
  {
    accessorKey: "forwardedTo",
    header: "Actual Url",
  },
];
