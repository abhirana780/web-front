import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote, Award, FolderOpen } from "lucide-react";
import CountUp from '../reactBits/CountUp';
import ceoPhoto from "../../assets/ceo.jpg"; // Replace with actual CEO photo

const CEOIntro = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  
  return (
    <section className="py-24  flex justify-center rounded-tl-[200px]  rounded-br-[200px] bg-gradient-to-br
    from-[#ab1428]/25
    via-[#f0f0f0]
    to-white">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* CEO Photo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative group">
                <img
                  src={ceoPhoto}
                  alt="CEO"
                  className="w-full max-w-sm sm:max-w-md mx-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ab1428]/20 to-secondary/20 -z-10"
                />
                {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent -z-10"></div> */}
              </div>
            </motion.div>

            {/* CEO Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 order-1 lg:order-2 text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <Quote className="w-8 h-8 text-[#ab1428]" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#ab1428] bg-clip-text my-10!">
                  Meet Our CEO
                </h2>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-[#ab1428] mb-5!">Harish Chawla</h3>
              <p className="text-base sm:text-lg text-muted-foreground mb-4!">
              Cloud Engineer with over 15 years of expertise in scalable digital infrastructure              </p>

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                “Our vision is to revolutionize how businesses leverage cloud technology to scale faster, operate smarter, and connect seamlessly with their audiences. We believe in pushing boundaries, embracing innovation, and delivering cloud-driven solutions that create real, measurable impact.”                </p>

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                “At Dynamic Reveal, we’re not just deploying cloud systems — we’re architecting powerful, secure, and future-ready digital experiences. Every project is an opportunity to build something exceptional that transforms the way businesses operate.”                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#ab1428]/10 px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-2"
                >
                  <Award className="w-5 h-5 text-[#ab1428]" />
                  <div>
                  <div className="flex items-center gap-2">
                  <CountUp from={0} to={15} separator="," direction="up" duration={1} className="text-2xl font-bold text-[#ab1428]" />
                  <div className="text-muted-foreground text-2xl font-bold text-[#ab1428]">+</div>

                  </div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#ab1428]/10 px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-2"
                >
                  <FolderOpen className="w-5 h-5 text-[#ab1428]" />
                  <div > 
                  <div className="flex items-center gap-2">
                  <CountUp from={0} to={200} separator="," direction="up" duration={1} className="text-2xl font-bold text-[#ab1428]" />
                  <div className=" text-muted-foreground text-2xl font-bold text-[#ab1428]">+</div>

                  </div>
                    <div className="text-sm text-muted-foreground">Projects Completed</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CEOIntro;
