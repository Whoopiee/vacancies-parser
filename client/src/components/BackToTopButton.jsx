import React, { useEffect, useState } from 'react';

const BackToTopButton = () => {
    const [backToTopStatus, setBackToTop] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 150) {
                setBackToTop(true);
            } else {
                setBackToTop(false);
            }
        })

    }, []);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <div className='scrollUp'>
            {backToTopStatus && (
                <button onClick={scrollUp}>^</button>
            )}
        </div>
    )
}

export default BackToTopButton