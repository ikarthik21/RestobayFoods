import { useState } from "react";
import { motion } from "framer-motion";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import MAIN_IMG from "@/assets/images/home_main.png";
import { Link } from "react-router-dom";

const Home = () => {
  const [showOptions, setShowOptions] = useState(false);

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

            {!showOptions ? (
              <motion.button
                className="rounded-md p-2 w-3/4 md:w-full bg-[#ef5644] text-white cursor-pointer kanit-500 tracking-wider transition transform hover:scale-105"
                onClick={() => setShowOptions(true)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Get Started
              </motion.button>
            ) : (
              <div className="flex w-3/4  justify-between">
                <motion.div
                  className="flex gap-4 mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link to="/menu">
                    <motion.button
                      className="rounded-md p-2 w-32  bg-white text-[#ef5644] cursor-pointer kanit-500 tracking-wider transition transform hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                    >
                      Menu
                    </motion.button>
                  </Link>

                  <Link to="/table">
                    <motion.button
                      className="rounded-md p-2 w-32  bg-[#ef5644] text-whitecursor-pointer kanit-500 tracking-wider transition transform hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Link to="/table">Table</Link>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
};

export default Home;
