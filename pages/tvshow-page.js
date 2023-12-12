import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/router";
import {
  ChakraProvider,
  Progress,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import Head from "next/head";

const MoviePage = () => {
  const router = useRouter();
  const tvShowId = router.query.tvShowId;
  const [movieIdRequest, setMovieIdRequest] = useState();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dataTvShows, setDataTvShows] = useState({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState();
  const [showStatus, setShowStatus] = useState(false);
  const [tvShowSeasonId, setTvShowSeasonId] = useState();
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  useEffect(() => {
    let showId;
    setMovieIdRequest(tvShowId);
    Promise.all([
      fetch(
        // `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`
        `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c`
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/${tvShowId}/watch/providers?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c`
      ),
    ])
      .then(([resMovie, resProviders]) =>
        Promise.all([resMovie.json(), resProviders.json()])
      )
      .then(([dataMovies, dataProviders]) => {
        setData({
          firstEpisodeToAir: dataMovies.first_air_date,
          tvShowName: dataMovies.name,
          poster_path: dataMovies.poster_path,
          overview: dataMovies.overview,
          average: dataMovies.vote_average,
          releaseDate: dataMovies.release_date,
          image: dataMovies.poster_path,
          ratingCount: dataMovies.vote_count,
          popularity: dataMovies.popularity,
          originalTitle: dataMovies.original_name,
          portugueseTitle: dataMovies.name,
          gender: dataMovies.genres
            ? dataMovies.genres.map((genre) => genre.name).join(", ")
            : "",
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
        });
        setIsLoading(false);
      });
  }, [tvShowId, movieIdRequest]);

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

  const CallDataTvShows = () => {
    setShowStatus(true);
    if (!tvShowId) {
      return;
    }
    const url = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c`;
    // const url = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`;

    console.log(tvShowId);
    console.log(url);

    fetch(url, {})
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          setError(true);
          throw console.log("Erro 1");
        }
      })
      .then((result) => {
        const { seasons, created_by } = result;
        setDataTvShows({ seasons, created_by });
        setStatus(result.status);
        setTvShowSeasonId(result.season_number);
      })
      .catch((error) => setError(true));
  };

  return (
    <>
      <Head>
        <title>Tv Show {data.originalTitle ? data.originalTitle : null}</title>
        <meta
          name="keywords"
          content="tvshow,watch,review, series, filmes"
        ></meta>
        <meta name="description" content="filmes, series,"></meta>
      </Head>
      <LoggedUser />
      <span className={styles.title}>{data.originalTitle}</span>
      <br />
      <br />
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <ChakraProvider>
          <Progress
            hasStripe
            value={data.average}
            max={10}
            colorScheme={getProgressColor(data.average)}
          />
        </ChakraProvider>
      </div>
      <br />
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <span>
            <span>
              {poster != null ? (
                // eslint-disable-next-line @next/next/no-img-element
                <Image
                  className={styles.card_image_big}
                  src={poster}
                  alt="poster"
                  width="480"
                  height="720"
                />
              ) : (
                <Image
                  className={styles.card_image_big}
                  src="/callback.png"
                  alt="poster"
                  width="480"
                  height="720"
                />
              )}
            </span>
          </span>
        )}
      </div>
      <div>
        <br />

        {/* Tabela aqui para baixo */}
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            wordBreak: "break-word",
          }}
        >
          <ChakraProvider>
            <TableContainer>
              <Table size="sm">
                <Tbody>
                  {/* <Tr>
                    <Td>Título em Português:</Td>
                    <Td>{data.portugueseTitle}</Td>
                  </Tr> */}
                  <Tr>
                    <Td>Overview:</Td>
                    <Td
                      style={{
                        whiteSpace: "pre-wrap",
                        maxWidth: "480px", // Defina um valor apropriado para o tamanho máximo
                      }}
                    >
                      {data.overview ? data.overview : "No infos"}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Gender</Td>
                    <Td>{data.gender === "Soap" ? "Novel" : data.gender}</Td>
                  </Tr>
                  <Tr>
                    <Td>Number of Votes:</Td>
                    <Td>{data.ratingCount}</Td>
                  </Tr>
                  <Tr>
                    <Td>Rating:</Td>
                    <Td>{data.average}</Td>
                  </Tr>
                  <Tr>
                    <Td>Popularity</Td>
                    <Td>{data.popularity}</Td>
                  </Tr>
                  <Tr>
                    <Td>First Episode On Air</Td>
                    <Td>
                      {data.firstEpisodeToAir
                        ? format(new Date(data.firstEpisodeToAir), "dd/MM/yyyy")
                        : ""}
                    </Td>
                  </Tr>
                  {/* <Tr>
                    <Td>Streamings Brasil:</Td>
                    <Td>{data.providersBR}</Td>
                  </Tr> */}
                  <Tr>
                    <Td>Streamings USA:</Td>
                    <Td>{data.providersUS}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </ChakraProvider>
          <br />

          <button onClick={CallDataTvShows} className={styles.button}>
            Seasons
          </button>
          <br />
        </div>
      </div>
      <br />
      {showStatus ? (
        <span>
          Series Status:{" "}
          {status === "Returning Series"
            ? "Ongoing"
            : status === "Ended"
            ? "Ended"
            : status === "In Production"
            ? "In Production"
            : status === "Canceled"
            ? "Canceled"
            : status === "Pilot"
            ? "Pilot Phase"
            : status === "To Be Determined"
            ? "To Be Determined"
            : "Unknown"}
        </span>
      ) : null}
      <ChakraProvider>
        <div className={styles.grid}>
          {dataTvShows.seasons &&
            dataTvShows.seasons.map(
              (work) =>
                work.season_number !== 0 ? (
                  <div key={work.id} className={styles.gridItem}>
                    <br />
                    <span>
                      S{work.season_number} - Name: {work.name}
                    </span>
                    <br />
                    <span>Number of Episodes: {work.episode_count}</span>
                    <br />
                    <br />
                    <Image
                      className={styles.card_image}
                      src={
                        work.poster_path
                          ? "https://image.tmdb.org/t/p/original" +
                            work.poster_path
                          : "/callback.png"
                      }
                      alt="poster"
                      width="240"
                      height="360"
                    />
                    <br />
                    <div>
                      <Link
                        href={{
                          pathname: "/tvshow-seasons-page",
                          query: {
                            tvShowId: tvShowId,
                            tvShowSeasonId: work.season_number,
                          },
                        }}
                      >
                        <div className={styles.button}>Episodes</div>
                      </Link>
                      <br />
                    </div>
                  </div>
                ) : null // Renderiza nulo se season_number for igual a 0
            )}
        </div>
        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
      </ChakraProvider>
    </>
  );
};

export default MoviePage;
