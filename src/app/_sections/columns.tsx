"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { type UrlType } from "~/server/db/schema";
import { Checkbox } from "~/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import Link from "next/link";
import { getActualTinyBaseUrl } from "~/trpc/shared";

export const columns: ColumnDef<UrlType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tinyurl",
    header: () => <span className="font-bold text-white">TinyUrl</span>,
    cell: ({ row }) => {
      // eslint-disable-next-line
      const tinyurlhash = row.getValue("tinyurl") + "";
      // eslint-disable-next-line
      const tinyurl = `${getActualTinyBaseUrl()}/${tinyurlhash}`;
      return (
        <Link href={tinyurl} target="_blank">
          {tinyurlhash}
        </Link>
      );
    },
  },
  {
    accessorKey: "forwardedTo",
    header: () => <span className="font-bold text-white">Actual Url</span>,
    cell: ({ row }) => (
      <Link href={row.getValue("forwardedTo")} target="_blank">
        {row.getValue("forwardedTo")}
      </Link>
    ),
  },

  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => {
      const current_timestamp = new Date(row.getValue("startTime"));
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = months[current_timestamp.getMonth()];
      const day = current_timestamp.getDate();
      const year = current_timestamp.getFullYear();
      let hour = current_timestamp.getHours();
      const minute = current_timestamp.getMinutes();
      const am_pm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      const formatted = `${month} ${day}, ${year} at ${hour}:${minute.toString().padStart(2, "0")} ${am_pm}`;

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expire Time" />
    ),
    cell: ({ row }) => {
      const current_timestamp = new Date(row.getValue("endTime"));
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = months[current_timestamp.getMonth()];
      const day = current_timestamp.getDate();
      const year = current_timestamp.getFullYear();
      let hour = current_timestamp.getHours();
      const minute = current_timestamp.getMinutes();
      const am_pm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      const formatted = `${month} ${day}, ${year} at ${hour}:${minute.toString().padStart(2, "0")} ${am_pm}`;

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "isAuthRequired",
    header: () => <span className="font-bold text-white">Authentication</span>,
  },
  {
    accessorKey: "isNotificationRequired",
    header: () => <span className="font-bold text-white">Notification</span>,
  },
];
