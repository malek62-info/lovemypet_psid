import { FolderGit2 } from 'lucide-react';
import React from 'react';

import Navbar from './Navbar';

const Wrapper = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div className='px-5 md:px-[10%] mt-8 mb-10'>
                {children}
            </div>
        </div>
    );
}

export default Wrapper;
