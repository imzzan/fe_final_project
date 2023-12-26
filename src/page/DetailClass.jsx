import {
  BookOpenIcon,
  ClockIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/outline";
import { Module, Navbar } from "../component";
import { ArrowLeftIcon, ChatAlt2Icon } from "@heroicons/react/solid";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ModalBuy from "../component/ModalBuy";

const DetailClass = () => {
  const location = useLocation();
  const [classData, setClassData] = useState(null);
  const [chapterData, setChapterData] = useState([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("accessToken");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const nextButton = () => {};

  useEffect(() => {
    const fetchData = async () => {
      if (location?.state?.id) {
        try {
          const response = await fetch(
            `https://befinalprojectbinar-production.up.railway.app/api/courses/${location.state.id}`
          );

          if (response.ok) {
            const { data } = await response.json();
            setClassData(data);
            setCurrentVideoUrl(data.introduction_video);

            if (data?.chapters?.length > 0) {
              const fetchedChapters = await Promise.all(
                data.chapters.map((chapter) => fetchChapterData(chapter.id))
              );
              setChapterData(fetchedChapters);
            }
          } else {
            console.error(
              "Error fetching data:",
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    const fetchChapterData = async (chapterId) => {
      try {
        const headers = {};

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await fetch(
          `https://befinalprojectbinar-production.up.railway.app/api/chapters/${chapterId}`,
          {
            method: "GET",
            headers,
          }
        );

        if (response.ok) {
          const { data } = await response.json();

          return data;
        } else {
          console.error(
            "Error fetching chapter data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      }
    };

    fetchData();
  }, [location?.state?.id]);

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main>
        <Module
          courseId={location.state.id}
          chapterData={chapterData}
          setCurrentVideoUrl={setCurrentVideoUrl}
          openModal={openModal}
        />
        {classData && (
          <>
            <section className="bg-[#EBF3FC] pl-28 pt-8 pb-5 shadow">
              <span className="font-bold text-base">
                <Link
                  className="grid grid-flow-col auto-cols-max w-10 gap-4"
                  to="/class"
                >
                  <ArrowLeftIcon className="w-6" />
                  <p>Kelas Lainnya</p>
                </Link>
              </span>
              <div className="pl-6 pt-5">
                <p className="text-xl font-bold text-[#6148FF]">
                  {classData.category.category}
                </p>
                <p className="text-xl font-bold">{classData.name}</p>
                <p className="text-sm font-normal">
                  by {classData.facilitator}
                </p>
                <div className="text-xs font-semibold flex gap-36 pt-[0.19rem]">
                  <div className="flex items-center">
                    <ShieldExclamationIcon className="stroke-green-500 w-3.5" />
                    <p className="text-[#6148FF]">{classData.level} Level</p>
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="stroke-green-500 w-3.5" />
                    <p className="">{classData.total_chapter} Modul</p>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="stroke-green-500 w-3.5" />
                    <p className="">{classData.total_duration} Menit</p>
                  </div>
                </div>
                <span
                  className={token ? "cursor-pointer" : "pointer-events-none"}
                >
                  <a
                    className="flex mt-4 bg-[#73CA5C] font-bold text-base w-64 text-white justify-center rounded-3xl shadow-lg gap-2 py-1"
                    href={classData.telegram_group}
                  >
                    Join Grup Telegram
                    <ChatAlt2Icon className="w-6" />
                  </a>
                </span>
              </div>
            </section>

            <div className="pl-36 pr-16 w-8/12">
              <section className="py-8 max-w-max">
                <ReactPlayer url={currentVideoUrl} controls />
                <div
                  className={`flex mt-3 gap-4 justify-end ${
                    !token ? "hidden" : ""
                  }`}
                >
                  <button className="px-5 py-2 bg-indigo-50 rounded-3xl  text-blue-400 text-base font-bold">
                    Kelas Lainnya
                  </button>
                  <button
                    className="px-5 py-2 bg-indigo-600 rounded-3xl text-blue-400 text-white text-base font-bold"
                    onClick={nextButton}
                  >
                    Next
                  </button>
                </div>
              </section>

              <section className="py-5">
                <h1 className="text-2xl font-bold">Tentang Kelas</h1>
                <p className="text-sm pt-3">{classData.description}</p>
              </section>
            </div>
            <ModalBuy
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              id={classData.id}
              category={classData.category.category}
              name={classData.name}
              img={classData.category.image}
              facilitator={classData.facilitator}
              level={classData.level}
              modul={chapterData.total_chapter}
              duration={chapterData.total_duration}
            />
          </>
        )}
      </main>
    </>
  );
};

export default DetailClass;
