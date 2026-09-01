import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { TableHeaderCell } from "./TableHeaderCell";

function Table({ children }: { children: ReactNode }) {
  return (
    <table>
      <thead>
        <tr>{children}</tr>
      </thead>
    </table>
  );
}

describe("TableHeaderCell", () => {
  it("renders plain text when not sortable", () => {
    render(
      <Table>
        <TableHeaderCell>Name</TableHeaderCell>
      </Table>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a sort button and reports clicks", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeaderCell sortable onSort={onSort}>
          Name
        </TableHeaderCell>
      </Table>,
    );
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(onSort).toHaveBeenCalled();
  });

  it("sets aria-sort based on sortDirection", () => {
    render(
      <Table>
        <TableHeaderCell sortable sortDirection="asc">
          Name
        </TableHeaderCell>
      </Table>,
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "ascending");
  });

  it("opens a filter popover, reports typed text, and clears it", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <Table>
        <TableHeaderCell filterable filterValue="an" onFilterChange={onFilterChange}>
          Name
        </TableHeaderCell>
      </Table>,
    );
    await user.click(screen.getByRole("button", { name: "Filter Name" }));
    const input = await screen.findByRole("textbox");
    expect(input).toHaveFocus();

    await user.type(input, "a");
    expect(onFilterChange).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onFilterChange).toHaveBeenCalledWith("");
  });

  it("closes the filter popover on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Table>
        <TableHeaderCell filterable>Name</TableHeaderCell>
      </Table>,
    );
    const trigger = screen.getByRole("button", { name: "Filter Name" });
    await user.click(trigger);
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("fires highlight enter/leave callbacks on hover", async () => {
    const user = userEvent.setup();
    const onHighlightEnter = vi.fn();
    const onHighlightLeave = vi.fn();
    render(
      <Table>
        <TableHeaderCell onHighlightEnter={onHighlightEnter} onHighlightLeave={onHighlightLeave}>
          Name
        </TableHeaderCell>
      </Table>,
    );
    await user.hover(screen.getByRole("columnheader"));
    expect(onHighlightEnter).toHaveBeenCalled();
    await user.unhover(screen.getByRole("columnheader"));
    expect(onHighlightLeave).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Table>
        <TableHeaderCell sortable sortDirection="desc" filterable filterValue="x">
          Name
        </TableHeaderCell>
      </Table>,
    );
    await expectNoA11yViolations(container);
  });
});
