import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_DATA, TOKEN_KEY, LOGGED, USER_ID } from "../constants/constants";
import DatabaseController from "../database/controllers/DatabaseController";
import api from "../services/api";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#8235FF",
    accent: "#B30FFF",
  },
};

const AuthContext = createContext({ signed: false, user: {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tutorial, setTutorial] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem(USER_DATA);
      const storageToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storageTutorial = await AsyncStorage.getItem("@Config:tutorial");

      if (storageTutorial != null) {
        setTutorial(true);
      }

      if (storageUser) {
        let perfil = JSON.parse(storageUser);
        if (perfil.tipo_perfil === '1' || perfil.tipo_perfil === '3') {
          setAdmin(true);
        }else{
          setAdmin(false);
        }
      }

      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      } else if (!storageUser && !storageToken) {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  async function signIn(token, user) {
    if (user) {
      await AsyncStorage.setItem(USER_DATA, JSON.stringify(user));
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_ID, JSON.stringify(user.id));

      if (user.tipo_perfil === '1' || user.tipo_perfil === '3') {
        setAdmin(true);
      }else{
        setAdmin(false);
      }
    }

    await DatabaseController.createUsuario(user);

    setUser(user);
  }

  async function finishTutorial() {
    await AsyncStorage.setItem("@Config:tutorial", "true");
    setTutorial(true);
  }

  async function signOut() {
    setLoading(true);
    try {
      setAdmin(false);
      setTutorial(false);
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const res = await api.post(`/humanresources/disconnect?token=${token}`);
      if (res.data.status === 2) {
        await AsyncStorage.clear();
        setUser(null);
      }
      if (res.data.status === 0) {
        Alert.alert("AVISO", res.data.mensagem, [{ text: "OK" }], {
          cancelable: false,
        });
        return;
      }
      await AsyncStorage.clear();
      setUser(null);

      await AsyncStorage.setItem("@Config:tutorial", "true");
      setTutorial(true);
    } catch (error) {
      Alert.alert(
        "AVISO",
        "Falha ao efetuar o log-off, Entre em contato com o suporte técnico",
        [{ text: "OK" }],
        {
          cancelable: false,
        }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider
        value={{
          signed: !!user,
          user,
          signIn,
          signOut,
          finishTutorial,
          tutorial,
          admin,
          loading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </PaperProvider>
  );
};

export default AuthContext;
