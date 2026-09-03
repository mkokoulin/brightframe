import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "../Tag/Tag";
import { Table, type TableColumn, type TableSort } from "./Table";
import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";
import { TableHeaderCell } from "./TableHeaderCell";
import { TableFooter } from "./TableFooter";

const meta: Meta<typeof Table> = {
  title: "Molecules/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `\`\`\`tsx
import { Table, type TableColumn } from "brightframe/Table";

const columns: TableColumn<Booking>[] = [
  { id: "guest", header: "Guest", cell: (row) => row.guest, sortable: true },
  { id: "guests", header: "Guests", cell: (row) => row.guests, align: "end" },
];

<Table columns={columns} data={bookings} getRowId={(row) => row.id} />
\`\`\`

Sorting, row selection, filters, column highlight, row/column reordering, and pagination are all
controlled — pass the matching \`x\`/\`onXChange\` pair to opt in (same pattern as \`Pagination\`'s
controlled \`page\`). Omit a pair to leave that behaviour out entirely; column highlight and filters
fall back to sensible uncontrolled defaults (hover-driven highlight, self-managed filter text) if
you only need the visuals and don't care about the state yourself.

\`TableRow\`/\`TableCell\`/\`TableHeaderCell\`/\`TableFooter\` are also exported individually
(\`brightframe/Table\`) for hand-rolled table markup — see the "Composed from primitives" story.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

type Booking = {
  id: string;
  guest: string;
  plan: "Day pass" | "Monthly" | "Meeting room";
  guests: number;
  status: "confirmed" | "pending";
};

const BOOKINGS: Booking[] = [
  { id: "1", guest: "Ani Sargsyan", plan: "Monthly", guests: 1, status: "confirmed" },
  { id: "2", guest: "David Grigoryan", plan: "Meeting room", guests: 6, status: "confirmed" },
  { id: "3", guest: "Lilit Harutyunyan", plan: "Day pass", guests: 2, status: "pending" },
  { id: "4", guest: "Narek Avetisyan", plan: "Day pass", guests: 1, status: "confirmed" },
  { id: "5", guest: "Siranush Petrosyan", plan: "Monthly", guests: 3, status: "pending" },
];

function statusVariant(status: Booking["status"]): "green" | "orange" {
  return status === "confirmed" ? "green" : "orange";
}

function PlaygroundExample() {
  const [sort, setSort] = useState<TableSort | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const sorted = [...BOOKINGS].sort((a, b) => {
    if (!sort) return 0;
    const dir = sort.direction === "asc" ? 1 : -1;
    return a.guest.localeCompare(b.guest) * dir;
  });

  const columns: TableColumn<Booking>[] = [
    { id: "guest", header: "Guest", cell: (row) => row.guest, sortable: true },
    { id: "plan", header: "Plan", cell: (row) => row.plan },
    { id: "guests", header: "Guests", cell: (row) => row.guests, align: "end" },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Tag variant={statusVariant(row.status)}>{row.status === "confirmed" ? "Confirmed" : "Pending"}</Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={sorted}
      getRowId={(row) => row.id}
      caption="Upcoming bookings"
      sort={sort}
      onSortChange={setSort}
      selectedRowIds={selectedRowIds}
      onSelectedRowIdsChange={setSelectedRowIds}
    />
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
};

export const WithoutSelection: Story = {
  render: () => {
    const columns: TableColumn<Booking>[] = [
      { id: "guest", header: "Guest", cell: (row) => row.guest },
      { id: "plan", header: "Plan", cell: (row) => row.plan },
      { id: "guests", header: "Guests", cell: (row) => row.guests, align: "end" },
    ];
    return <Table columns={columns} data={BOOKINGS} getRowId={(row) => row.id} />;
  },
};

export const Empty: Story = {
  render: () => {
    const columns: TableColumn<Booking>[] = [
      { id: "guest", header: "Guest", cell: (row) => row.guest },
      { id: "plan", header: "Plan", cell: (row) => row.plan },
    ];
    return <Table columns={columns} data={[]} getRowId={(row) => row.id} emptyMessage="No bookings yet" />;
  },
};

export const Filterable: Story = {
  render: () => {
    function FilterableExample() {
      const [filters, setFilters] = useState<Record<string, string>>({});

      const filtered = BOOKINGS.filter(
        (b) =>
          b.guest.toLowerCase().includes((filters.guest ?? "").toLowerCase()) &&
          b.plan.toLowerCase().includes((filters.plan ?? "").toLowerCase()),
      );

      const columns: TableColumn<Booking>[] = [
        { id: "guest", header: "Guest", cell: (row) => row.guest, filterable: true, filterPlaceholder: "Search name…" },
        { id: "plan", header: "Plan", cell: (row) => row.plan, filterable: true, filterPlaceholder: "Search plan…" },
        { id: "guests", header: "Guests", cell: (row) => row.guests, align: "end" },
      ];

      return (
        <Table
          columns={columns}
          data={filtered}
          getRowId={(row) => row.id}
          filters={filters}
          onFiltersChange={setFilters}
          emptyMessage="No bookings match these filters"
        />
      );
    }
    return <FilterableExample />;
  },
};

export const Editable: Story = {
  render: () => {
    function EditableExample() {
      const [bookings, setBookings] = useState(BOOKINGS);

      const columns: TableColumn<Booking>[] = [
        { id: "guest", header: "Guest", cell: (row) => row.guest },
        {
          id: "guests",
          header: "Guests",
          align: "end",
          cell: (row) => row.guests,
          editable: true,
          getEditValue: (row) => String(row.guests),
          onEditCommit: (row, value) => {
            const n = Number(value);
            if (!Number.isFinite(n) || n < 1) return;
            setBookings((prev) => prev.map((b) => (b.id === row.id ? { ...b, guests: n } : b)));
          },
        },
      ];

      return <Table columns={columns} data={bookings} getRowId={(row) => row.id} caption="Click a guest count to edit it" />;
    }
    return <EditableExample />;
  },
};

export const HighlightedColumn: Story = {
  render: () => {
    const columns: TableColumn<Booking>[] = [
      { id: "guest", header: "Guest", cell: (row) => row.guest },
      { id: "plan", header: "Plan", cell: (row) => row.plan },
      { id: "guests", header: "Guests", cell: (row) => row.guests, align: "end" },
    ];
    return (
      <Table columns={columns} data={BOOKINGS} getRowId={(row) => row.id} caption="Hover a column header to highlight its column" />
    );
  },
};

export const ReorderableRows: Story = {
  render: () => {
    function ReorderableRowsExample() {
      const [rows, setRows] = useState(BOOKINGS);
      const columns: TableColumn<Booking>[] = [
        { id: "guest", header: "Guest", cell: (row) => row.guest },
        { id: "plan", header: "Plan", cell: (row) => row.plan },
      ];
      return (
        <Table
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          reorderableRows
          onReorderRows={(from, to) =>
            setRows((prev) => {
              const next = [...prev];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              return next;
            })
          }
        />
      );
    }
    return <ReorderableRowsExample />;
  },
};

export const ReorderableColumns: Story = {
  render: () => {
    function ReorderableColumnsExample() {
      const [columns, setColumns] = useState<TableColumn<Booking>[]>([
        { id: "guest", header: "Guest", cell: (row) => row.guest },
        { id: "plan", header: "Plan", cell: (row) => row.plan },
        { id: "guests", header: "Guests", cell: (row) => row.guests, align: "end" },
      ]);
      return (
        <Table
          columns={columns}
          data={BOOKINGS}
          getRowId={(row) => row.id}
          reorderableColumns
          onReorderColumns={(from, to) =>
            setColumns((prev) => {
              const next = [...prev];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              return next;
            })
          }
        />
      );
    }
    return <ReorderableColumnsExample />;
  },
};

export const ResizableColumns: Story = {
  render: () => {
    function ResizableColumnsExample() {
      const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
      const columns: TableColumn<Booking>[] = [
        { id: "guest", header: "Guest", cell: (row) => row.guest },
        { id: "plan", header: "Plan", cell: (row) => row.plan },
        { id: "guests", header: "Guests", cell: (row) => row.guests, align: "end" },
      ];
      return (
        <Table
          columns={columns}
          data={BOOKINGS}
          getRowId={(row) => row.id}
          resizableColumns
          columnWidths={columnWidths}
          onColumnWidthsChange={setColumnWidths}
          caption="Drag a header's right edge (or focus it and use Left/Right arrows) to resize"
        />
      );
    }
    return <ResizableColumnsExample />;
  },
};

export const WithPaginationAndFooter: Story = {
  render: () => {
    function PaginatedExample() {
      const [page, setPage] = useState(1);
      const perPage = 2;
      const pageRows = BOOKINGS.slice((page - 1) * perPage, page * perPage);
      const columns: TableColumn<Booking>[] = [
        { id: "guest", header: "Guest", cell: (row) => row.guest },
        { id: "guests", header: "Guests", cell: (row) => row.guests, align: "end" },
      ];
      const totalGuests = BOOKINGS.reduce((sum, b) => sum + b.guests, 0);
      return (
        <Table
          columns={columns}
          data={pageRows}
          getRowId={(row) => row.id}
          footer={`${totalGuests} guests across ${BOOKINGS.length} bookings`}
          pagination={{ page, totalPages: Math.ceil(BOOKINGS.length / perPage), onChange: setPage }}
        />
      );
    }
    return <PaginatedExample />;
  },
};

export const ComposedFromPrimitives: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`TableRow`/`TableCell`/`TableHeaderCell`/`TableFooter` used directly against a plain `<table>`, without the high-level `Table` component — for layouts the columns-array API doesn't fit.",
      },
    },
  },
  render: () => {
    function ComposedExample() {
      const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
      return (
        <div style={{ overflowX: "auto", border: "1px solid var(--c-border)", borderRadius: "var(--radius-lg)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <TableHeaderCell sortable sortDirection={sortDirection} onSort={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}>
                  Guest
                </TableHeaderCell>
                <TableHeaderCell align="end">Guests</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.slice(0, 3).map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.guest}</TableCell>
                  <TableCell align="end">{b.guests}</TableCell>
                </TableRow>
              ))}
            </tbody>
            <TableFooter>
              <tr>
                <td colSpan={2} style={{ padding: "var(--space-12) var(--space-16)", fontSize: "var(--font-size-14)" }}>
                  Hand-composed footer content
                </td>
              </tr>
            </TableFooter>
          </table>
        </div>
      );
    }
    return <ComposedExample />;
  },
};
