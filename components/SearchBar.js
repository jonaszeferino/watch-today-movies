import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Spinner,
  Text,
  ChakraProvider,
  InputGroup,
  InputRightElement,
  Flex,
  useMediaQuery,
  Center,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import stringSimilarity from "string-similarity";

const SearchBar = ({ isLoading, showSearchBar = true }) => {
  const [searchText, setSearchText] = useState("");
  const [termosSugeridos, setTermosSugeridos] = useState([]);
  const router = useRouter();
  const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const listaDeTermos = ["Meryl Streep"];

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  }
  function handleSearch() {
    setTermosSugeridos([]);
    router.push(`/search-free?query=${searchText}`);
  }

  function handleInputBlur() {
    if (!isMouseOverSuggestions) {
      setTermosSugeridos([]);
    }
  }

  function buscarTermosSemelhantes(entrada) {
    const resultados = stringSimilarity.findBestMatch(entrada, listaDeTermos);
    const termosSugeridos = resultados.ratings
      .filter((resultado) => resultado.rating > 0.4)
      .map((resultado) => resultado.target);

    return termosSugeridos;
  }

  function handleInputChange(event) {
    const inputValue = event.target.value;
    setSearchText(inputValue);
    if (inputValue.trim() !== "") {
      setTermosSugeridos(buscarTermosSemelhantes(inputValue));
    } else {
      setTermosSugeridos([]);
    }
  }

  function selectTerm(termo) {
    setSearchText(termo);
    setTermosSugeridos([]);
  }

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: "#7f5ad5",
        width: "100%", // Defina a largura como 100%
        border: "none",
      }}
    >
      <ChakraProvider>
        <Center>
          <Flex
            alignItems="center"
            maxWidth="60%" // Defina a largura como 100%
            flex="1"
            flexDirection="column"
            border="none"
          >
            <>
              <InputGroup
                flex="1"
                width="100%" // Defina a largura como 100%
                flexDirection="column"
                border="none" 

              >
                <Input
                  margin="2px"
                  required={true}
                  size="md"
                  bg="white"
                  color="black"
                  border="none"
                  mt="24px"
                  type="search"
                  placeholder="Movies, TvShows, People"
                  value={searchText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    if (!isMouseOverSuggestions) {
                      setTermosSugeridos([]);
                    }
                  }}
                  pr={isMobile ? "2.5rem" : "4.5rem"}
                  marginLeft={isMobile ? "auto" : "0"}
                  marginRight={isMobile ? "auto" : "0"}
                />
                {!isMobile && (
                  <InputRightElement
                    size="lg"
                    mt="24px"
                    pointerEvents="none"
                    marginLeft="auto"
                    marginRight="auto"
                    border="none" 

                  >
                    <SearchIcon color="gray.300" margin={1} size="lg" />
                  </InputRightElement>
                )}
              </InputGroup>
              {/* <Center>
              <Button
                type="submit"
                marginTop={1}
                as="a"
                size="md"
                bg="white"
                color="black"
                borderColor="gray"
                borderWidth="1px"
                mt="2px"
                marginLeft="auto"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Center> */}
            </>

            {termosSugeridos.length > 0 && (
              <Box
                mt="2"
                position="absolute"
                zIndex="9999"
                bg="white"
                boxShadow="md"
                borderRadius="md"
                width="33%"
                border="none" 
              >
                <ul>
                  {termosSugeridos.length > 0 && (
                    <Box
                      mt="2"
                      position="absolute"
                      zIndex="9999"
                      bg="white"
                      boxShadow="md"
                      borderRadius="md"
                      width="33%"
                      border="none" 

                      onMouseEnter={() => setIsMouseOverSuggestions(true)}
                      onMouseLeave={() => setIsMouseOverSuggestions(false)}
                    >
                      <Text p="2" fontWeight="bold">
                        Suggestions:
                      </Text>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          width: "200px",
                        }}
                      >
                        {termosSugeridos.map((termo, index) => (
                          <li
                            key={index}
                            onClick={() => selectTerm(termo)}
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {termo}
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                </ul>
              </Box>
            )}

            <Box>
              <Text>{isLoading ? <Spinner /> : " "}</Text>
            </Box>
          </Flex>
        </Center>
      </ChakraProvider>
    </div>
  );
};

export default SearchBar;
