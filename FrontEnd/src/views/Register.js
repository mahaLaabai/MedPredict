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

function Register() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('');

    const handleChangeOfRole = (event) => {
        setRole(event.target.value);
    }
    useEffect(() => {
        let token = Cookies.get('token')
        if (token !== undefined) {
            let role = Cookies.get('role')
            if (role === 'DOCTOR') {
                window.location.href = '/doctor';
            } else if (role === 'PATIENT') {
                window.location.href = '/patient';
            }else if (role === 'SUPER_USER') {
                window.location.href = '/super-user';
            }else if (role === 'LAB_TECHNICIAN') {
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
        setFirstName('');
        setLastName('');
        setEmail('');
        setAddress('');
        setPhoneNumber('');
        setPassword('');
        setRole('');
    }

    const sendRegisterRequest = () => {
        if (email.toString().trim() === '' || password.toString().trim() === '' || firstName.toString().trim() === '' || lastName.toString().trim() === '' || address.toString().trim() === '' || role.toString().trim() === '') {
            showAlert("warning", "Veuillez remplir tous les champs correctement !")
        } else {
            let data = {
                email: email,
                password: password,
                first_name: firstName,
                phone_number: phoneNumber,
                last_name: lastName,
                address: address,
                role: role
            }
            fetch(apiBaseUrl + "/register", {
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
                        showAlert("success", "Compte crée avec succès, une fois activé, vous pouvez vous connecter !")
                        clearAllFields();
                    } else {
                        showAlert("danger", "Cet email ou GSM est déjà utilisé !");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    function returnToLoginPage() {
        window.location.href = '/login';
    }

    return (
        <>
            <div className={"bg"}>
                <div className="text-center text-sm-center">
                    <img width="10%" src={logo} alt="logo"/>
                </div>

                <br/><br/>
                <div className="content">
                    <Row>
                        <Col md="2">

                        </Col>
                        <Col md="8">
                            <Card>
                                <CardHeader>
                                    <h5 style={{textAlign: "center"}} className="title">Créer un compte</h5>
                                </CardHeader>
                                <CardBody>
                                    <Form style={{padding: "6px"}}>
                                        <Row>
                                            <Col className="pl-1" md="4">
                                                <FormGroup style={{textAlign: 'center'}}>
                                                    <Label htmlFor="firstName">Prénom :</Label>
                                                    <Input
                                                        type="text"
                                                        id="firstName"
                                                        value={firstName}
                                                        onChange={(event) => setFirstName(event.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="4">
                                                <FormGroup style={{textAlign: 'center'}}>
                                                    <Label htmlFor="lastName">Nom de famille :</Label>
                                                    <Input
                                                        type="text"
                                                        id="lastName"
                                                        value={lastName}
                                                        onChange={(event) => setLastName(event.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="4">
                                                <FormGroup style={{textAlign: 'center'}}>
                                                    <Label htmlFor="email">Adresse email :</Label>
                                                    <Input
                                                        type="email"
                                                        id="email"
                                                        value={email}
                                                        onChange={(event) => setEmail(event.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="4">
                                                <FormGroup style={{textAlign: 'center'}}>
                                                    <Label htmlFor="phoneNumber">Numéro de téléphone :</Label>
                                                    <Input
                                                        type="tel"
                                                        id="phoneNumber"
                                                        value={phoneNumber}
                                                        onChange={(event) => setPhoneNumber(event.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="4">
                                                <FormGroup style={{textAlign: 'center'}}>
                                                    <Label htmlFor="password">Mot de passe :</Label>
                                                    <Input
                                                        type="password"
                                                        id="password"
                                                        value={password}
                                                        onChange={(event) => setPassword(event.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="4">
                                                <FormGroup style={{textAlign: 'center'}}>
                                                    <Label htmlFor="address">Adresse :</Label>
                                                    <Input
                                                        type="text"
                                                        id="address"
                                                        value={address}
                                                        onChange={(event) => setAddress(event.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="12">
                                                <FormGroup style={{padding: "4px", textAlign: "center"}}>
                                                    <Label>Rôle :</Label>
                                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                                                        <Label check style={{ marginRight: "2rem" }}>
                                                            <Input
                                                                type="radio"
                                                                name="role"
                                                                value="PATIENT"
                                                                checked={role === "PATIENT"}
                                                                onChange={handleChangeOfRole}
                                                            />
                                                            PATIENT
                                                        </Label>

                                                        <Label check style={{ marginRight: "2rem" }}>
                                                            <Input
                                                                type="radio"
                                                                name="role"
                                                                value="DOCTOR"
                                                                checked={role === "DOCTOR"}
                                                                onChange={handleChangeOfRole}
                                                            />
                                                            MEDECIN
                                                        </Label>

                                                        <Label check>
                                                            <Input
                                                                type="radio"
                                                                name="role"
                                                                value="LAB_TECHNICIAN"
                                                                checked={role === "LAB_TECHNICIAN"}
                                                                onChange={handleChangeOfRole}
                                                            />
                                                            Tech-LABO
                                                        </Label>
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="6">
                                                <FormGroup style={{textAlign: "center"}}>
                                                    <Button
                                                        color="primary"
                                                        className="btn-round"
                                                        onClick={() => sendRegisterRequest()}
                                                        type="button"
                                                    >
                                                        Créer un compte
                                                    </Button>
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="6">
                                                <FormGroup style={{textAlign: "center"}}>
                                                    <Button
                                                        color="danger"
                                                        className="btn-round"
                                                        onClick={() => returnToLoginPage()}
                                                        type="button"
                                                    >
                                                        Se Connecter
                                                    </Button>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>

                            </Card>
                        </Col>
                        <Col md="2">

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

export default Register;
