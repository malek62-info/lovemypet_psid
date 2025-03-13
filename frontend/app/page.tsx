"use client"
import { useEffect, useState } from "react";
import Wrapper from "./components/Wrapper";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Appel à l'API FastAPI
    fetch("http://127.0.0.1:8000/")
      .then((response) => response.json()) // Convertir la réponse en JSON
      .then((data) => {
        setMessage(data.message); // Récupère le message de l'API
      })
      .catch((error) => {
        console.error("Erreur lors de l'appel à l'API", error);
      });
  }, []); // [] pour exécuter au moment du premier rendu

  return (
    <Wrapper>
      <h1 className="font-bold">Bienvenue sur Notre application</h1>
      <p>Voici ce que l'api retourne : {message}</p> {/* Affiche le message retourné par l'API */}
    </Wrapper>
  );
}
