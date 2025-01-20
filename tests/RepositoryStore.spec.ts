import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { RepositoryStore } from "../src/stores/RepositoryStore";

describe("RepositoryStore", () => {
  let store: RepositoryStore;

  beforeEach(() => {
    store = new RepositoryStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("должен загружать репозитории", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({ items: [{ id: 1, name: "Repo1" }] }),
    } as Response);
    await store.fetchRepositories();
    expect(store.repositories.length).toBe(1);
  });

  it("должен удалять репозиторий по id", () => {
    store.repositories = [{ id: 1, name: "Repo1" }];
    store.removeRepository(1);
    expect(store.repositories.length).toBe(0);
  });

  it("должен редактировать репозиторий по id", () => {
    store.repositories = [{ id: 1, name: "OldName" }];
    store.editRepository(1, "NewName");
    expect(store.repositories[0].name).toBe("NewName");
  });

  it("должен менять сортировку и сбрасывать состояние", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => ({ items: [] }),
    } as Response);
    store.setSortBy("forks");
    await waitFor(() => {
      expect(store.sortBy).toBe("forks");
      expect(store.currentPage).toBe(1);
    });
  });
});
