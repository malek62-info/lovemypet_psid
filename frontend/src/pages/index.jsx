import AnimalTypeChart from "../AnimalTypeChart";
import AgeDistributionChart from "../AgeDistributionChart";
import Wrapper from "../components/Wrapper";
import { CornerDownRight } from "lucide-react";

export default function Home() {
  return (
    <Wrapper>
      <div>
        {/* En-tête */}
        <section className="my-6">
          <h1 className="text-primary font-bold text-5xl text-center my-4">
            LoveMyPet
          </h1>
          <p className=" text-center text-lg mb-4 text-gray-400">
          Grâce à la puissance des données et de l’intelligence artificielle,<br /> nous analysons les facteurs qui influencent l’adoption des animaux abandonnés 🐶🐱
          </p>
        </section>

        {/* Contexte */}
        <div className="md:flex justify-center">
          <section className="p-5 border-1 border-base-300 rounded-3xl md:w-1/2 ">
            <div className="badge badge-soft badge-primary badge-lg mb-5">
              Contexte
            </div>
            <p className=" ">
              Chaque année, des millions d'animaux errants se retrouvent sans
              foyer et risquent l’euthanasie en raison du manque d’adoptions. Ce
              problème soulève une question cruciale en matière de bien-être
              animal : comment augmenter leurs chances d’être adoptés rapidement
              ?
            </p>
            <p className="mt-3">
              L'essor des technologies d’intelligence artificielle et d’analyse
              de données ouvre de nouvelles perspectives pour améliorer ce
              processus. En exploitant les informations disponibles sur les
              profils d’animaux – descriptions textuelles, caractéristiques
              tabulaires et images – il devient possible d’identifier les
              éléments qui influencent le temps d’adoption. Une meilleure
              compréhension de ces facteurs peut permettre d’optimiser la
              présentation des animaux et d’accélérer leur adoption.
            </p>
          </section>

          {/* Objectifs */}
          <section className="p-5 border-1 border-base-300 rounded-3xl md:w-1/2 md:ml-4 mt-4 md:mt-0">
            <div className="badge badge-soft badge-primary badge-lg mb-5">
              Objectifs
            </div>
            <p className="my-4">
              Ce projet vise à appliquer des techniques d’analyse de données et
              de machine learning pour prédire la rapidité d’adoption des
              animaux en fonction des informations disponibles sur leurs
              profils.
            </p>
            <ul className="list-disc pl-6">
              <li>
                Préparer et nettoyer les données pour garantir leur fiabilité et
                leur exploitabilité.
              </li>
              <li>
                Réaliser des visualisations claires pour comprendre les
                distributions et les corrélations.
              </li>
              <li>
                Développer des modèles prédictifs en fonction des données
                textuelles, tabulaires et visuelles.
              </li>
              <li>
                Fournir des recommandations pour optimiser la présentation des
                profils d’animaux.
              </li>
            </ul>
            <p className="mt-4">
              En combinant une approche data-driven et des modèles
              d’intelligence artificielle, cette étude ambitionne de contribuer
              à l’amélioration des taux d’adoption et de réduire le nombre
              d’animaux en attente d’un foyer.
            </p>
          </section>
        </div>

        {/* Présentation des données */}
        <section className="p-5 border-1 border-base-300 rounded-3xl mt-4">
          <div className="badge badge-soft badge-primary badge-lg mb-5">
            Présentation du Jeu de Données
          </div>
          <p className="mb-4 text-sm">
            Le dataset est issu de PetFinder.my, une plateforme malaisienne de
            protection animale. Il contient des informations sur des chiens 🐶
            et chats 🐱 proposés à l’adoption entre 2008 et 2019.
          </p>

          <div className="md:flex justify-center">
            <div className="md:w-1/2 border border-base-200 rounded-3xl p-5">
              <div className="badge badge-outline badge-primary ">
                Répartition Chiens vs Chats
              </div>
              <AnimalTypeChart />
              <p>
              Les chiens sont légèrement plus nombreux que les chats dans ce jeu de données. Cette dominance peut influencer les résultats des modèles prédictifs, notamment si certains types d’animaux sont adoptés plus vite que d'autres.
              </p>
            </div>

            <div className="md:w-1/2 border border-base-200 rounded-3xl p-5 md:ml-4 md:mt-0 mt-4 ">
              <div className="badge badge-outline badge-primary">
                Distribution de l’âge
              </div>
              <AgeDistributionChart />
              <p>
              La majorité des animaux proposés à l’adoption ont moins d’un an, avec une forte concentration dans les 6 premiers mois. Cette donnée montre que les refuges accueillent principalement des jeunes animaux, ce qui pourrait influencer les tendances d’adoption observées dans le reste de l’analyse.
              </p>
            </div>
          </div>

          <p className="mt-7 text-sm text-center font-bold">
            Ces visualisations montrent une nette préférence pour les jeunes
            animaux et une légère dominance des chiens dans les adoptions.
          </p>
        </section>

        {/* Pied de page */}
      
      </div>
      <footer className="text-center mt-8">
          Avec amour pour nos compagnons à quatre pattes – LoveMyPet 2025
        </footer>
    </Wrapper>
  );
}
