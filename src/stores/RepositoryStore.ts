import { makeAutoObservable, runInAction } from "mobx";

export interface Repository {
  id: number;
  name: string;
}

export class RepositoryStore {
  repositories: Repository[] = [];
  currentPage = 1;
  isLoading = false;
  hasMore = true;
  sortBy = "stars";

  constructor() {
    makeAutoObservable(this);
  }

  setSortBy(newSort: string) {
    this.sortBy = newSort;
    this.repositories = [];
    this.currentPage = 1;
    this.hasMore = true;
    this.fetchRepositories();
  }

  async fetchRepositories() {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=javascript&sort=${this.sortBy}&order=asc&page=${this.currentPage}&per_page=50`,
      );
      const data = await response.json();
      runInAction(() => {
        if (data.items.length === 0) {
          this.hasMore = false;
        } else {
          this.repositories.push(...data.items);
          this.currentPage++;
        }
      });
    } catch (error) {
      console.error("Ошибка при загрузке репозиториев:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  removeRepository(id: number) {
    runInAction(() => {
      console.log(`Удаление репозитория с id: ${id}`);
      this.repositories = this.repositories.filter((repo) => repo.id !== id);
    });
  }

  editRepository(id: number, newName: string) {
    runInAction(() => {
      console.log(
        `Редактирование репозитория с id: ${id} на новое имя: ${newName}`,
      );
      const repo = this.repositories.find((r) => r.id === id);
      if (repo) {
        repo.name = newName;
      }
    });
  }
}
