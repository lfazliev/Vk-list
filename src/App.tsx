import { RepositoryList } from "./components/RepositoryList";
import { Container, CssBaseline, Box } from "@mui/material";
import styles from "./App.module.css";

function App() {
  return (
    <>
      <CssBaseline />
      <Container>
        <Box className={styles.box}>
          <RepositoryList />
        </Box>
      </Container>
    </>
  );
}
export default App;
