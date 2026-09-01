import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { TableCell } from "./TableCell";

function Table({ children }: { children: ReactNode }) {
  return (
    <table>
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </table>
  );
}

describe("TableCell", () => {
  it("renders plain content when not editable", () => {
    render(
      <Table>
        <TableCell>Ana</TableCell>
      </Table>,
    );
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders an edit trigger button when editable and not editing", () => {
    render(
      <Table>
        <TableCell editable editLabel="Edit Guest">
          Ana
        </TableCell>
      </Table>,
    );
    expect(screen.getByRole("button", { name: "Edit Guest" })).toHaveTextContent("Ana");
  });

  it("calls onEditStart when the trigger is activated", async () => {
    const user = userEvent.setup();
    const onEditStart = vi.fn();
    render(
      <Table>
        <TableCell editable editLabel="Edit Guest" onEditStart={onEditStart}>
          Ana
        </TableCell>
      </Table>,
    );
    await user.click(screen.getByRole("button", { name: "Edit Guest" }));
    expect(onEditStart).toHaveBeenCalled();
  });

  it("renders a focused input when editing, and reports changes", async () => {
    const user = userEvent.setup();
    const onEditChange = vi.fn();
    render(
      <Table>
        <TableCell editable editing editValue="Ana" onEditChange={onEditChange}>
          Ana
        </TableCell>
      </Table>,
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toHaveFocus();
    await user.type(input, "!");
    expect(onEditChange).toHaveBeenCalled();
  });

  it("commits on Enter and on blur, cancels on Escape", async () => {
    const user = userEvent.setup();
    const onEditCommit = vi.fn();
    const onEditCancel = vi.fn();
    render(
      <>
        <Table>
          <TableCell editable editing editValue="Ana" onEditCommit={onEditCommit} onEditCancel={onEditCancel}>
            Ana
          </TableCell>
        </Table>
        <button>outside</button>
      </>,
    );
    const input = screen.getByRole("textbox");
    await user.type(input, "{Enter}");
    expect(onEditCommit).toHaveBeenCalledWith("Ana");

    await user.type(input, "{Escape}");
    expect(onEditCancel).toHaveBeenCalled();

    await user.click(screen.getByText("outside"));
    expect(onEditCommit).toHaveBeenCalledTimes(2);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Table>
        <TableCell editable editLabel="Edit Guest">
          Ana
        </TableCell>
      </Table>,
    );
    await expectNoA11yViolations(container);
  });
});
