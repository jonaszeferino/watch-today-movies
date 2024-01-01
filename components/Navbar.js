import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import Auth from "./Auth";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

import { supabase } from "../utils/supabaseClient";
import SearchBar from "./SearchBar";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChakraProvider,
  ModalCloseButton,
  Center,
  Link as ChakraLink,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export default function Navbar({ isLoading, onAuthenticated }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [session, setSession] = useState(null);
  const router = useRouter();

  // Session Verify
  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
        }
      }
    }
    getInitialSession();
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      <ul className={styles.navbar}>
        <Link href="/">
          <span> | Home</span>
        </Link>
        <Link href="/watch-today">
          <span> | What to Watch Today?</span>
        </Link>
        <Link href="/search-movies">
          <span>| Discover Movies</span>
        </Link>
        <Link href="/search-tvshows">
          <span>| Discover Tv Shows |</span>
        </Link>
        {/* <Link href="/where-is-my-movie">
                <span>
                  <ChevronRightIcon /> Where is My Movie?
                </span>
              </Link> */}

        <br />
        <li>
          <button onClick={onOpen}>Login |</button>
        </li>
        <li>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent style={{ background: "white" }}>
              <ModalHeader>
                Login
                <IconButton
                  icon={<FaTimes />}
                  colorScheme="gray"
                  variant="ghost"
                  ml="auto"
                  onClick={onClose}
                />
              </ModalHeader>
              <ModalBody>
                <Auth onClose={onClose} />
              </ModalBody>
            </ModalContent>
          </Modal>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent style={{ background: "white" }}>
              <ModalHeader>
                Login{" "}
                <IconButton
                  icon={<FaTimes />}
                  colorScheme="gray"
                  variant="ghost"
                  position="absolute"
                  top="0"
                  right="0"
                  onClick={onClose}
                />
              </ModalHeader>
              <ModalBody>
                <Auth onAuthenticated={onAuthenticated} onClose={onClose} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </li>

        {session ? (
          <li>
            Profile
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  >
                    {""}
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <ChakraLink href="/profile">Data</ChakraLink>
                    </MenuItem>
                    <MenuItem>
                      <ChakraLink href="/my-movies-page">My Ratings</ChakraLink>
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </li>
        ) : null}
      </ul>
      <SearchBar isLoading={isLoading} />
    </>
  );
}
