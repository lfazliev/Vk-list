import { useEffect, useContext, useRef, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../main";
import { createContext } from "react";
import { RepositoryStore } from "../stores/RepositoryStore";
import {
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CircularProgress,
  Box,
} from "@mui/material";
import styles from "./RepositoryList.module.css";

export const RepositoryStoreContext = createContext<RepositoryStore | null>(
  null,
);

const ITEM_HEIGHT = 80;
const BUFFER = 5;

export const RepositoryList = observer(() => {
  const store = useContext(StoreContext);
  const listRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const [containerHeight, setContainerHeight] = useState(0);

  const calculateVisibleRange = useCallback(() => {
    if (!listRef.current) return;
    const height = listRef.current.clientHeight;
    setContainerHeight(height);
    const visibleCount = Math.ceil(height / ITEM_HEIGHT);
    setVisibleRange({
      start: 0,
      end: visibleCount + BUFFER * 2,
    });
  }, []);

  useEffect(() => {
    store.fetchRepositories();
    calculateVisibleRange();
    window.addEventListener("resize", calculateVisibleRange);
    return () => {
      window.removeEventListener("resize", calculateVisibleRange);
    };
  }, [store, calculateVisibleRange]);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const scrollTop = listRef.current.scrollTop;
    const startIndex = Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER;
    const endIndex =
      Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER;
    setVisibleRange({
      start: Math.max(0, startIndex),
      end: Math.min(store.repositories.length, endIndex),
    });

    if (
      scrollTop + containerHeight >= listRef.current.scrollHeight - 100 &&
      !store.isLoading &&
      store.hasMore
    ) {
      store.fetchRepositories();
    }
  }, [store, containerHeight]);

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(handleScroll);
    };
    const currentRef = listRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", onScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", onScroll);
      }
    };
  }, [handleScroll]);

  const totalHeight = store.repositories.length * ITEM_HEIGHT;
  const paddingTop = visibleRange.start * ITEM_HEIGHT;

  const visibleItems = store.repositories.slice(
    visibleRange.start,
    visibleRange.end,
  );

  return (
    <Box className={styles.container}>
      <Select
        onChange={(e) => store.setSortBy(e.target.value)}
        value={store.sortBy}
        fullWidth
        variant="outlined"
        className={styles.select}
      >
        <MenuItem value="stars">Sort by Stars</MenuItem>
        <MenuItem value="forks">Sort by Forks</MenuItem>
        <MenuItem value="updated">Sort by Updated</MenuItem>
      </Select>
      <Box ref={listRef} role="list" className={styles.list}>
        <Box style={{ height: totalHeight, position: "relative" }}>
          <Box style={{ transform: `translateY(${paddingTop}px)` }}>
            {visibleItems.map((repo) => (
              <Card key={repo.id} className={styles.card}>
                <TextField
                  className={styles.textField}
                  value={repo.name}
                  onChange={(e) =>
                    store.editRepository(repo.id, e.target.value)
                  }
                  variant="standard"
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => store.removeRepository(repo.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </Button>
              </Card>
            ))}
          </Box>
        </Box>
        {store.isLoading && (
          <Box className={styles.loading}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
});
