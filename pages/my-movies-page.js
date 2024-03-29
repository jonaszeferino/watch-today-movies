import { useState, useEffect } from "react";
import {  
  ChakraProvider,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  Spinner,
  Image,
  useMediaQuery,
  Center
} from "@chakra-ui/react";
import { Rate } from "antd";
import { supabase } from "../utils/supabaseClient";
import LoggedUser from "../components/LoggedUser";
import { Button as AntButton, notification, Space } from "antd";
import Head from "next/head";

const MoviePage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedAlterMovie, setSelectedAlterMovie] = useState(null);
  const [valueStartDelete, setValueStartDelete] = useState(false);
  const [valueEndDelete, setValueEndDelete] = useState(false);
  const [isConfirmationMode, setIsConfirmationMode] = useState(false);
  const [session, setSession] = useState(null);
  const [email_user, setEmail_user] = useState();
  const [api, contextHolder] = notification.useNotification();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const [confirmationModeMovieId, setConfirmationModeMovieId] = useState(null);
  const showContentMessage = !session && !isMobile;

  const isConfirmationModeForMovie = (movieId) => {
    return confirmationModeMovieId === movieId;
  };


  console.log("Mail State ", email_user);

  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("Session:", session);
        if (mounted) {
          if (session) {
            setSession(session);
            setEmail_user(session.user.email);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
    }

    getInitialSession();

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth State Change:", session);
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);


  const openNotification = (placement) => {
    api.info({
      message: `Waiting ${email_user}`,
      description:
        "If you provided evaluations for the suggestions, they will appear automatically on the screen.",
      placement,
    });
  };

  const apiGetRates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/getRateRandomMovie?user_email=${email_user}`, {

        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Chamada Profile ", fetch);
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      setData(responseData);
      setIsLoading(false);
      setValueEndDelete(false);
    } catch (error) {
      console.error("Error fetching rates:", error);

    }
  };
  useEffect(() => {
    apiGetRates();
    setValueEndDelete(false);
    openNotification("topRight");
  }, [email_user]);

  const apiDeleteRates = async () => {
    console.log("Delete call ");
    setValueStartDelete(true);
    try {
      const response = await fetch("/api/v1/deleteRateRandomMovie", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: selectedMovie,
          user_email: email_user,
        }),
      });
      setValueStartDelete(false), apiGetRates();
      setValueEndDelete(true);
      setIsConfirmationMode(false);
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  };

  const apiPutRates = async (movieId, rating) => {
    try {
      console.log("Request payload:", {
        movie_id: movieId,
        user_email: email_user,
        rating_by_user: rating,
      });

      const response = await fetch("/api/v1/putRateRandomMovie", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieId,
          user_email: email_user,
          rating_by_user: rating,
        }),
      });

      const responseData = await response.json();
      const statusCode = response.status;

      if (statusCode === 200) {
        apiGetRates();
      } else if (statusCode === 404) {
        console.log("No data");
      } else if (statusCode === 500) {
        console.log("Internal server error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
        {showContentMessage && (
      <p style={{ textAlign: "center" }}>
        Click Log In to load the page content
      </p>
    )}
      {session && !isMobile ? (
        <ChakraProvider>
          <Head>
            <title>My Reviews</title>
            <meta
              name="keywords"
              content="tvshow,watch, series, movies"
            ></meta>
            <meta name="description" content="Movies, TvShows My Rating Movies Tips"></meta>
          </Head>

          <div style={{ paddingTop: 80, }} >
            <LoggedUser />
          </div>

          <>
            {contextHolder}
            <Space></Space>
          </>
          <div
            style={{
              maxWidth: "1500px",
              margin: "0 auto",
              wordBreak: "break-word",
            }}
          >
            <h1>My Likes</h1>
            {valueStartDelete ? (
              <h1>
                Deleting Selected Record <Spinner size="xl" />
              </h1>
            ) : null}

            {valueEndDelete ? <h1>Deleted record</h1> : null}

            {isLoading ? (
              <Spinner size="xl" />
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <TableCaption>Movie Likes</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Movie</Th>
                      <Th>Date</Th>
                      <Th>Rating</Th>
                      <Th>Poster</Th>
                      <Th>
                        {isConfirmationMode ? (
                          <>
                            <Button
                              onClick={apiDeleteRates}
                              colorScheme="red"
                              marginRight={2}
                            >
                              Confirm
                            </Button>
                            <Button
                              onClick={() => setIsConfirmationMode(false)}
                            >
                              Close
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => setIsConfirmationMode(true)}
                            isDisabled={selectedMovie === null}
                            colorScheme={
                              selectedMovie !== null ? "red" : "gray"
                            }
                          >
                            Delete
                          </Button>
                        )}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((movie) => (
                      <Tr key={movie.movieId}>
                        <Td>
                          {movie.original_title}
                          <br />
                        </Td>
                        <Td>
                          {new Date(movie.like_date).toLocaleDateString()}
                        </Td>
                        <Td>
                          <Rate
                            onChange={(rating) => {
                              setSelectedAlterMovie(movie.movie_id);
                              apiPutRates(movie.movie_id, rating);
                            }}
                            value={movie.rating_by_user || 0}
                            count={10}
                          />
                        </Td>
                        <Td>
                          <Image
                            src={
                              movie.poster_path ?
                                "https://image.tmdb.org/t/p/original" +
                                movie.poster_path
                                : "/callback.png"
                            }
                            alt="poster"
                            width={60}
                            height={90}
                            style={{
                              objectFit: "contain",
                              maxHeight: "100%",
                              maxWidth: "100%",
                            }}
                          />
                        </Td>
                        <Td>
                          <Checkbox
                            onChange={() =>
                              setSelectedMovie((prevSelectedMovie) =>
                                prevSelectedMovie === movie.movie_id
                                  ? null
                                  : movie.movie_id
                              )
                            }
                            isChecked={selectedMovie === movie.movie_id}
                            isDisabled={isConfirmationMode}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </div>
        </ChakraProvider>
      ) : (
        null

      )}

      {session && isMobile ? (
        <ChakraProvider>
          <Head>
            <title>My Reviews</title>
            <meta
              name="keywords"
              content="tvshow,watch, series, movies"
            ></meta>
            <meta name="description" content="Movies, TvShows My Rating Movies Tips"></meta>
          </Head>

          <div style={{ paddingTop: 80, }} >
            <LoggedUser />
          </div>

          <>
            {contextHolder}
            <Space></Space>
          </>
          <div
            style={{
              maxWidth: "1500px",
              margin: "0 auto",
              wordBreak: "break-word",
            }}
          >
            <h1>My Likes</h1>
            {valueStartDelete ? (
              <h1>
                Deleting Selected Record <Spinner size="xl" />
              </h1>
            ) : null}

            {valueEndDelete ? <h1>Deleted record</h1> : null}

            {isLoading ? (
              <Spinner size="xl" />
            ) : (
              <div style={{ maxWidth: "100%", overflowX: "auto" }}>


                {/* <div>Mobile version</div> */}
                <TableContainer>
                  <Table variant="simple">
                    <TableCaption>Movie Likes</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Movie / Date / Rating / Poster / Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.map((movie) => (
                        <Tr key={movie.movieId}>
                          <Td>
                            {movie.original_title}
                            <br />
                            {new Date(movie.like_date).toLocaleDateString()}
                            <br />
                            <Rate
                              onChange={(rating) => {
                                setSelectedAlterMovie(movie.movie_id);
                                apiPutRates(movie.movie_id, rating);
                              }}
                              value={movie.rating_by_user || 0}
                              count={10}
                              disabled={isConfirmationModeForMovie(movie.movie_id)}
                            />
                            <Center>
                              <Image
                                src={
                                  movie.poster_path ?
                                    "https://image.tmdb.org/t/p/original" + movie.poster_path
                                    : "/callback.png"
                                }
                                alt="poster"
                                width={90}
                                height={120}
                                style={{
                                  objectFit: "contain",
                                  maxHeight: "100%",
                                  maxWidth: "100%",
                                }}
                              />
                            </Center>


                            <Checkbox
                              onChange={() => {
                                if (selectedMovie === movie.movie_id) {
                                  setSelectedMovie(null);
                                  setConfirmationModeMovieId(null);
                                } else {
                                  setSelectedMovie(movie.movie_id);
                                  setConfirmationModeMovieId(null);
                                }
                              }}
                              isChecked={selectedMovie === movie.movie_id}
                              isDisabled={confirmationModeMovieId === movie.movie_id}
                            />


                            <br />
                            <br />


                            {confirmationModeMovieId === movie.movie_id ? (
                              <>
                                <Button
                                  onClick={apiDeleteRates}
                                  colorScheme="red"
                                  marginRight={2}
                                >
                                  Confirm
                                </Button>
                                <Button onClick={() => setConfirmationModeMovieId(null)}>
                                  Close
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={() => setConfirmationModeMovieId(movie.movie_id)}
                                isDisabled={selectedMovie !== movie.movie_id || confirmationModeMovieId}
                                colorScheme="red"
                              >
                                Delete
                              </Button>
                            )}
                          </Td>
                        </Tr>
                      ))}

                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
        </ChakraProvider>
      ) : (
        null

      )}
    </>
  );
};

export default MoviePage;
