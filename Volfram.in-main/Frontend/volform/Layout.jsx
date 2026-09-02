import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./src/components/footer/Footer.jsx";
import Header from "./src/components/header/Header.jsx";
import ChatWidget from "./src/components/chatbot/ChatWidget.jsx";


function Layout() {
  return (
    <div className="layout">
      <Header />
      <Outlet />
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default Layout;