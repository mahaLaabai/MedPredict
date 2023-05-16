import React, {useEffect} from 'react';
import NotificationAlert from "react-notification-alert";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Row,
    Col, Container, Label,
} from "reactstrap";

import {apiBaseUrl} from "../variables/general";
import Cookies from 'js-cookie';
import logo from "../assets/img/logo.png";
import '../assets/css/login.css'

function Home() {
    useEffect(() => {
        window.location.href = 'http://localhost:9095/static/index.html';
    }, []);

    return (
        <>
        </>
    );
}

export default Home;
