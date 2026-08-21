import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ToastProvider, useToast } from "./Toast";

function Probe() {
  const { toast, dismiss, dismissAll } = useToast();
  return (
    <div>
      <button onClick={() => toast({ title: "Saved", description: "Your changes were saved." })}>fire info</button>
      <button onClick={() => toast({ variant: "error", title: "Failed" })}>fire error</button>
      <button onClick={() => toast({ title: "No auto-dismiss", duration: 0 })}>fire persistent</button>
      <button onClick={() => toast({ title: "Short", duration: 100 })}>fire short</button>
      <button onClick={() => dismiss("toast-1")}>dismiss first</button>
      <button onClick={dismissAll}>dismiss all</button>
    </div>
  );
}

describe("ToastProvider / useToast", () => {
  it("throws when useToast is used outside a ToastProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Bare() {
      useToast();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/must be used within a <ToastProvider>/);
    spy.mockRestore();
  });

  it("shows a toast with title and description", async () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("fire info"));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes were saved.")).toBeInTheDocument();
  });

  it("uses role=status for info and role=alert for error", async () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("fire info"));
    await userEvent.click(screen.getByText("fire error"));
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });

  it("dismisses a toast when its close button is clicked", async () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("fire info"));
    expect(screen.getByText("Saved")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("dismisses a toast by id via the dismiss() function", async () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("fire info")); // becomes toast-1
    expect(screen.getByText("Saved")).toBeInTheDocument();

    await userEvent.click(screen.getByText("dismiss first"));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("dismissAll clears every visible toast", async () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("fire info"));
    await userEvent.click(screen.getByText("fire error"));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();

    await userEvent.click(screen.getByText("dismiss all"));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    expect(screen.queryByText("Failed")).not.toBeInTheDocument();
  });

  it("does not auto-dismiss when duration is 0", async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByText("fire persistent"));
    });
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText("No auto-dismiss")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("auto-dismisses after the given duration", async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByText("fire short"));
    });
    expect(screen.getByText("Short")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.queryByText("Short")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("has no accessibility violations with a toast shown", async () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("fire info"));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
