import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import {
  ChakraProvider,
  Tr,
  Td,
  Box,
  Center,
  Text,
  Table,
  Tbody,
  TableContainer,
  Image,
} from "@chakra-ui/react";
import TranslateProfile from "../components/TranslateProfile";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import Head from "next/head";

const MoviePage = () => {
  const router = useRouter();
  const { tvShowId, tvShowSeasonId } = router.query;
  const [dataTvShows, setDataTvShows] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook

  useEffect(() => {
    const CallDataTvShowsDetails = () => {
      const url = `https://api.themoviedb.org/3/tv/${tvShowId}/season/${tvShowSeasonId}`;
      const tmdbBearer = process.env.NEXT_PUBLIC_TMDB_BEARER;

      fetch(url, {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: tmdbBearer,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 404) {
            throw new Error("Season not found");
          } else {
            throw new Error("An error occurred while fetching the data");
          }
        })
        .then((result) => {
          setDataTvShows(result);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(true);
          setIsLoading(false);
        });
    };

    if (tvShowId && tvShowSeasonId) {
      CallDataTvShowsDetails();
    }
  }, [tvShowId, tvShowSeasonId]);

  if (isLoading) {
    return <p>Loading data...</p>;
  }

  return (
    <>
      <ChakraProvider>
        <Head>
          <title>Tv Shows Episodes</title>
          <meta
            name="keywords"
            content="tvshow,watch,review, series, filmes"
          ></meta>
          <meta name="description" content="filmes, series,"></meta>
        </Head>
        <LoggedUser />
        <Center minHeight="100vh">
          <Box maxW="576px" width="100%" px="4">
            <div className={styles.grid}>
              {dataTvShows.episodes ? (
                dataTvShows.episodes.map((episode) => (
                  <div
                    key={episode.name}
                    className={styles.gridItem}
                    style={{
                      maxWidth: "100%",
                      margin: "0 auto",
                      wordBreak: "break-word",
                    }}
                  >
                    <Box my="6" textAlign="center">
                      <Text fontSize="xl" fontWeight="semibold">
                        {episode.name} S{tvShowSeasonId} E
                        {episode.episode_number}
                      </Text>
                      <Box
                        width="100%"
                        mx="auto"
                        my="4"
                        boxShadow="3px 8px 12px rgba(0.4, 0.4, 0.4, 0.4)"
                      >
                        <Image
                          src={
                            episode.still_path
                              ? "https://image.tmdb.org/t/p/original" +
                                episode.still_path
                              : "/callback.png"
                          }
                          alt="poster"
                          maxW="100%"
                          height="auto"
                        />
                      </Box>
                      <div
                        style={{
                          maxWidth: "100%",
                          margin: "0 auto",
                          wordBreak: "break-word",
                        }}
                      >
                        <TableContainer>
                          <Table size="sm">
                            <Tbody>
                              <Tr>
                                <Td>Title</Td>
                                <Td>{episode.name}</Td>
                              </Tr>
                              <Tr>
                                <Td>Overview</Td>
                                <Td
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    maxWidth: "400px", // Defina um valor apropriado para o tamanho máximo
                                  }}
                                >
                                  {episode.overview
                                    ? episode.overview
                                    : "Sem infos"}
                                </Td>
                              </Tr>
                              <Tr>
                                <Td>Average</Td>
                                <Td>{episode.vote_average}</Td>
                              </Tr>
                              <Tr>
                                <Td>Direction & Writing</Td>
                                <Td>
                                  {episode.crew && episode.crew.length > 0 && (
                                    <>
                                      {episode.crew
                                        .filter(
                                          (member) => member.job === "Writer"
                                        )
                                        .map((writer, index) => (
                                          <div key={`writer-${index}`}>
                                            {TranslateProfile({
                                              text: "Writer",
                                              language: "en",
                                            })}
                                            : {writer.name}
                                          </div>
                                        ))}
                                      {episode.crew
                                        .filter(
                                          (member) => member.job === "Director"
                                        )
                                        .map((director, index) => (
                                          <div key={`director-${index}`}>
                                            {TranslateProfile({
                                              text: "Director",
                                              language: "en",
                                            })}
                                            : {director.name}
                                          </div>
                                        ))}
                                    </>
                                  )}
                                </Td>
                              </Tr>
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </div>
                    </Box>
                  </div>
                ))
              ) : (
                <Text fontSize="xl" fontWeight="semibold" textAlign="center">
                  No Epsisodes{" "}
                </Text>
              )}
            </div>
            {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
          </Box>
        </Center>
      </ChakraProvider>
    </>
  );
};

export default MoviePage;
