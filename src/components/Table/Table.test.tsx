import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Table, type TableColumn } from "./Table";

type Guest = { id: string; name: string; guests: number };

const rows: Guest[] = [
  { id: "a", name: "Ana", guests: 2 },
  { id: "b", name: "Bo", guests: 5 },
  { id: "c", name: "Cy", guests: 1 },
];

const columns: TableColumn<Guest>[] = [
  { id: "name", header: "Name", cell: (r) => r.name, sortable: true },
  { id: "guests", header: "Guests", cell: (r) => r.guests, align: "end" },
];

describe("Table", () => {
  it("renders a header cell per column and a row per data item", () => {
    render(<Table columns={columns} data={rows} getRowId={(r) => r.id} />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(rows.length + 1); // + header row
    expect(screen.getByRole("cell", { name: "Bo" })).toBeInTheDocument();
  });

  it("renders the empty message when there is no data", () => {
    render(<Table columns={columns} data={[]} getRowId={(r) => r.id} emptyMessage="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("cycles sort direction and reports it via onSortChange", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const { rerender } = render(
      <Table columns={columns} data={rows} getRowId={(r) => r.id} sort={null} onSortChange={onSortChange} />,
    );
    const nameHeader = screen.getByRole("button", { name: /Name/ });

    await user.click(nameHeader);
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: "name", direction: "asc" });

    rerender(
      <Table
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        sort={{ columnId: "name", direction: "asc" }}
        onSortChange={onSortChange}
      />,
    );
    expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute("aria-sort", "ascending");

    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: "name", direction: "desc" });
  });

  it("does not render a selection column when selection props are omitted", () => {
    render(<Table columns={columns} data={rows} getRowId={(r) => r.id} />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("selects and deselects individual rows", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Table columns={columns} data={rows} getRowId={(r) => r.id} selectedRowIds={["a"]} onSelectedRowIdsChange={onChange} />,
    );
    const rowsEls = screen.getAllByRole("row").slice(1);
    expect(within(rowsEls[0]).getByRole("checkbox")).toBeChecked();
    expect(within(rowsEls[1]).getByRole("checkbox")).not.toBeChecked();

    await user.click(within(rowsEls[1]).getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);

    await user.click(within(rowsEls[0]).getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("selects and deselects all rows via the header checkbox", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Table columns={columns} data={rows} getRowId={(r) => r.id} selectedRowIds={[]} onSelectedRowIdsChange={onChange} />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onChange).toHaveBeenCalledWith(["a", "b", "c"]);
  });

  it("marks the header checkbox indeterminate when only some rows are selected", () => {
    render(
      <Table columns={columns} data={rows} getRowId={(r) => r.id} selectedRowIds={["a"]} onSelectedRowIdsChange={vi.fn()} />,
    );
    const headerCheckbox = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
    expect(headerCheckbox.indeterminate).toBe(true);
    expect(headerCheckbox.checked).toBe(false);
  });

  it("highlights a column on header hover when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<Table columns={columns} data={rows} getRowId={(r) => r.id} />);
    const header = screen.getByRole("columnheader", { name: "Name" });
    await user.hover(header);
    const rowsEls = screen.getAllByRole("row").slice(1);
    expect(within(rowsEls[0]).getByRole("cell", { name: "Ana" }).className).toMatch(/columnHighlighted/);
  });

  it("reports highlight changes when highlightedColumnId is controlled", async () => {
    const user = userEvent.setup();
    const onHighlightColumnChange = vi.fn();
    render(
      <Table
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        highlightedColumnId={null}
        onHighlightColumnChange={onHighlightColumnChange}
      />,
    );
    await user.hover(screen.getByRole("columnheader", { name: "Name" }));
    expect(onHighlightColumnChange).toHaveBeenCalledWith("name");
  });

  it("renders a filter button per filterable column and reports typed text", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    const filterableColumns: TableColumn<Guest>[] = [
      { id: "name", header: "Name", cell: (r) => r.name, filterable: true },
      { id: "guests", header: "Guests", cell: (r) => r.guests },
    ];
    render(
      <Table
        columns={filterableColumns}
        data={rows}
        getRowId={(r) => r.id}
        filters={{}}
        onFiltersChange={onFiltersChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Filter Name" }));
    await user.type(screen.getByRole("textbox"), "a");
    expect(onFiltersChange).toHaveBeenCalledWith({ name: "a" });
  });

  it("renders custom footer content and a Pagination row when given", () => {
    render(
      <Table
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        footer="3 guests total"
        pagination={{ page: 2, totalPages: 5, onChange: vi.fn() }}
      />,
    );
    expect(screen.getByText("3 guests total")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 2" })).toHaveAttribute("aria-current", "page");
  });

  it("edits a cell end-to-end via the column's getEditValue/onEditCommit", async () => {
    const user = userEvent.setup();
    const onEditCommit = vi.fn();
    const editableColumns: TableColumn<Guest>[] = [
      { id: "name", header: "Name", cell: (r) => r.name, editable: true, getEditValue: (r) => r.name, onEditCommit },
    ];
    render(<Table columns={editableColumns} data={rows} getRowId={(r) => r.id} />);
    await user.click(screen.getByRole("button", { name: "Edit Name: Ana" }));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Anna{Enter}");
    expect(onEditCommit).toHaveBeenCalledWith(rows[0], "Anna");
  });

  it("renders a drag handle per row when reorderableRows, and reports moves via keyboard", async () => {
    const user = userEvent.setup();
    const onReorderRows = vi.fn();
    render(
      <Table columns={columns} data={rows} getRowId={(r) => r.id} reorderableRows onReorderRows={onReorderRows} />,
    );
    const handles = screen.getAllByRole("button", { name: /Reorder row/ });
    expect(handles).toHaveLength(rows.length);

    handles[0].focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowDown}");
    expect(onReorderRows).toHaveBeenCalledWith(0, 1);
  });

  it("renders a drag handle per header cell when reorderableColumns, and reports moves via keyboard", async () => {
    const user = userEvent.setup();
    const onReorderColumns = vi.fn();
    render(
      <Table
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        reorderableColumns
        onReorderColumns={onReorderColumns}
      />,
    );
    const handles = screen.getAllByRole("button", { name: /Reorder (Name|Guests)/ });
    expect(handles).toHaveLength(columns.length);

    handles[0].focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowRight}");
    expect(onReorderColumns).toHaveBeenCalledWith(0, 1);
  });

  it("renders a resize handle per header cell when resizableColumns, and reports width changes via keyboard", async () => {
    const user = userEvent.setup();
    const onColumnWidthsChange = vi.fn();
    render(
      <Table
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        resizableColumns
        columnWidths={{}}
        onColumnWidthsChange={onColumnWidthsChange}
      />,
    );
    const handles = screen.getAllByRole("separator", { name: /Resize (Name|Guests) column/ });
    expect(handles).toHaveLength(columns.length);

    handles[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 170 });
  });

  it("defaults a resizable column's width from `column.width` when given", () => {
    const widthColumns: TableColumn<Guest>[] = [{ id: "name", header: "Name", cell: (r) => r.name, width: "220px" }];
    render(
      <Table
        columns={widthColumns}
        data={rows}
        getRowId={(r) => r.id}
        resizableColumns
        columnWidths={{}}
        onColumnWidthsChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("separator", { name: "Resize Name column" })).toHaveAttribute("aria-valuenow", "220");
  });

  it("has no accessibility violations with every feature enabled", async () => {
    const fullColumns: TableColumn<Guest>[] = [
      { id: "name", header: "Name", cell: (r) => r.name, sortable: true, filterable: true, editable: true, getEditValue: (r) => r.name, onEditCommit: vi.fn() },
      { id: "guests", header: "Guests", cell: (r) => r.guests, align: "end" },
    ];
    const { container } = render(
      <Table
        columns={fullColumns}
        data={rows}
        getRowId={(r) => r.id}
        caption="Guests"
        sort={{ columnId: "name", direction: "asc" }}
        onSortChange={vi.fn()}
        selectedRowIds={["a"]}
        onSelectedRowIdsChange={vi.fn()}
        reorderableRows
        onReorderRows={vi.fn()}
        reorderableColumns
        onReorderColumns={vi.fn()}
        resizableColumns
        columnWidths={{}}
        onColumnWidthsChange={vi.fn()}
        pagination={{ page: 1, totalPages: 3, onChange: vi.fn() }}
        footer="Totals"
      />,
    );
    await expectNoA11yViolations(container);
  });
});
