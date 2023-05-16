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
    Col, Container,
} from "reactstrap";

import {apiBaseUrl} from "../variables/general";
import Cookies from 'js-cookie';
import logo from "../assets/img/logo.png";
import '../assets/css/login.css'

function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const handleChangeOfEmail = (event) => {
        setEmail(event.target.value);
    }
    const handleChangeOfPassword = (event) => {
        setPassword(event.target.value);
    }
    useEffect(() => {
        let token = Cookies.get('token')
        if (token !== undefined) {
            let role = Cookies.get('role')
            if (role === 'DOCTOR') {
                window.location.href = '/doctor';
            } else if (role === 'PATIENT') {
                window.location.href = '/patient';
            } else if (role === 'SUPER_USER') {
                window.location.href = '/super-user';
            } else if (role === 'LAB_TECHNICIAN') {
                window.location.href = '/lab-technician';
            }
        }
    }, []);

    const notificationAlert = React.useRef();
    const showAlert = (type, content) => {
        var options = {};
        options = {
            place: 'tc',
            message: (
                <div>
                    <div>
                        {content}
                    </div>
                </div>
            ),
            type: type,
            icon: "now-ui-icons ui-1_bell-53",
            autoDismiss: 2,
        };
        notificationAlert.current.notificationAlert(options);
    }

    function clearAllFields() {
        setEmail('');
        setPassword('');
    }

    const sendLoginRequest = () => {
        if (email.toString().trim() === '' || password.toString().trim() === '') {
            showAlert("warning", "Veuillez remplir tous les champs correctement !")
        } else {
            let data = {
                email: email,
                password: password
            }
            fetch(apiBaseUrl + "/login", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(response => {
                    if (response.code === 1) {
                        showAlert("success", "Connecté avec succès !");
                        Cookies.set('id', response.id, {path: '/'});
                        Cookies.set('role', response.role, {path: '/'});
                        Cookies.set('token', response.token, {path: '/'});
                        if (response.role === 'DOCTOR') {
                            window.location.href = '/doctor';
                        } else if (response.role === 'PATIENT') {
                            window.location.href = '/patient';
                        } else if (response.role === 'SUPER_USER') {
                            window.location.href = '/super-user';
                        }else if (response.role === 'LAB_TECHNICIAN') {
                            window.location.href = '/lab-technician';
                        }
                    } else if (response.code === 2) {
                        showAlert("danger", "Votre compte n'est pas encore activé !");
                        clearAllFields();
                    } else {
                        showAlert("danger", "Email ou mot de passe incorrect !");
                        clearAllFields();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    const goToRegisterPage = () => {
        window.location.href = '/register';
    }

    return (
        <>
            <div className={"bg"}>
                <div className="text-center text-sm-center">

                    <img src={logo} alt="logo"  width="10%"/>

                </div>

                <br/><br/>
                <div className="content">
                    <Row>
                        <Col md="4">

                        </Col>
                        <Col md="4">
                            <Card>
                                <CardHeader>
                                    <h5 style={{textAlign: "center"}} className="title">Se Connecter</h5>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className="pr-1" md="12">
                                                <FormGroup style={{textAlign: "center"}}>
                                                    <label>Email :</label>
                                                    <Input
                                                        style={{textAlign: "center"}}
                                                        onChange={handleChangeOfEmail}
                                                        value={email}
                                                        placeholder="Email"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pr-1" md="12">
                                                <FormGroup style={{textAlign: "center"}}>
                                                    <label>Mot de passe :</label>
                                                    <Input
                                                        style={{textAlign: "center"}}
                                                        onChange={handleChangeOfPassword}
                                                        value={password}
                                                        placeholder="Mot de passe"
                                                        type="password"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pl-1" md="12">
                                                <FormGroup style={{textAlign: "center"}}>
                                                    <Button
                                                        color="primary"
                                                        className="btn-round"
                                                        onClick={() => sendLoginRequest()}>
                                                        Se connecter
                                                    </Button>

                                                    <Button
                                                        color="warning"
                                                        className="btn-round"
                                                        onClick={() => goToRegisterPage()}>
                                                        Créer un compte
                                                    </Button>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4">

                        </Col>
                    </Row>
                </div>
            </div>
            <footer className={"footer footer-default fixed-bottom"}>
                <Container>
                    <div className="copyright">
                        &copy; {1900 + new Date().getYear()} {" "}
                        <a href="/">
                            MedPredict, Tous les droits sont réservés
                        </a>
                    </div>
                </Container>
            </footer>
            <NotificationAlert ref={notificationAlert}/>
        </>
    );
}

export default Login;
