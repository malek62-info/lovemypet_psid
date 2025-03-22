"use client"

import { AudioWaveform, Dog, GlobeLock, Menu, Settings, X } from 'lucide-react'

import React, { useEffect, useState } from 'react'


const Navbar = () => {
  

    const [menuOpen, setMenuOpen] = useState(false)


    const navas = [
        { href: "/", label: "Accueil" },
        { href: "/dashboard", label: "Tableau de bord" },
        { href: "/services", label: "Machine Learning" },
    ]

    const renderas = (classNames) => (
        <>
     

            {navas.map(({ href, label }) => (
                <a href={href} key={href} className={`${classNames} btn-sm `}>{label}</a>
            ))}

    
        </>
    )



    return (
        <div className='border-b  border-base-300 px-5 md:px-[10%] py-4  shadow-accent '>
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <div className='rounded-full p-2'>
                        <Dog  className='w-6 h-6 text-primary' />
                    </div>
                    <span className='font-bold text-xl'>
                        Lovemypet
                    </span>
                </div>

                <button className=' btn w-fit btn-sm sm:hidden' onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu className='w-4' />
                </button>

                <div className=' hidden space-x-2 sm:flex items-center'>
                    {renderas("btn")}
                
                </div>
            </div>

            <div className={`absolute top-0 w-full bg-base-100  h-screen flex flex-col gap-2 p-4 transition-all duration-300 sm:hidden z-50 ${menuOpen ? "left-0" : "-left-full"}`}>
                <div className=' flex justify-between'>
                    
                    <button className=' btn w-fit btn-sm sm:hidden' onClick={() => setMenuOpen(!menuOpen)}>
                        <X className='w-4' />
                    </button>
                </div>
                {renderas("btn")}
            </div>

       
        </div>
    )
}

export default Navbar