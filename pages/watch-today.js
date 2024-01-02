import { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Head from "next/head";
import Link from "next/link";
import {
  ChakraProvider,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Button,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  IconButton,
  Skeleton,
  Image,
  useMediaQuery,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import { Tooltip } from "antd";
import { Rate } from "antd";

export default function Movieapi() {
  const [movieData, setMovieData] = useState({});
  const [randomMovieId, setRandomMovieId] = useState(null);
  const [isError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [like, setLike] = useState(0);
  const [isLikeDisabled, setLikeDisable] = useState(false);
  const [likeThanks, setLikeThanks] = useState(false);
  const [dateNow, setDatenow] = useState(new Date());

  const [starValue, setStarValue] = useState(0); // Estado para armazenar o valor das estrelas
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false); // Estado para controlar se a avaliação foi enviada
  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook

  const [isMobile] = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isError) {
      apiCall();
    }
  }, [isError]);
  const posterRef = useRef(null);

  const apiCall = () => {
    if (!isError && posterRef.current) {
      posterRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setRandomMovieId(Math.floor(Math.random() * 560000));
    setIsLoading(true);
    setError(false);
    setLikeDisable(false);
    setLikeThanks(false);
    setIsRatingSubmitted(false);
    setStarValue(0);

    const url = `https://api.themoviedb.org/3/movie/${randomMovieId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c`;
    // const url = `https://api.themoviedb.org/3/movie/${randomMovieId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setError(true);
          throw new Error(response.statusText);
        }
      })
      .then((result) => {
        setMovieData({
          budget: result.budget,
          originalTitle: result.original_title,
          portugueseTitle: result.title,
          overview: result.overview,
          average: result.vote_average,
          releaseDate: result.release_date,
          image: result.poster_path,
          country: result.production_countries[0].name,
          ratingCount: result.vote_count,
          popularity: result.popularity,
          gender: result.genres.map((genre) => genre.name),
          languages: result.spoken_languages[0].name,
          adult: result.adult,
          movieId: result.id,
          originalLanguage: result.original_language,
          statusMovie: result.status,
        });
        setIsLoading(false);
        setError(false);
      })
      .catch((error) => setError(true), setIsLoading(false));
  };

  let destino = `/movie-page?movieId=${movieData.movieId}`;

  function getProgressColor(progressValue) {
    if (progressValue >= 0.1 && progressValue <= 3.999) {
      return "red";
    } else if (progressValue >= 4.0 && progressValue <= 5.999) {
      return "yellow";
    } else if (progressValue >= 6 && progressValue <= 7.999) {
      return "green";
    } else if (progressValue >= 8 && progressValue <= 10) {
      return "blue";
    } else {
      return "gray";
    }
  }

  const insertLike = async () => {
    try {
      const response = await fetch("/api/v1/postRateRandomMovie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieData.movieId,
          poster_path: movieData.image,
          original_title: movieData.originalTitle,
          portuguese_title: movieData.portugueseTitle,
          vote_average_by_provider: movieData.average,
          rating_by_user: starValue,
        }),
      });
      return;
    } catch (error) {
      console.error(error);
    }
  };
  const handleRateChange = (value) => {
    setStarValue(value);
  };
  const handleRatingSubmit = () => {
    setIsRatingSubmitted(true);
  };
  const isLoadingPage =
    isError || movieData.adult || movieData.portugueseTitle === null;

  return (
    <>
      <Head>
        <title>What to Watch Today?</title>
        <meta name="keywords" content="movies,watch,review"></meta>
        <meta
          name="description"
          content="Encontre filmes, series e recebe sugestões"
        ></meta>
      </Head>
      <div>
        <LoggedUser />
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <ChakraProvider>
            <Box maxW="32rem">
              <div className={styles.top}>
                <h3 className={styles.title}>What to Watch Today?</h3>
                <span>
                  Click and explore the possibilities until you find one that
                  suits your taste!
                </span>
              </div>

              <Button
                size="md"
                bg="white"
                color="black"
                borderColor="gray"
                borderWidth="1px"
                mt="24px"
                onClick={apiCall}
              >
                Go
              </Button>
            </Box>
          </ChakraProvider>
        </div>
        {isLoading ? <Progress size="xs" isIndeterminate /> : null}

        {isError === true ? (
          <ErrorPage message={`- Deleted Movie`}></ErrorPage>
        ) : (
          <div>
            {movieData.adult === false ? (
              <div>
                <h1>
                  <span className={styles.title}>
                    {movieData.originalTitle ? (
                      <span
                        className={styles.title}
                      >{`${movieData.originalTitle}`}</span>
                    ) : (
                      <ChakraProvider>
                        {/* <Box bg="green.100" p={4}>
                        <Alert
                        </Alert>
                      </Box> */}
                      </ChakraProvider>
                    )}
                  </span>
                  <br />
                </h1>
                <h1>
                  <ChakraProvider>
                    {movieData.adult === false ? (
                      <>
                        {isLoadingPage === false ? (
                          <Image
                            className={styles.card_image_big}
                            src={
                              movieData.image
                                ? "https://image.tmdb.org/t/p/original" +
                                  movieData.image
                                : "/callback_gray.png"
                            }
                            alt="poster"
                            width={isMobile ? "240px" : "480px"}
                            height={isMobile ? "360px" : "720px"}
                          />
                        ) : (
                          <Skeleton
                            width={isMobile ? "240px" : "480px"}
                            height={isMobile ? "360px" : "720px"}
                          />
                        )}
                      </>
                    ) : (
                      "Blocked Content"
                    )}
                  </ChakraProvider>
                </h1>
                {movieData.portugueseTitle ? (
                  <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                    <ChakraProvider>
                      <Tooltip
                        title={
                          <div style={{ whiteSpace: "pre-line" }}>
                            0.1 a 3.999 - Red - Worst <br />
                            4.0 a 5.999 - Yellow - Below Average <br />
                            6.0 a 7.999 - Green - Good <br />
                            8.0 a 10.00 - Blue - Excellent
                          </div>
                        }
                        style={{
                          color: "white",
                          borderColor: "purple",
                          background: "purple",
                        }}
                      >
                        <Progress
                          hasStripe
                          value={movieData.average}
                          max={10}
                          colorScheme={getProgressColor(movieData.average)}
                        />
                      </Tooltip>
                    </ChakraProvider>
                  </div>
                ) : null}
                <Rate value={1} count={1} /> 
                {movieData.portugueseTitle ? (
                  <span>{`${movieData.average} / ${movieData.ratingCount}`}</span>
                ) : null}
                <br />
                {movieData.portugueseTitle && (
                  <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                    <ChakraProvider>
                      <TableContainer>
                        <Table size="sm">
                          <Thead></Thead>
                          <Tbody></Tbody>
                        </Table>
                        <Tabs size="md" variant="enclosed">
                          <TabList>
                            {/* <Tab
                              style={{
                                fontFamily: "Helvetica Neue, sans-serif",
                              }}
                            >
                              Average
                            </Tab> */}
                            <Tab
                              style={{
                                fontFamily: "Helvetica Neue, sans-serif",
                              }}
                            >
                              Origin Country
                            </Tab>
                            <Tab
                              style={{
                                fontFamily: "Helvetica Neue, sans-serif",
                              }}
                            >
                              Language
                            </Tab>
                            <Tab
                              style={{
                                fontFamily: "Helvetica Neue, sans-serif",
                              }}
                            >
                              Gender
                            </Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel>{movieData.country}</TabPanel>
                            <TabPanel>{movieData.originalLanguage}</TabPanel>
                            <TabPanel
                              style={{
                                fontFamily: "Helvetica Neue, sans-serif",
                              }}
                            >
                              {" "}
                              {movieData.gender &&
                                movieData.gender.length > 0 &&
                                movieData.gender.map((gender, index) => (
                                  <span key={gender}>
                                    {gender}
                                    {index !== movieData.gender.length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </TableContainer>
                    </ChakraProvider>
                  </div>
                )}
                {movieData.portugueseTitle && (
                  <Link href={destino}>
                    <div className={styles.button}>Details</div>
                  </Link>
                )}
                <br />
                {movieData.portugueseTitle && (
                  <span>
                    <div>
                      <h1>Rate This Tip:</h1>

                      <Rate
                        onChange={handleRateChange}
                        value={starValue}
                        disabled={isRatingSubmitted}
                        count={10}
                      />
                      <br />
                      <Button
                        onClick={() => {
                          handleRatingSubmit();
                          insertLike();
                        }}
                        disabled={isRatingSubmitted}
                      >
                        Submit Rating
                      </Button>

                      {isRatingSubmitted && (
                        <p>Rating submitted successfully!</p>
                      )}
                    </div>
                  </span>
                )}
                <br />
                {likeThanks && <span>Thank you for the response!! 😀 </span>}
                {showBackToTopButton && (
                  <BackToTopButton onClick={scrollToTop} />
                )}
                {movieData.portugueseTitle && (
                  <button onClick={apiCall} className={styles.button}>
                    Try Again{" "}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
