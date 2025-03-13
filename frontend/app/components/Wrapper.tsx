import React from 'react'

import Navbar from './Navbar'

type WrapperProps = {
    children: React.ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
    return (
        <div className='' >
            <Navbar />
           
              <div className='px-5 md:px-[5%] mt-8 mb-10'>
              {children}
              </div>
       
        </div>
    )
}

export default Wrapper