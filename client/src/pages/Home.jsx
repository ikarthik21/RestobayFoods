import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import MAIN_IMG from "@/assets/images/home_main.png";

const Home = () => {
  return (
    <BlockWrapper>
      <div className="flex flex-col md:flex-row items-center justify-center h-[calc(100vh-70px)]">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0">
            <img
              src={MAIN_IMG}
              className="h-[30vh] md:h-[44vh] w-[50vw] md:w-[32vw]"
              alt="main_img"
            />
          </div>

          <div className="ml-0 md:ml-12 flex flex-col items-center md:items-end justify-end mt-4">
            <h2 className="main-head-1 text-center md:text-right">
              Welcome to Restobay
            </h2>
            <button className="rounded-md p-2 w-3/4 md:w-full bg-[#ef5644] text-white cursor-pointer kanit-500 tracking-wider transition transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
};

export default Home;
