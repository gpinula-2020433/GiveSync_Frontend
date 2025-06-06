import React from "react";
import Layout from "../../components/Layout/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from "react-router-dom";


const MainPage=() => {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
}

export default MainPage;