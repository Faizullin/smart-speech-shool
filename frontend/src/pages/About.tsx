import Breadcrumbs from '../components/Breadcrumbs';
import Herobar from '../components/HeroBar';
import Layout from '../components/layouts/Layout';


export interface IAboutProps {
}

export default function About(_: IAboutProps) {
    return (
        <Layout>
            <Herobar />
            <Breadcrumbs />
            <section id="about" className="about">
                <div className="container mx-auto sm:px-4" data-aos="fade-up">
                    <div className="section-header">
                        <h2>

                        </h2>
                        <p>Болашақ информатика мұғалімдеріне арналған ақпараттық порталына қош келдіңіздер! Мұнда сіз машиналық оқыту, компьютерлік көру бойынша заманауи білім ала аласыз.
                        </p>
                    </div>

                    <div className="flex flex-wrap  gy-4">
                        <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 space-y-4">
                            <h2 className="text-lg font-semibold text-blue-600">🔹 Портал туралы</h2>
                            <p>
                                Бұл ақпараттық портал ҚР Ғылым және жоғары білім министрлігінің
                                AP19677348 нөмірлі гранттық жобасы аясында әзірленді (2023–2025 жж.).
                            </p>

                            <div>
                                <h3 className="font-semibold text-gray-700">📌 Жоба атауы:</h3>
                                <p>
                                    «Білімнің жаһандануы жағдайында жасанды интеллекттің бағыты – машиналық
                                    оқыту негізінде информатика мұғалімдерінің даярлықтарын жетілдіруге
                                    арналған ақпараттық білім порталын құру»
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700">🎯 Мақсаты:</h3>
                                <p>
                                    Болашақ информатика пәні мұғалімдері мен IT бағыты бойынша білім
                                    алушыларды келесі бағыттарда даярлау:
                                </p>
                                <ul className="list-disc list-inside ml-4">
                                    <li>Машиналық оқыту алгоритмдерінің теориясы мен практикасы</li>
                                    <li>Компьютерлік көру әдістерін қолдану</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-blue-600 font-semibold">🔹 Авторлық құқықтар:</h3>
                                <p>
                                    Портал және оның ішкі контенті (оқу құралы, материалдар, интерфейс,
                                    кодтар) жеке-жеке авторлық құқықпен қорғалған және ҚР мемлекеттік
                                    тізіліміне тіркелген.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">📁 1. Порталдың өзі (программалық өнім):</h4>
                                <ul className="list-disc list-inside ml-4">
                                    <li>Объект түрі: ЭЕМ-ге арналған бағдарлама</li>
                                    <li>Атауы: «Болашақ информатика пәні мұғалімдеріне арналған ақпараттық портал»</li>
                                    <li>Куәлік №: 39362  Берілген күні: 02.10.2023</li>
                                    <li>
                                        Авторлар:
                                        <ul className="list-disc list-inside ml-4">
                                            <li>Серік М.</li>
                                            <li>Садвакасова А.Қ.</li>
                                            <li>Тлеумагамбетова Д.Ш.</li>
                                            <li>Дүйсегалиева Н.А.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold">📘 2. Портал ішіндегі оқу контенті:</h4>
                                <ul className="list-disc list-inside ml-4">
                                    <li>Атауы: «Машиналық оқыту негіздері және компьютерлік көру»</li>
                                    <li>Мазмұны: Машиналық оқыту алгоритмдері, компьютерлік көру үшін ML әдістері</li>
                                    <li>Куәлік №: 90024  Берілген күні: 04.04.2025</li>
                                    <li>
                                        Авторлар:
                                        <ul className="list-disc list-inside ml-4">
                                            <li>Дүйсегалиева Н. А.</li>
                                            <li>Асанова Б. У.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            <p className="text-green-600 font-medium">
                                ✅ Екі объект те электрондық қолтаңбамен бекітілген
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
