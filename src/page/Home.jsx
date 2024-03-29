import {
  CardCategory,
  CardCourse,
  ButtonBuy,
  Button,
  Navbar,
  Footer,
  ButtonFree,
} from "../component";
import { hero, PM, UIUX, WEB, AND, DS, IOS } from "../assets";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const token = localStorage.getItem("accessToken");
  const [queries, setQueries] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const buttonData = [
    {
      colorAf: "#6148FF",
      colorBf: "#E8F1FF",
      textColor: "black",
      text: "All",
      classes: "rounded-2xl px-5 py-2 flex-shrink-0",
      query: "",
    },
    {
      colorAf: "#6148FF",
      colorBf: "#E8F1FF",
      textColor: "black",
      text: "Data Science",
      classes: "rounded-2xl px-5 py-2 flex-shrink-0 flex grow justify-center",
      query: "Data Science",
    },
    {
      colorAf: "#6148FF",
      colorBf: "#E8F1FF",
      textColor: "black",
      text: "Android Development",
      classes: "rounded-2xl px-5 py-2 flex-shrink-0 flex grow justify-center",
      query: "Android",
    },
    {
      colorAf: "#6148FF",
      colorBf: "#E8F1FF",
      textColor: "black",
      text: "Web Development",
      classes: "rounded-2xl px-5 py-2 flex-shrink-0 flex grow justify-center",
      query: "Web Development",
    },
    {
      colorAf: "#6148FF",
      colorBf: "#E8F1FF",
      textColor: "black",
      text: "IOS Development",
      classes: "rounded-2xl px-5 py-2 flex-shrink-0 flex grow justify-center",
      query: "IOS",
    },
    {
      colorAf: "#6148FF",
      colorBf: "#E8F1FF",
      textColor: "black",
      text: "Business Intelligence",
      classes: "rounded-2xl px-5 py-2 flex-shrink-0 flex grow justify-center",
      query: "Product Manager",
    },
    {
      colorAf: "#6148FF",
      colorBf: "#E8F1FF",
      textColor: "black",
      text: "UI/UX Design",
      classes: "rounded-2xl px-5 py-2 flex-shrink-0 flex grow justify-center",
      query: "UI/UX",
    },
  ];

  const [courses, setCourses] = useState([]);

  const createTracker = async (id) => {
    try {
      const postTrackerData = await fetch(
        `https://befinalprojectbinar-production.up.railway.app/api/trackers/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_id: id,
          }),
        }
      );

      if (postTrackerData.ok) {
        console.log("tracker berhasil dibuat");
      }
    } catch (error) {
      console.log("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://befinalprojectbinar-production.up.railway.app/api/courses?category=${queries}`
      );
      const { data } = await response.json();
      setCourses(data);
    };
    fetchData();
  }, [queries]);

  return (
    <>
      <header className="sticky top-0 z-10">
        <Navbar setSearchInput={setSearchInput} />
      </header>
      <main>
        <section id="Hero">
          <div className=" bg-[#6148ff] flex flex-col lg:grid grid-flow-col auto-cols-max gap-5 lg:gap-10">
            <div className="relative">
              <img src={hero} />
              <div className="absolute bg-gradient-to-l from-[#6148ff] h-full w-full top-0"></div>
            </div>
            <div className="flex flex-col gap-6 justify-center pb-10 pt-0 lg:py-0 px-10 lg:px-0 ">
              <div className="text-white font-bold text-2xl ">
                <h1>Belajar</h1>
                <h1>dari Praktisi Terbaik!</h1>
              </div>
              <button className=" bg-[#fff] rounded-2xl">
                <Link to="/class">
                  <p className="text-base font-bold text-[#6148FF] my-1.5">
                    IKUTI KELAS
                  </p>
                </Link>
              </button>
            </div>
          </div>
        </section>

        <section id="kategori-belajar" className="bg-[#EBF3FC] pt-5 pb-10">
          <div className="mx-7 lg:mx-[110px] pt-7">
            <div className="flex justify-between items-center">
              <h2 className=" text-[16px] lg:text-2xl font-bold">
                Kategori Belajar
              </h2>
              <Link
                to="/class"
                className=" text-[12px] lg:text-xs font-extrabold text-[#6148FF]"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="py-5">
              <div className="flex flex-wrap gap-5 justify-center">
                <CardCategory
                  link={"/class"}
                  img={UIUX}
                  label={"UI/UX Design"}
                />
                <CardCategory
                  link={"/class"}
                  img={PM}
                  label={"Product Management"}
                />
                <CardCategory
                  link={"/class"}
                  img={WEB}
                  label={"Web Development"}
                />
                <CardCategory
                  link={"/class"}
                  img={AND}
                  label={"Android Development"}
                />
                <CardCategory
                  link={"/class"}
                  img={IOS}
                  label={"IOS Development"}
                  classes={"hidden lg:block"}
                />
                <CardCategory
                  link={"/class"}
                  img={DS}
                  label={"Data Science"}
                  classes={"hidden lg:block"}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="kursus-populer">
          <div className="mx-7 lg:mx-[110px] py-7 ">
            <div className="flex justify-between items-center mb-3">
              <h2 className=" text-[16px] lg:text-2xl font-bold">
                Kursus Populer
              </h2>
              <Link
                to="/class"
                className=" text-[12px] lg:text-xs font-extrabold text-[#6148FF]"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="flex grow mt-3 gap-2 lg:gap-4 text-xs font-bold overflow-x-auto lg:justify-center">
              {buttonData.map((button, index) => (
                <Button
                  key={index}
                  index={index}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  {...button}
                  setQueries={() => setQueries(button.query)}
                />
              ))}
            </div>
            <div className="pt-7 flex flex-col lg:grid lg:grid-cols-3 gap-4">
              {courses.slice(0, 3).map((course) => (
                <CardCourse
                  onClick={
                    course.type === "Free"
                      ? () => createTracker(course.id)
                      : null
                  }
                  key={course.id}
                  id={course.id}
                  img={course.category.image}
                  classCategory={course.category.category}
                  classesName={course.name}
                  classMentor={course.facilitator}
                  level={course.level}
                  moduls={course.total_chapter}
                  times={course.total_duration}
                >
                  {course.price == 0 ? (
                    <ButtonFree />
                  ) : (
                    <ButtonBuy price={course.price} />
                  )}
                </CardCourse>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
