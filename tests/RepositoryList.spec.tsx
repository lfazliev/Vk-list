import { test, expect, vi, afterEach } from "vitest";
import { StrictMode } from "react";
import { RepositoryStore } from "../src/stores/RepositoryStore";
import { StoreContext } from "../src/main";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("test load status", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
    json: async () => ({ items: [] }),
  } as Response);
  const store = new RepositoryStore();

  const screen = render(
    <StrictMode>
      <StoreContext.Provider value={store}>
        <App />
      </StoreContext.Provider>
    </StrictMode>,
  );
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

test("test remove repository action", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
    json: async () => ({
      items: [{ id: 123, name: "TestRepo" }],
    }),
  } as Response);

  const store = new RepositoryStore();

  const screen = render(
    <StrictMode>
      <StoreContext.Provider value={store}>
        <App />
      </StoreContext.Provider>
    </StrictMode>,
  );

  await waitFor(() => {
    expect(screen.getByDisplayValue("TestRepo")).toBeInTheDocument();
  });

  const deleteButton = screen.getByText("Удалить");
  await userEvent.click(deleteButton);

  await waitFor(() => {
    expect(screen.queryByDisplayValue("TestRepo")).toBeNull();
  });
});

test("test edit repository action", async () => {
  const store = new RepositoryStore();
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
    json: async () => ({ items: [{ id: 999, name: "OldName" }] }),
  } as Response);
  const screen = render(
    <StrictMode>
      <StoreContext.Provider value={store}>
        <App />
      </StoreContext.Provider>
    </StrictMode>,
  );

  await waitFor(() => {
    expect(screen.getByDisplayValue("OldName")).toBeInTheDocument();
  });

  const input = screen.getByDisplayValue("OldName") as HTMLInputElement;
  await userEvent.clear(input);
  await userEvent.type(input, "NewName");

  await waitFor(() => {
    expect(screen.getByDisplayValue("NewName")).toBeInTheDocument();
  });
});
