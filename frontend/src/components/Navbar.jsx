"use client";

import {  PawPrint, ChartLine, Home, Menu, X , Brain } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation  } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // Hook pour obtenir l'URL actuelle

  const navas = [
    { href: "/", label: "Accueil", icon: <Home className="w-5 h-5 " /> },
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: <ChartLine className="w-5 h-5 " />,
    },
    {
      href: "/ml",
      label: "Machine learning",
      icon: <Brain className="w-5 h-5 " />,
    },
    // { href: "/ml", label: "Machine Learning", icon: <Bot  className="w-5 h-5 " /> },
  ];

  // Fonction pour ajouter les classes aux boutons
  const renderas = (classNames) => (
    <>
      {navas.map(({ href, label, icon }) => {
        // Vérifie si l'URL actuelle est égale à `href`
        const isActive = location.pathname === href;

        return (
          <Link
            to={href}
            key={href}
            className={`${classNames} btn ${
              isActive ? "btn-primary" : ""
            } flex items-center gap-2`}
          >
            {icon} {/* Ajoute l'icône avant le label */}
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="border-b border-base-300 px-5 md:px-[10%] py-4 shadow-accent">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="rounded-full p-2">
            <PawPrint className="w-8 h-8 text-primary" />
          </div>
          <span className="font-bold text-xl font-mono">LoveMyPet</span>
        </div>

        <button
          className="btn w-fit btn-sm sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-4" />
        </button>

        <div className="hidden space-x-2 sm:flex items-center">
          {renderas("btn")}
        </div>
      </div>

      <div
        className={`absolute top-0 w-full bg-base-100 h-screen flex flex-col gap-2 p-4 transition-all duration-300 sm:hidden z-50 ${
          menuOpen ? "left-0" : "-left-full"
        }`}
      >
        <div className="flex justify-between">
          <button
            className="btn w-fit btn-sm sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <X className="w-4" />
          </button>
        </div>
        {renderas("btn")}
      </div>
    </div>
  );
};

export default Navbar;
