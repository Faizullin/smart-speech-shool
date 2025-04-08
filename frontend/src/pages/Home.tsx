import Breadcrumbs from '../components/Breadcrumbs';
import Herobar from '../components/HeroBar';

import React from 'react';
import Footer from '../components/Footer';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { fetchUserData, logout } from '../redux/store/reducers/authSlice';

export default function Home() {
    const dispath = useAppDispatch()
    const user = useAppSelector(state => state.auth.user)

    React.useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
        if (user.isAuthenticated) {
            if (!user.email) {
                dispath(fetchUserData()).then(reponse => {
                    if (reponse.type !== fetchUserData.fulfilled.toString()) {
                        dispath(logout())
                    }
                })
            }
        }
    }, [dispath])
    return (
        <>
            <div className='flex-grow'>
                <Herobar />
            </div>
            <Footer />
        </>
    )
}
