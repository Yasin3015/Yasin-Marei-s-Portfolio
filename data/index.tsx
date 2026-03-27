import { AiOutlineApi, AiOutlineGlobal } from "react-icons/ai";
import { FaJsSquare, FaMobileAlt, FaSearch } from "react-icons/fa";
import {
  FaCss3,
  FaFacebook,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaInstagram,
  FaLinkedin,
  FaReact,
  FaWhatsapp,
} from "react-icons/fa6";
import { MdOutlineSpeed } from "react-icons/md";
import {
  SiAnimalplanet,
  SiAxios,
  SiBootstrap,
  SiFramer,
  SiGraphql,
  SiNextdotjs,
  SiReactbootstrap,
  SiRedux,
  SiSass,
  SiStyledcomponents,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { z } from "zod";

export const cvUrl ="https://drive.google.com/file/d/1PRAG0vqckHVg03YrcwuRt2-UbcA1qDCH/view?usp=sharing";
export const projects = [
  {
  id: 20,
  title: "Salam4CC Website",
  des: "Modern responsive website for Salam for Cultural Communication, built with Next.js and React to showcase initiatives, programs, and publications with optimized performance and SEO.",
  img: "salam",
  iconsList: ["/html.svg", "/css.svg", "/js.svg", "/react.svg", "/next.svg"],
  link: "https://salam4cc.org/",
},

  {
    id: 0,
    title: "Fulk App Website",
    des: "Dynamic tourism platform showcasing travel packages and activities with real-time data. Developed using HTML5, CSS3, JavaScript, Bootstrap, React, and Firebase.",
    img: "fulk",
    iconsList: ["/html.svg", "/css.svg", "/js.svg", "/bootstrap-4.svg", "/react.svg", "/firebase.svg"],
    link: "https://fulk-app.web.app/",
  },
  {
    id: 1,
    title: "Knowticed App Website",
    des: "Tourism platform with trip booking, offers, and real-time management. Built with React and Firebase.",
    img: "Knowticed",
    iconsList: ["/html.svg", "/css.svg", "/js.svg", "/bootstrap-4.svg", "/react.svg", "/firebase.svg"],
    link: "https://knowticed.com/",
  },
  {
    id: 2,
    title: "Bayanatz Company Website",
    des: "Corporate website with responsive UI and real-time content management. Built using Bootstrap, JavaScript, and Firebase.",
    img: "Bayanatz",
    iconsList: ["/html.svg", "/css.svg", "/js.svg", "/bootstrap-4.svg", "/firebase.svg"],
    link: "https://www.bayanatz.com/",
  },
  {
  id: 22,
  title: "E-Learning Pricing Demo",
  des: "Side project demo for an educational platform, featuring an interactive pricing section to showcase subscription plans. Built using HTML5, CSS3, JavaScript, and React.",
  img: "e-learning",
  iconsList: ["/html.svg", "/css.svg", "/js.svg", "/react.svg"],
  link: "https://e-learning-test.netlify.app/",
  sourceCode: "https://github.com/Yasin3015/e-learning"
},
  {
    id: 3,
    title: "Viwege Travel Project",
    des: "Responsive travel project website with interactive design. Built using HTML5, CSS3, JavaScript, and Bootstrap.",
    img: "viewEg",
    iconsList: ["/html.svg", "/css.svg", "/js.svg", "/bootstrap-4.svg"],
    link: "https://yasin3015.github.io/ViwegeTravelsDemo/",
    sourceCode: "https://github.com/Yasin3015/e-learning",
  },
  {
    id: 6,
    title: "Online Courses Project",
    des: "Responsive online courses platform demo. Developed using HTML5, CSS3, JavaScript, and Bootstrap.",
    img: "online_courses",
    iconsList: ["/html.svg", "/css.svg", "/js.svg", "/bootstrap-4.svg"],
    link: "https://yasin3015.github.io/onlinecourses/",
    sourceCode: "https://github.com/Yasin3015/onlinecourses",
  },
  {
    id: 7,
    title: "AZ Company Project",
    des: "Corporate demo website showcasing services. Built using HTML5, CSS3, and JavaScript.",
    img: "AZ",
    iconsList: ["/html.svg", "/css.svg", "/js.svg"],
    link: "https://yasin3015.github.io/AZ-Demo/",
    sourceCode: "https://github.com/Yasin3015/AZ-Demo",
  },
  {
    id: 9,
    title: "Akira Website",
    des: "Demo website with responsive design. Built using HTML5, CSS3, JavaScript, and Bootstrap.",
    img: "Akira",
    iconsList: ["/html.svg", "/css.svg", "/js.svg", "/bootstrap-4.svg"],
    link: "https://yasin3015.github.io/akira/",
    sourceCode: "https://github.com/Yasin3015/akira",
  },
  {
    id: 13,
    title: "Wealthy People",
    des: "Wealthy People is a Dynamic project fetching data from API. Built using HTML5, CSS3, and JavaScript.",
    img: "wealthy_people",
    iconsList: ["/html.svg", "/css.svg", "/js.svg"],
    link: "https://yasin3015.github.io/wealthypeople/",
    sourceCode: "https://github.com/Yasin3015/wealthypeople",
  },
  {
    id: 15,
    title: "Typing Speed Test",
    des: "Simple Typing speed test app to test your typing skills. Built using HTML5, CSS3, Bootstrap, and JavaScript.",
    img: "Typing_Skills",
    iconsList: ["/html.svg", "/css.svg", "/bootstrap-4.svg", "/js.svg"],
    link: "https://yasin3015.github.io/Typing-speedTest/",
    sourceCode: "https://github.com/Yasin3015/Typing-speedTest",
  }
];

const yearsOfExperience = 2;
const projectsCompleted = 15;
const clients = 5;

export const aboutData = [
  {
    number: yearsOfExperience,
    text: "Years of Experience",
  },
  {
    number: projectsCompleted,
    text: "Project Completed",
  },
  {
    number: clients,
    text: "Clients",
  },
];

export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Contact", link: "#contact" },
];

export const skills = [
  { id: 1, icon: <SiNextdotjs />, text: "Next.js" },
  { id: 2, icon: <SiTypescript />, text: "TypeScript" },
  { id: 3, icon: <FaReact />, text: "React.js" },
  { id: 4, icon: <FaJsSquare />, text: "JavaScript" },
  { id: 5, icon: <FaHtml5 />, text: "HTML" },
  { id: 6, icon: <FaCss3 />, text: "CSS" },
  { id: 7, icon: <SiSass />, text: "Sass" },
  { id: 8, icon: <SiTailwindcss />, text: "Tailwind CSS" },
  { id: 9, icon: <SiBootstrap />, text: "Bootstrap" },
  { id: 9, icon: <SiReactbootstrap />, text: "ٌReact Bootstrap" },
  { id: 12, icon: <SiRedux />, text: "Redux Toolkit" },
  { id: 13, icon: <SiAxios />, text: "Axios" },
  { id: 14, icon: <FaGitAlt />, text: "Git & Github" },
  { id: 15, icon: <AiOutlineApi />, text: "REST APIs" },
  { id: 16, icon: <SiGraphql />, text: "GraphQL" },
  { id: 17, icon: <FaSearch />, text: "SEO Best Practices" },
  { id: 18, icon: <MdOutlineSpeed />, text: "Web Performance Optimization" },
  { id: 19, icon: <FaMobileAlt />, text: "Responsive Design" },
  { id: 20, icon: <AiOutlineGlobal />, text: "Cross-Browser Compatibility" },
];

export const socialMedia = [
  {
    id: 1,
    link: "https://github.com/Yasin3015",
    icon: <FaGithub />,
  },
  {
    id: 2,
    link: "https://www.linkedin.com/in/yasin-marei-259940192/",
    icon: <FaLinkedin />,
  },
  {
    id: 3,
    link: "https://www.facebook.com/yasin.marei/",
    icon: <FaFacebook />,
  },
  {
    id: 4,
    link: "https://wa.me/+201090257503?text=السلام عليكم و رحمة الله و بركاته باشمهندس ياسين انا  :",
    icon: <FaWhatsapp />,
  }
];

export const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(255, { message: "First name is too long" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(4, { message: "Phone number is too short" })
    .regex(
      /^\+\d{1,3}\d{4,14}$/,
      "Phone Number Format: +[country code][number] (e.g., +1234567890)"
    ),
  subject: z.string(),
  message: z.string().min(1, { message: "Message is required" }),
});
