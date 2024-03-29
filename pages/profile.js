import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Box,
  Button,
  Input,
  Text,
  ChakraProvider,
  Center,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Image,
} from "@chakra-ui/react";
import { supabase } from "../utils/supabaseClient";
import { Divider as DividerAntd } from "antd";
import { Alert, Space, Spin } from "antd";
import Auth from "../components/Auth";
import Head from "next/head";

const Profile = () => {
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [birthDate, setBirthDate] = useState();
  const [nationality, setNationality] = useState();
  const [gender, setGender] = useState();
  const [firstFavoriteMovie, setFirstFavoriteMovie] = useState();
  const [secondFavoriteMovie, setSecondFavoriteMovie] = useState();
  const [thirdFavoriteMovie, setThirdFavoriteMovie] = useState();
  const [firstFavoriteTvShow, setFirstFavoriteTvShow] = useState();
  const [secondFavoriteTvShow, setSecondFavoriteTvShow] = useState();
  const [thirdFavoriteTvShow, setThirdFavoriteTvShow] = useState();
  const [favoriteMovieGender, setFavoriteMovieGender] = useState();
  const [favoriteTvShowGender, setFavoriteTvShowGender] = useState();
  const [favoriteDirecting, setFavoriteDirecting] = useState();
  const [favoriteActor, setFavoriteActor] = useState();
  const [favoriteActress, setFavoriteActress] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    surname: "",
    birthDate: "",
    nationality: "",
    gender: "",
    firstFavoriteMovie: "",
    secondFavoriteMovie: "",
    thirdFavoriteMovie: "",
    firstFavoriteTvShow: "",
    secondFavoriteTvShow: "",
    thirdFavoriteTvShow: "",
    favoriteMovieGender: "",
    favoriteTvShowGender: "",
    favoriteDirecting: "",
    favoriteActor: "",
    favoriteActress: "",
    selectedImage: "",
  });

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInfo, setEmailInfo] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const [userData, setUserData] = useState(null);

  const [nameEdit, setNameEdit] = useState(true);
  const [surnameEdit, setSurnameEdit] = useState(true);
  const [birthDateEdit, setBirthDateEdit] = useState(true);
  const [nationalityEdit, setNationalityEdit] = useState(true);
  const [genderEdit, setGenderEdit] = useState(true);
  const [firstFavoriteMovieEdit, setFirstFavoriteMovieEdit] = useState(true);
  const [secondFavoriteMovieEdit, setSecondFavoriteMovieEdit] = useState(true);
  const [thirdFavoriteMovieEdit, setThirdFavoriteMovieEdit] = useState(true);
  const [firstFavoriteTvShowEdit, setFirstFavoriteTvShowEdit] = useState(true);
  const [secondFavoriteTvShowEdit, setSecondFavoriteTvShowEdit] =
    useState(true);

  const [thirdFavoriteTvShowEdit, setThirdFavoriteTvShowEdit] = useState(true);
  const [favoriteMovieGenderEdit, setFavoriteMovieGenderEdit] = useState(true);
  const [favoriteTvShowGenderEdit, setFavoriteTvShowGenderEdit] =
    useState(true);
  const [favoriteDirectingEdit, setFavoriteDirectingEdit] = useState(true);
  const [favoriteActorEdit, setFavoriteActorEdit] = useState(true);
  const [favoriteActressEdit, setFavoriteActressEdit] = useState(true);
  const [imageFromProfile, setImageFromProfile] = useState("");

  const imageOptions = {
    "Choose you Avatar": "perfil_0.jpeg",
    "Perfil 1": "perfil_1.png",
    "Perfil 2": "perfil_2.png",
    "Perfil 3": "perfil_3.png",
    "Perfil 4": "perfil_4.png",
    "Perfil 5": "perfil_5.png",
    "Perfil 6": "perfil_6.png",
    "Perfil 7": "perfil_7.png",
    "Perfil 8": "perfil_8.png",
    "Perfil 9": "perfil_9.png",
    "Perfil 10": "perfil_10.png",
    "Perfil 11": "perfil_11.png",
    "Perfil 12": "perfil_12.png",
  };

  const showSearchBar = false;

  const [newUser, setNewUser] = useState();

  useEffect(() => {
    if (emailInfo || isSave === true) {
      getUser();
      setIsLoading(true);
    }
  }, [emailInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await insertUser();
  };

  dayjs.extend(customParseFormat);

  const insertUser = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/v1/putProfileData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInfo,
          name: name || userData.name || null,
          surname: surname || userData.surname || null,
          nationality: nationality || userData.nationality || null,
          birth_date: birthDate || userData.birth_date || null,
          gender: gender || userData.gender || null,
          first_favorite_movie:
            firstFavoriteMovie || userData.first_favorite_movie || null,
          second_favorite_movie:
            secondFavoriteMovie || userData.second_favorite_movie || null,
          third_favorite_movie:
            thirdFavoriteMovie || userData.third_favorite_movie || null,
          favorite_movie_genre:
            favoriteMovieGender || userData.favorite_movie_genre || null,
          first_favorite_tvshow:
            firstFavoriteTvShow || userData.first_favorite_tvshow || null,
          second_favorite_tvshow:
            secondFavoriteTvShow || userData.second_favorite_tvshow || null,
          third_favorite_tvshow:
            thirdFavoriteTvShow || userData.third_favorite_tvshow || null,
          favorite_tvshow_genre:
            favoriteTvShowGender || userData.favorite_tvshow_genre || null,
          favorite_actor: favoriteActor || userData.favorite_actor || null,
          favorite_actress:
            favoriteActress || userData.favorite_actress || null,
          favorite_directing:
            favoriteDirecting || userData.favorite_directing || null,
          avatar: imageFromProfile || userData.avatar || "perfil_0.jpeg",
        }),
      });
      setIsSaving(false);
      setIsSave(true);
      getUser();

      return;
    } catch (error) {
      console.error(error);
      console.log("erro", error);
    }
  };

  const getUser = async () => {
    const url = `/api/v1/getProfileData?email=${encodeURIComponent(emailInfo)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();

        setIsLoading(false);
        setUserData(userData);
        setDateString(userData.birth_date);
        setFavoriteActressEdit(true);
        setName(userData.name);
      } else {
        if (response.status === 404) {
          console.log("User not found");
          setIsLoading(false);
          setNewUser(true);
        }
        console.error("Error to find user", response.status);
        I;
      }
    } catch (error) {
      console.error("Error Unexpected", error);
    }
  };

  // Verify the session
  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
          setEmailInfo(session.user.email);
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
    <ChakraProvider>
      <Head>
        <title>Profile</title>
        <meta name="keywords" content="tvshow,watch,review"></meta>
        <meta name="description" content="Movies, TvShows Profile Page"></meta>
      </Head>


      <div style={{ paddingTop: 80, }} >
      <ChakraProvider>
        {session ? (
          <p>

            User: {emailInfo} <br />
            <Button
              onClick={() => supabase.auth.signOut()}
              colorScheme="red"
              size="sm"
            >
              Sign Out
            </Button>
          </p>
        ) : null}
      </ChakraProvider>
      </div>
      {isLoading && (
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          <Spin tip="Loading..."></Spin>
          <Alert message="Waiting" description="Waiting the data" type="info" />
        </Space>
      )}

      <br />

      {session ? (
        <Box p={4} style={{ maxWidth: "400px", margin: "0 auto" }}>
          {!isLoading && (
            <>
              <Heading size="lg" mb={4} style={{ color: "#7657be" }}>
                Profile{" "}
              </Heading>
              {newUser && (
                <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Alert
                      message="Click Edit and Enter Your Data Below"
                      type="success"
                      showIcon
                      closable
                    />
                    <Button
                      onClick={() => (
                        setNameEdit(!nameEdit),
                        setSurnameEdit(!surnameEdit),
                        setBirthDateEdit(!birthDateEdit),
                        setNationalityEdit(!nationalityEdit),
                        setGenderEdit(!genderEdit),
                        setFirstFavoriteMovieEdit(!firstFavoriteMovieEdit),
                        setSecondFavoriteMovieEdit(!secondFavoriteMovieEdit),
                        setThirdFavoriteMovieEdit(!thirdFavoriteMovieEdit),
                        setFirstFavoriteTvShowEdit(!firstFavoriteTvShowEdit),
                        setSecondFavoriteTvShowEdit(!secondFavoriteTvShowEdit),
                        setThirdFavoriteTvShowEdit(!thirdFavoriteTvShowEdit),
                        setFavoriteMovieGenderEdit(!favoriteMovieGenderEdit),
                        setFavoriteTvShowGenderEdit(!favoriteTvShowGenderEdit),
                        setFavoriteDirectingEdit(!favoriteDirectingEdit),
                        setFavoriteActorEdit(!favoriteActorEdit),
                        setFavoriteActressEdit(!favoriteActressEdit)
                      )}
                      colorScheme={favoriteActressEdit ? "red" : "green"}
                      type="submit"
                      style={{ width: "100%" }}
                    >
                      {favoriteActressEdit
                        ? "Edit"
                        : "Enter the Data, Then Click Save"}
                    </Button>
                  </Space>
                </div>
              )}

              <VStack style={{ color: "#7657be" }}>
     
               <FormControl>
                  <FormLabel style={{ fontWeight: "bold" }}>E-mail:</FormLabel>
                  <Text
                    style={{
                      width: "100%",
                      border: "1px solid #ccc",
                      padding: "8px",
                      borderRadius: "5px",
                      borderColor: "#cbd5e0",
                    }}
                  >
                    {emailInfo}
                  </Text>
                </FormControl>

                <>
                  {/* Name */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>Name:</FormLabel>
                    {nameEdit && (
                      <Input
                        isDisabled={nameEdit}
                        type="text"
                        name="firstName"
                        value={userData?.name}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!nameEdit && (
                      <Input
                        placeholder={userData?.name || "Name"}
                        isDisabled={nameEdit}
                        type="text"
                        name="firstName"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* Surname */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Surname:
                    </FormLabel>
                    {surnameEdit && (
                      <Input
                        isDisabled={surnameEdit}
                        type="text"
                        name="surname"
                        value={userData?.surname}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!surnameEdit && (
                      <Input
                        placeholder={userData?.surname || "Enter your Surname"}
                        isDisabled={surnameEdit}
                        type="text"
                        name="surname"
                        value={surname}
                        onChange={(e) => {
                          setSurname(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* nacionalidade */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Nationality
                    </FormLabel>
                    {nationalityEdit && (
                      <Input
                        isDisabled={nationalityEdit}
                        type="text"
                        name="nationality"
                        value={userData?.nationality}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!nationalityEdit && (
                      <Input
                        placeholder={
                          userData?.nationality || "Enter your nationality"
                        }
                        isDisabled={nationalityEdit}
                        type="text"
                        name="nationality"
                        value={nationality}
                        onChange={(e) => {
                          setNationality(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* Data de Nascimento */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Birthdate:
                    </FormLabel>
                    {birthDateEdit && (
                      <Input
                        isDisabled={birthDateEdit}
                        type="text"
                        name="nationality"
                        value={userData?.birth_date}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!birthDateEdit && (
                      <Input
                        placeholder={
                          userData?.birth_date || "Enter your birth dd/mm/aaaa"
                        }
                        isDisabled={birthDateEdit}
                        type="text"
                        name="nationality"
                        value={birthDate}
                        onChange={(e) => {
                          setBirthDate(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>Gender</FormLabel>
                    {genderEdit && (
                      <Input
                        isDisabled={genderEdit}
                        type="text"
                        name="gender"
                        value={userData?.gender}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!genderEdit && (
                      <Select
                        isDisabled={genderEdit}
                        name="gender"
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      >
                        <option value={userData?.gender || "Choose Gender"}>
                          {userData?.gender || "Choose Gender"}
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non Binary">Non-binary</option>
                        <option value="Prefer not to provide">
                          Prefer not to provide
                        </option>
                      </Select>
                    )}
                  </FormControl>

                  <Center>
                    <DividerAntd>My Preferences</DividerAntd>
                  </Center>

                  {/* Filmes Favoritos */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Movies
                    </FormLabel>

                    {/* first movie     */}
                    {firstFavoriteMovieEdit && (
                      <Input
                        isDisabled={firstFavoriteMovieEdit}
                        type="text"
                        name="favoriteFirstMovie"
                        value={userData?.first_favorite_movie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!firstFavoriteMovieEdit && (
                      <Input
                        isDisabled={firstFavoriteMovieEdit}
                        placeholder={
                          userData?.first_favorite_movie ||
                          "First Favorite Movie"
                        }
                        type="text"
                        name="favoriteFirstMovie"
                        onChange={(e) => {
                          setFirstFavoriteMovie(e.target.value);
                        }}
                        value={firstFavoriteMovie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}

                    {/* second movie     */}
                    {secondFavoriteMovieEdit && (
                      <Input
                        isDisabled={secondFavoriteMovieEdit}
                        type="text"
                        name="favoriteSecondMovie"
                        value={userData?.second_favorite_movie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!secondFavoriteMovieEdit && (
                      <Input
                        isDisabled={secondFavoriteMovieEdit}
                        placeholder={
                          userData?.second_favorite_movie ||
                          "Second Favorite Movie"
                        }
                        type="text"
                        name="favoriteSecondMovie"
                        onChange={(e) => {
                          setSecondFavoriteMovie(e.target.value);
                        }}
                        value={secondFavoriteMovie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}

                    {/* third movie  */}
                    {thirdFavoriteMovieEdit && (
                      <Input
                        isDisabled={thirdFavoriteMovieEdit}
                        type="text"
                        name="favoriteThirdMovie"
                        value={userData?.third_favorite_movie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!thirdFavoriteMovieEdit && (
                      <Input
                        isDisabled={thirdFavoriteMovieEdit}
                        placeholder={
                          userData?.third_favorite_movie ||
                          "Third Favorite Movie"
                        }
                        type="text"
                        name="favoriteThirdMovie"
                        onChange={(e) => {
                          setThirdFavoriteMovie(e.target.value);
                        }}
                        value={thirdFavoriteMovie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                  </FormControl>

                  {/* Genero de filme       */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Movie Genre
                    </FormLabel>

                    {favoriteMovieGenderEdit && (
                      <Input
                        isDisabled={favoriteMovieGenderEdit}
                        type="text"
                        name="favoriteMovieGender"
                        value={userData?.favorite_movie_genre}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteMovieGenderEdit && (
                      <Select
                        isDisabled={favoriteMovieGenderEdit}
                        name="favoriteMovieGender"
                        value={favoriteMovieGender}
                        onChange={(e) => {
                          setFavoriteMovieGender(e.target.value);
                        }}
                        style={{ width: "100%", color: "gray" }}
                      >
                        <option
                          value={
                            userData?.favorite_movie_genre ||
                            "Enter favorite movie genre"
                          }
                        >
                          {userData?.favorite_movie_genre ||
                            "Enter favorite movie genre"}{" "}
                        </option>

                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Fantasia">Fantasia</option>
                        <option value="Horror">Horror</option>
                        <option value="Suspense">Suspense</option>
                        <option value="Romance">Romance</option>
                        <option value="Documentaries">Documentaries</option>
                      </Select>
                    )}
                  </FormControl>

                  {/* Series Favoritas */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Tv Shows
                    </FormLabel>

                    {firstFavoriteTvShowEdit && (
                      <Input
                        isDisabled={firstFavoriteTvShowEdit}
                        type="text"
                        name="favoriteFirstTvShow"
                        value={userData?.first_favorite_tvshow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!firstFavoriteTvShowEdit && (
                      <Input
                        isDisabled={firstFavoriteTvShowEdit}
                        placeholder={
                          userData?.first_favorite_tvshow ||
                          "First Favorite Tv Show"
                        }
                        type="text"
                        name="favoriteFirstTvShow"
                        onChange={(e) => {
                          setFirstFavoriteTvShow(e.target.value);
                        }}
                        value={firstFavoriteTvShow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}

                    {secondFavoriteTvShowEdit && (
                      <Input
                        isDisabled={secondFavoriteTvShowEdit}
                        type="text"
                        name="favoriteSecondTvShow"
                        value={userData?.second_favorite_tvshow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!secondFavoriteTvShowEdit && (
                      <Input
                        isDisabled={secondFavoriteTvShowEdit}
                        placeholder={
                          userData?.second_favorite_tvshow ||
                          "Second Favorite TV Show"
                        }
                        type="text"
                        name="favoriteFirstTvShow"
                        onChange={(e) => {
                          setSecondFavoriteTvShow(e.target.value);
                        }}
                        value={secondFavoriteTvShow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}

                    {thirdFavoriteTvShowEdit && (
                      <Input
                        isDisabled={thirdFavoriteTvShowEdit}
                        type="text"
                        name="favoriteThirdTvShow"
                        value={userData?.third_favorite_tvshow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!thirdFavoriteTvShowEdit && (
                      <Input
                        isDisabled={thirdFavoriteTvShowEdit}
                        placeholder={
                          userData?.third_favorite_tvshow ||
                          "Third Favorite TvShow"
                        }
                        type="text"
                        name="favoriteThirdTvShow"
                        onChange={(e) => {
                          setThirdFavoriteTvShow(e.target.value);
                        }}
                        value={thirdFavoriteTvShow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                  </FormControl>

                  {/* genero de serie favorita */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Tv Show Genre
                    </FormLabel>

                    {favoriteTvShowGenderEdit && (
                      <Input
                        isDisabled={favoriteTvShowGenderEdit}
                        type="text"
                        name="favoriteTvShowGender"
                        value={userData?.favorite_tvshow_genre}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteTvShowGenderEdit && (
                      <Select
                        isDisabled={favoriteTvShowGenderEdit}
                        name="favoriteTvShowGender"
                        value={favoriteTvShowGender}
                        onChange={(e) => {
                          setFavoriteTvShowGender(e.target.value);
                        }}
                        style={{ width: "100%", color: "gray" }}
                      >
                        <option
                          value={
                            userData?.favorite_tvshow_genre ||
                            "Enter Favorite Tv Show Gender"
                          }
                        >
                          {userData?.favorite_tvshow_genre ||
                            "Enter Favorite Movie Gender"}
                        </option>

                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Fantasia">Fantasia</option>
                        <option value="Horror">Horror</option>
                        <option value="Suspense">Suspense</option>
                        <option value="Romance">Romance</option>
                        <option value="Documentaries">Documentaries</option>
                      </Select>
                    )}
                  </FormControl>

                  {/* Ator favorito */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Actor
                    </FormLabel>
                    {favoriteActorEdit && (
                      <Input
                        isDisabled={favoriteActorEdit}
                        type="text"
                        name="favoriteActor"
                        value={userData?.favorite_actor}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteActorEdit && (
                      <Input
                        placeholder={
                          userData?.favorite_actor || "Enter favorite actor"
                        }
                        isDisabled={favoriteActorEdit}
                        type="text"
                        name="favoriteActor"
                        value={favoriteActor}
                        onChange={(e) => {
                          setFavoriteActor(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>
                  {/* Atriz favorita */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Actress
                    </FormLabel>

                    {favoriteActressEdit && (
                      <Input
                        isDisabled={favoriteActressEdit}
                        type="text"
                        name="favoriteActress"
                        value={userData?.favorite_actress}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteActressEdit && (
                      <Input
                        placeholder={
                          userData?.favorite_actress || "Enter favorite Actress"
                        }
                        isDisabled={favoriteActressEdit}
                        type="text"
                        name="favoriteActress"
                        value={favoriteActress}
                        onChange={(e) => {
                          setFavoriteActress(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* Direcao */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Direction
                    </FormLabel>

                    {favoriteDirectingEdit && (
                      <Input
                        isDisabled={favoriteDirectingEdit}
                        type="text"
                        name="favoriteDirecting"
                        value={userData?.favorite_directing}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteDirectingEdit && (
                      <Input
                        placeholder={
                          userData?.favorite_directing ||
                          "Digite o Direção Favorita"
                        }
                        isDisabled={favoriteDirectingEdit}
                        type="text"
                        name="favoriteActress"
                        value={favoriteDirecting}
                        onChange={(e) => {
                          setFavoriteDirecting(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>
                </>

                <Button
                  onClick={() => insertUser()}
                  colorScheme="blue"
                  type="submit"
                  style={{ width: "100%" }}
                  isDisabled={favoriteActressEdit}
                >
                  Salve
                </Button>

                {isSaving && (
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Spin tip="Loading.."></Spin>
                    <Alert
                      message="Waiting"
                      description="Your Data is Being Saved"
                      type="info"
                    />
                  </Space>
                )}

                {isSave && (
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Alert
                      message="Sucessfuly"
                      type="success"
                      showIcon
                      closable
                    />
                  </Space>
                )}

                <Button
                  onClick={() => (
                    setNameEdit(!nameEdit),
                    setSurnameEdit(!surnameEdit),
                    setBirthDateEdit(!birthDateEdit),
                    setNationalityEdit(!nationalityEdit),
                    setGenderEdit(!genderEdit),
                    setFirstFavoriteMovieEdit(!firstFavoriteMovieEdit),
                    setSecondFavoriteMovieEdit(!secondFavoriteMovieEdit),
                    setThirdFavoriteMovieEdit(!thirdFavoriteMovieEdit),
                    setFirstFavoriteTvShowEdit(!firstFavoriteTvShowEdit),
                    setSecondFavoriteTvShowEdit(!secondFavoriteTvShowEdit),
                    setThirdFavoriteTvShowEdit(!thirdFavoriteTvShowEdit),
                    setFavoriteMovieGenderEdit(!favoriteMovieGenderEdit),
                    setFavoriteTvShowGenderEdit(!favoriteTvShowGenderEdit),
                    setFavoriteDirectingEdit(!favoriteDirectingEdit),
                    setFavoriteActorEdit(!favoriteActorEdit),
                    setFavoriteActressEdit(!favoriteActressEdit)
                  )}
                  colorScheme={favoriteActressEdit ? "red" : "green"}
                  type="submit"
                  style={{ width: "100%" }}
                >
                  {favoriteActressEdit
                    ? "Edit"
                    : "After Editing, Click Save Above"}
                </Button>

                <Text>{message}</Text>
              </VStack>
            </>
          )}
        </Box>
      ) : (
        <Auth />
      )}
    </ChakraProvider>
  );
};

//teste

export default Profile;
