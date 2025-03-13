import Link from 'next/link'
import React from 'react'

const Menu = () => {
    return (
        <div className=''>
            <div className="navbar bg-base-100 shadow-sm flex justify-between px-5 md:px-[5%] ">
               <div className='font-bold'>
                 LoveMyPet
               </div>
               <div className='space-x-2'>
                 <Link href={"/"} className='btn btn-accent'>Acceuil</Link>
                 <Link href={"/"} className='btn btn-accent'>Modele ML</Link>
                 <Link href={"/"} className='btn btn-accent'>Dashborard</Link>
               </div>
            </div>
        </div>
    )
}

export default Menu
