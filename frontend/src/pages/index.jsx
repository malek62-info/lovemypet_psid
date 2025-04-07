import AnimalTypeChart from "../AnimalTypeChart";
import AgeDistributionChart from "../AgeDistributionChart";
import Wrapper from "../components/Wrapper";

export default function Home() {
  return (
    <Wrapper>
      <div className="relative min-h-screen px-6 py-10 sm:px-10 bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 overflow-hidden">
        {/* Cute paw background decoration */}
        <div className="absolute inset-0 bg-[url('/images/paw-pattern.svg')] opacity-10 bg-repeat"></div>

        {/* Header Section */}
        <section className="relative z-10 mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-rose-600 drop-shadow-lg">
            🐾 LoveMyPet: Donnons-leur une seconde chance
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
            Grâce à la puissance des données et de l’intelligence artificielle, nous analysons les facteurs qui influencent l’adoption des animaux abandonnés 🐶🐱
          </p>
        </section>

        {/* Contexte Section */}
        <section className="relative z-10 mb-16 max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-pink-200">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">🌍 Contexte</h2>
          <p className="text-gray-700 mb-3">
            Chaque année, des millions d'animaux errants se retrouvent sans foyer et risquent l’euthanasie en raison du manque d’adoptions.
            Ce problème soulève une question cruciale en matière de bien-être animal : comment augmenter leurs chances d’être adoptés rapidement ?          </p>
          <p className="text-gray-700">
            L'essor des technologies d’intelligence artificielle et d’analyse de données ouvre de nouvelles perspectives pour améliorer ce processus.
            En exploitant les informations disponibles sur les profils d’animaux – descriptions textuelles, caractéristiques tabulaires et images –
            il devient possible d’identifier les éléments qui influencent le temps d’adoption.
            Une meilleure compréhension de ces facteurs peut permettre d’optimiser la présentation des animaux et d’accélérer leur adoption.          </p>
        </section>

        {/* Objectifs Section */}
        <section className="relative z-10 mb-16 max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-yellow-200">
          <h2 className="text-3xl font-bold text-yellow-600 mb-4">🎯 Objectifs</h2>
          <p className="text-gray-700 mb-3">
            Ce projet vise à appliquer des techniques d’analyse de données et de machine learning pour prédire la rapidité d’adoption
            des animaux en fonction des informations disponibles sur leurs profils.          </p>
          <p className="text-gray-700 mb-3">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Préparer et nettoyer les données pour garantir leur fiabilité et leur exploitabilité.</li>
              <li>Réaliser des visualisations claires pour comprendre les distributions et les corrélations.</li>
              <li>Développer des modèles prédictifs en fonction des données textuelles, tabulaires et visuelles.</li>
              <li>Fournir des recommandations pour optimiser la présentation des profils d’animaux.</li>
            </ul>
          </p>
          <p className="text-gray-700">
            En combinant une approche data-driven et des modèles d’intelligence artificielle,
            cette étude ambitionne de contribuer à l’amélioration des taux d’adoption et de réduire le nombre d’animaux en attente d’un foyer.        </p>
        </section>

        {/* Visualisation Section */}
        <section className="relative z-10 mb-16 max-w-5xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-purple-200">
          <h2 className="text-3xl font-bold text-purple-600 mb-6">📊 Présentation du Jeu de Données</h2>
          <p className="text-gray-700 mb-4">
            Le dataset est issu de PetFinder.my, une plateforme malaisienne de protection animale. Il contient des informations sur des chiens 🐶 et chats 🐱 proposés à l’adoption entre 2008 et 2019.
          </p>
          <div className="my-10">
            <h3 className="text-xl font-semibold text-indigo-500 mb-2">📈 Répartition Chiens vs Chats</h3>
            <AnimalTypeChart />
            <p className="text-gray-700 mb-4">
              Les chiens sont légèrement plus nombreux que les chats dans ce jeu de données.
              Cette dominance peut influencer les résultats des modèles prédictifs, notamment si certains types d’animaux sont adoptés plus vite que d'autres.
            </p>
          </div>

          <div className="my-10">
            <h3 className="text-xl font-semibold text-indigo-500 mb-2">📅 Distribution de l’âge</h3>
            <AgeDistributionChart />
            <p className="text-gray-700 mb-4">
              La majorité des animaux proposés à l’adoption ont moins d’un an, avec une forte concentration dans les 6 premiers mois.
              Cette donnée montre que les refuges accueillent principalement des jeunes animaux, ce qui pourrait influencer les tendances
              d’adoption observées dans le reste de l’analyse.
            </p>
          </div>

          <p className="text-gray-700 mt-6">
            Ces visualisations montrent une nette préférence pour les jeunes animaux et une légère dominance des chiens dans les adoptions.
          </p>
        </section>

        {/* Footer Cute */}
        <footer className="relative z-10 mt-20 text-center text-sm text-gray-500">
          🐾 Avec amour pour nos compagnons à quatre pattes – LoveMyPet 2025
        </footer>
      </div>
    </Wrapper >
  );
}
