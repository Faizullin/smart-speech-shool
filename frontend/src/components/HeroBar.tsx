import { Link } from "react-router-dom";
import HeroImg from '../assets/img/hero-2.png';

const base_url = ((window as any).BASE_API_URL !== undefined) ? (window as any).BASE_API_URL : import.meta.env.VITE_APP_BASE_URL


export default function Herobar() {
    return (
        <section id="hero" className="hero pt-0">
            <div className="container mx-auto relative">
                <img src={HeroImg} className="max-w-full h-auto" alt="" data-aos="zoom-out" data-aos-delay="100" />
                <div className="hero-text flex flex-col justify-center text-center text-lg-star mt-5">
                    <h2>
                        МАШИНАЛЫҚ ОҚЫТУ НЕГІЗДЕРІ
                        ЖӘНЕ КОМПЬЮТЕРЛІК КӨРУ
                    </h2>
                </div>
                {/* <div className="flex flex-wrap justify-center   gy-5" data-aos="fade-in">
                    <div className="pr-4 pl-4 order-1">
                        <img src={HeroImg} className="max-w-full h-auto" alt="" data-aos="zoom-out" data-aos-delay="100" />
                    </div>
                    <div className="pr-4 pl-4 order-2 flex flex-col justify-center text-center text-lg-star mt-5">
                        <h2>
                            МАШИНАЛЫҚ ОҚЫТУ НЕГІЗДЕРІ ЖӘНЕ КОМПЬЮТЕРЛІК КӨРУ
                        </h2>
                        <p>
                            <FormattedMessage
                                id="app.herobar.welcome.info"
                            />
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <Link to="/" className="btn-get-started">
                                <FormattedMessage
                                    id="app.herobar.welcome.get_started"
                                />
                            </Link>
                        </div>
                    </div>
                </div> */}
            </div>

            <div className="icon-boxes relative">
                <div className="container mx-auto sm:px-4 relative">
                    <div className="flex flex-wrap gy-4 mt-12">
                        {
                            ([
                                {
                                    "label": "Тіркелу",
                                    "url": "/auth/register",
                                },
                                {
                                    "label": "Порталға кіру",
                                    "url": "/auth/login",
                                },
                                {
                                    "label": "Біз туралы",
                                    "url": "/about",
                                }
                            ]).map((item, index) => {
                                return (
                                    <div className="xl:w-1/3 md:w-1/3 w-1/2 pr-4 pl-4 mt-5" data-aos="fade-up" data-aos-delay={index * 100} key={index}>
                                        <div className="icon-box">
                                            <div className="icon"><i className="bi bi-easel"></i></div>
                                            <h4 className="title">
                                                <Link to={item.url} className="stretched-link">
                                                    {item.label}
                                                </Link>
                                            </h4>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </div>
        </section>
    )
}