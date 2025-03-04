import HomePage from "../pages/Home";
import ChatbotPage from "../pages/Chatbot";
import LoginPage from "../pages/Login";

const routes = [
  {
    path: "/",
    component: "Home",
    isPrivate: true,
  },
  {
    path: "/home",
    component: "Home",
    isPrivate: true,
  },
  {
    path: "/chatbot",
    component: "Chatbot",
    isPrivate: true,
  },
  {
    path: "/login",
    component: "Login",
    isPrivate: false,
  },
];

export default routes;
