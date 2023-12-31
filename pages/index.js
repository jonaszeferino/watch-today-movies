import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import ErrorPage from "./error-page";
import { ChakraProvider, Progress, Button } from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import { supabase } from "../utils/supabaseClient"; //
import { Tooltip, Rate } from "antd";
import LoggedUser from "../components/LoggedUser";
import LoginAlert from "../components/LoginAlert";


export default function Home() {
  let [searchMovies, setSearchMovies] = useState([]);
  let [page, setPage] = useState(1);
  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [searchTv, setSearchTv] = useState([]);
  const [session, setSession] = useState(null);

  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook

  const urlString = "https://api.themoviedb.org/3/trending/movie/week";

  const apiCall = (currentPage) => {
    const url = urlString;
    setIsLoading(true);

    fetch(url, {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          throw new Error("Wrong data");
        }
      })
      .then((result) => {
        setSearchMovies(result.results);
        setPage(result.page);
        setIsLoading(false);
      })
      .catch((error) => setError(true));
  };

  useEffect(() => {
    apiCall(page);
  }, [page]);

  const urlStringTv = "https://api.themoviedb.org/3/trending/tv/week?";

  const apiCallTv = (currentPage) => {
    const urlTv = urlStringTv;
    setIsLoading(true);

    fetch(urlTv, {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          throw new Error("Wrong data");
        }
      })
      .then((result) => {
        setSearchTv(result.results);
        setIsLoading(false);
      })
      .catch((error) => setError(true));
  };
  useEffect(() => {
    apiCallTv(page);
  }, [page]);

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

  //verificar a sessão
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
        setIsLoading(false);
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
    <div>
      <Head>
        <title>Home</title>
        <meta name="keywords" content="movies,tvshows,"></meta>
        <meta name="description" content="movies,tvshows"></meta>
      </Head>

      <div>
        <LoggedUser />
        <LoginAlert />

        <div>
          <div className={styles.top}>
            <h3 className={styles.title}> Trending Movies of the Week</h3>
          </div>
          <h2 className={styles.label}>
            <br />
            <span className={styles.spantext}>
              {isLoading ? <div>Loading...</div> : " "}
            </span>
          </h2>
          {isError === true ? (
            <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
          ) : (
            <div className={styles.grid}>
              {searchMovies.map((search) => (
                <div key={search.id}>
                  <span className={styles.spantext}></span>{" "}
                  <span
                    className={styles.spantext}
                    style={{
                      position: "relative",
                      display: "block",
                      width: "240px",
                      height: "360px",
                    }}
                  >
                    <Link
                      href={{
                        pathname: "/movie-page",
                        query: { movieId: search.id },
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "240px",
                          height: "360px",
                          display: "block",
                        }}
                      >
                        <Tooltip
                          title="Learn More"
                          style={{
                            color: "white",
                            borderColor: "purple",
                            background: "purple",
                          }}
                        >
                          <Image
                            className={styles.card_image}
                            src={
                              search.poster_path
                                ? `https://image.tmdb.org/t/p/original${search.poster_path}`
                                : "/callback.png"
                            }
                            alt="poster"
                            width={240}
                            height={360}
                          />
                        </Tooltip>

                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            background: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            textAlign: "center",
                            padding: "8px 0",
                            boxSizing: "border-box",
                          }}
                        >
                          {search.title}
                        </span>
                      </div>
                    </Link>
                  </span>
                  <div style={{ maxWidth: "240px", margin: "5px" }}>
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
                          value={search.vote_average}
                          max={10}
                          colorScheme={getProgressColor(search.vote_average)}
                        />
                      </Tooltip>
                    </ChakraProvider>
                    <Rate value={1} count={1} /> {search.vote_average}
                  </div>
                  <br />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.top}>
          <h3 className={styles.title}>Trending TV Shows of the Week</h3>
        </div>
        <div className={styles.grid}>
          {searchTv.map((searchtv) => (
            <div key={searchtv.id}>
              <br />
              <span>
                <Link
                  href={{
                    pathname: "/tvshow-page",
                    query: { tvShowId: searchtv.id },
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "240px",
                      height: "360px",
                      display: "block",
                    }}
                  >
                    <Tooltip
                      title="Learn More"
                      style={{
                        color: "white",
                        borderColor: "purple",
                        background: "purple",
                      }}
                    >
                      <Image
                        className={styles.card_image}
                        src={
                          searchtv.poster_path
                            ? `https://image.tmdb.org/t/p/original${searchtv.poster_path}`
                            : "/callback.png"
                        }
                        alt="poster"
                        width={240}
                        height={360}
                      />
                    </Tooltip>
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        background: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        textAlign: "center",
                        padding: "8px 0",
                        boxSizing: "border-box",
                        maxHeight: "40%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {searchtv.original_name}
                    </span>
                  </div>
                </Link>
              </span>
              <div style={{ maxWidth: "240px", margin: "5px" }}>
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
                      value={searchtv.vote_average}
                      max={10}
                      colorScheme={getProgressColor(searchtv.vote_average)}
                    />
                  </Tooltip>
                </ChakraProvider>
                <Rate value={1} count={1} /> {searchtv.vote_average}
              </div>
              <br />
            </div>
          ))}
        </div>

        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
      </div>
    </div>
  );
}

// new commit
