import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/router";
import TranslationComponent from "../components/translateComponent";
import TranslationComponentCountryName from "../components/translateComponentCountryName";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import {
  ChakraProvider,
  Progress,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import Head from "next/head";
import { Rate } from "antd";
import { Tooltip } from "antd";

const MoviePage = () => {
  const router = useRouter();
  const { query } = router.query;
  const movieId = router.query.movieId;
  const [movieIdRequest, setMovieIdRequest] = useState();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  useEffect(() => {
    setMovieIdRequest(movieId);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
    });

    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieIdRequest}`, {
        headers,
      }),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieIdRequest}/watch/providers`,
        headers
      ),
      fetch(`https://api.themoviedb.org/3/movie/${movieIdRequest}/credits`, {
        headers,
      }),
    ])
      .then(([resMovie, resProviders, resCredits]) =>
        Promise.all([resMovie.json(), resProviders.json(), resCredits.json()])
      )
      .then(([dataMovies, dataProviders, resCredits]) => {
        if (!Array.isArray(resCredits.crew) || resCredits.crew.length === 0) {
          console.log("Invalid data");
          return;
        }

        const directors = resCredits.crew
          .filter((member) => member.job === "Director")
          .map((director) => {
            return {
              id: director.id,
              name: director.name,
            };
          });

        setData({
          directors: directors && directors.length > 0 ? directors : null,
          budget: dataMovies.budget,
          originalTitle: dataMovies.original_title,
          portugueseTitle: dataMovies.title,
          poster_path: dataMovies.poster_path,
          overview: dataMovies.overview,
          average: dataMovies.vote_average,
          releaseDate: dataMovies.release_date,
          image: dataMovies.poster_path,
          ratingCount: dataMovies.vote_count,
          popularity: dataMovies.popularity,
          gender: dataMovies.genres
            ? dataMovies.genres.map((genre) => genre.name).join(", ")
            : "",
          adult: dataMovies.adult,
          imdb: dataMovies.imdb_id,
          providersBR: dataProviders.results
            ? dataProviders.results.BR
              ? dataProviders.results.BR.flatrate
                ? dataProviders.results.BR.flatrate
                    .map((providerBR) => providerBR.provider_name)
                    .join(", ")
                : ""
              : ""
            : "",

          providersUS: dataProviders.results
            ? dataProviders.results.US
              ? dataProviders.results.US.flatrate
                ? dataProviders.results.US.flatrate
                    .map((providerUS) => providerUS.provider_name)
                    .join(", ")
                : ""
              : ""
            : "",

          country:
            dataMovies.production_countries &&
            dataMovies.production_countries[0]
              ? dataMovies.production_countries[0].name
              : "",
          originalLanguage: dataMovies.original_language,
        });
        setIsLoading(false);
      });
  }, [movieId, movieIdRequest]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  let poster = "/callback.png";

  if (data.poster_path) {
    poster = "https://image.tmdb.org/t/p/original" + data.poster_path;
  }

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

  return (
    <>
      {" "}
      <Head>
        <title>Movie {data.originalTitle ? data.originalTitle : null}</title>
        <meta
          name="keywords"
          content="tvshow,watch,review, series, filmes"
        ></meta>
        <meta name="description" content="filmes, series,"></meta>
      </Head>
      <LoggedUser />
      <span className={styles.title}>{data.originalTitle}</span>
      <br />
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <span>
            <Image
              className={styles.card_image_big}
              src={poster || "/callback.png"}
              alt="poster"
              width="480"
              height="720"
              objectFit="contain"
              maxHeight="720px"
              maxWidth="480px"
            />
          </span>
        )}
      </div>
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
              value={data.average}
              max={10}
              colorScheme={getProgressColor(data.average)}
            />
          </Tooltip>
        </ChakraProvider>
        <Rate value={1} count={1} />  {data.average} / {data.ratingCount} 
      </div>
      <br />
      <div
        style={{ maxWidth: "480px", margin: "0 auto", wordBreak: "break-word" }}
      >
        <ChakraProvider>
          <TableContainer>
            <Table size="sm">
              <Tbody>
                <Tr>
                  <Th>
                    {data.budget === 0 || data.budget === null
                      ? null
                      : `Budget:`}
                  </Th>
                  <Td>
                    {" "}
                    {data.budget === 0 || data.budget === null
                      ? null
                      : `${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(data.budget)}`}
                  </Td>
                </Tr>
                <Tr>
                  <Th>Overview</Th>
                  <Td
                    style={{
                      whiteSpace: "pre-wrap",
                      maxWidth: "480px", // Defina um valor apropriado para o tamanho máximo
                    }}
                  >
                    {data.overview ? data.overview : "No Infos"}
                  </Td>
                </Tr>
                <Tr>
                  <Th>Direction</Th>
                  <Td>
                    {data.directors ? (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {data.directors.map((director, index) => (
                          <li key={index}>
                            <Link
                              href={{
                                pathname: "/person-page",
                                query: { personId: director.id },
                              }}
                              legacyBehavior
                            >
                              <a style={{ color: "blue" }}>{director.name}</a>
                            </Link>{" "}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Informations"
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Th>IMDB</Th>
                  <Td>https://www.imdb.com/title/{data.imdb}</Td>
                </Tr>
                <Tr>
                  <Th>Country of Origin</Th>
                  <Td>{data.country}</Td>
                </Tr>
                <Tr>
                  <Th>Language</Th>
                  <Td>{data.originalLanguage}</Td>
                </Tr>
                <Tr>
                  <Th>Release Date</Th>
                  <Td>
                    {data.releaseDate
                      ? format(new Date(data.releaseDate), " dd/MM/yyyy")
                      : ""}
                  </Td>
                </Tr>
                <Tr>
                  <Th>Popularity</Th>
                  <Td>{data.popularity}</Td>
                </Tr>
                <Tr>
                  <Th>Genre</Th>
                  <Td
                    style={{
                      whiteSpace: "pre-wrap",
                      maxWidth: "480px", 
                    }}
                  >
                    {data.gender}
                  </Td>
                </Tr>
                <Tr>
                  <Th>Streamings USA</Th>
                  <Td
                    style={{
                      whiteSpace: "pre-wrap",
                      maxWidth: "480px", // Defina um valor apropriado para o tamanho máximo
                    }}
                  >
                    {data.providersUS}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </ChakraProvider>
        <div />
        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
      </div>
    </>
  );
};

export default MoviePage;
