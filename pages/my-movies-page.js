import { useState, useEffect, useCallback } from "react";
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
} from "@chakra-ui/react";
import { Rate } from "antd";
import { supabase } from "../utils/supabaseClient"; // Importe o supabase aqui
import LoggedUser from "../components/LoggedUser";
import { RadiusUprightOutlined } from "@ant-design/icons";
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

  const openNotification = (placement) => {
    api.info({
      message: `Waiting ${email_user}`,
      description:
        "If you provided evaluations for the suggestions, they will appear automatically on the screen.",
      placement,
    });
  };

  const apiGetRates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/getRateRandomMovie?user_email=${parseInt(email_user)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setValueEndDelete(false);
    }
  }, [email_user]);

  useEffect(() => {
    apiGetRates();
    setValueEndDelete(false);
    openNotification("topRight");
  }, [apiGetRates, openNotification]);

  const apiDeleteRates = async () => {
    console.log("Chamou client side");
    setValueStartDelete(true);
    try {
      const response = await fetch("/api/v1/deleteRateRandomMovie", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: selectedMovie,
          user_email: user_email,
        }),
      });
      setValueStartDelete(false), apiGetRates();
      setValueEndDelete(true);
      setIsConfirmationMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  const apiPutRates = async (movieId, rating) => {
    try {
      console.log("Request payload:", {
        movie_id: movieId,
        user_email: user_email,
        rating_by_user: rating,
      });

      const response = await fetch("/api/v1/putRateRandomMovie", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieId,
          user_email: user_email,
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
          setEmail_user(session.user.email);
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
    <>
      {session ? (
        <ChakraProvider>
          <Head>
            <title>My Reviews</title>
            <meta
              name="keywords"
              content="tvshow,watch,review, series, filmes"
            ></meta>
            <meta name="description" content="filmes, series,"></meta>
          </Head>
          <LoggedUser />

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
                            disabled={selectedMovie === null}
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
                          {/* <span>{movie.portuguese_title}</span> */}
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
                              movie.poster_path !== "/callback_gray.png"
                                ? "https://image.tmdb.org/t/p/original" +
                                  movie.poster_path
                                : "/callback_gray.png"
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
        "Click Log In to load the page content"
      )}
    </>
  );
};

export default MoviePage;
