import styles from "../styles/Footer.module.css";
import { SiThemoviedatabase } from "react-icons/si";
import { ChakraProvider, Box, VStack, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ChakraProvider>
        <VStack align="start">
          <Box ml="40px">Home</Box>
          <Box ml="40px">What to Watch Today?</Box>
          <Box ml="40px">Where Is My movie?</Box>
          <Box ml="40px">&copy;Jonas Zeferino 2023</Box>
        </VStack>
        <VStack ml="40px" align="start">
          <Box ml="40px">Login</Box>
          <Box ml="40px">Tv Shows</Box>
          <Box ml="40px">Movies</Box>
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
