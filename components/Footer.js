import styles from "../styles/Footer.module.css";
import { SiThemoviedatabase } from "react-icons/si";
import { ChakraProvider, Box, VStack, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ChakraProvider>
        <VStack align="start">
          <Link href="/">
            <Box ml="40px">Home</Box>
          </Link>
          <Link href="/watch-today">
            <Box ml="40px">What to Watch Today?</Box>
          </Link>
          <Link href="/where-is-my-movie">
            <Box ml="40px">Where Is My movie?</Box>
          </Link>
          <Box ml="40px">&copy;Jonas Zeferino 2023</Box>
        </VStack>
      
        <VStack ml="40px" align="start">
          <Link href="/signUp">
            <Box ml="40px">Login</Box>
          </Link>

          <Link href="/search-tvshows">
            <Box ml="40px">Tv Shows</Box>
          </Link>

          <Link href="/search-movies">
            <Box ml="40px">Movies</Box>
          </Link>

          <Box ml="40px" display="flex" alignItems="center" mr="10px">
            <Text marginRight="4px">Powered by</Text>
            <Link
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className={styles.iconLink}
            >
              <SiThemoviedatabase size={24} />
            </Link>
          </Box>
        </VStack>
      </ChakraProvider>
    </footer>
  );
}
