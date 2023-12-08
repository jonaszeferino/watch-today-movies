import styles from "../styles/Footer.module.css";
import { SiThemoviedatabase } from "react-icons/si";
import { ChakraProvider, Box, VStack, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ChakraProvider>
        <VStack align="start">
          <Box ml="30px">What to Watch Today?</Box>
          <Box ml="30px">Where Is My movie?</Box>

          <Box ml="30px">&copy;Jonas Zeferino 2023</Box>
          <Box ml="30px" display="flex" alignItems="center" mr="10px">
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
        <VStack ml="30px" align="start">
          <Box ml="30px">Tv Shows</Box>
          <Box ml="30px">Movies</Box>
          <Box ml="30px">Login</Box>
          {/* <Box ml="30px" display="flex" alignItems="center" mr="10px">
            <Text marginRight="4px">Powered by</Text>
            <Link
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className={styles.iconLink}
            >
              <SiThemoviedatabase size={24} />
            </Link>
          </Box> */}
        </VStack>
      </ChakraProvider>
    </footer>
  );
}
