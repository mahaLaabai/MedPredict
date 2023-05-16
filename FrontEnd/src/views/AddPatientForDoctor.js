import React, {useState, useEffect} from 'react';
import NotificationAlert from "react-notification-alert";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col, CardTitle, Table, Form, FormGroup, Input, Label,
} from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {apiBaseUrl, tbody, thead} from "../variables/general";
import Cookies from 'js-cookie';

function AddPatientForDoctor() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [password, setPassword] = React.useState('');

    useEffect(() => {
        let token = Cookies.get('token')
        if (token === undefined) {
            window.location.href = '/login';
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

    const refreshUnarchivedList = () => {
        fetch(apiBaseUrl + "/users?role=PATIENT&archived=0", {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                setUnarchivedElements(response);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const refreshArchivedList = () => {
        fetch(apiBaseUrl + "/users?role=PATIENT&archived=1", {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                setArchivedElements(response);
            })
            .catch(error => {
                console.log(error);
            });
    };

    function clearAllFields() {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        setAddress("");
    }

    function sendCreatePatientRequest() {
        if (firstName === "" || lastName === "" || email === "" || password === "" || phoneNumber === "" || address === "") {
            showAlert("danger", "Veuillez remplir tous les champs !");
            return;
        }
        let data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            phone_number: phoneNumber,
            address: address,
            role: "PATIENT"
        }
        fetch(apiBaseUrl + "/register", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 1) {
                    showAlert("success", "Patient ajouté avec succès !");
                    refreshUnarchivedList();
                    clearAllFields();
                } else {
                    showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <h5 style={{textAlign: "center"}} className="title">Ajouter un patient</h5>
                </CardHeader>
                <CardBody>
                    <Form style={{padding: "12px"}}>
                        <Row>
                            <Col className="pl-1" md="6">
                                <FormGroup style={{textAlign: "center"}}>
                                    <Label htmlFor="firstName">Prénom :</Label>
                                    <Input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(event) => setFirstName(event.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col className="pl-1" md="6">
                                <FormGroup style={{textAlign: "center"}}>
                                    <Label htmlFor="lastName">Nom de famille :</Label>
                                    <Input
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(event) => setLastName(event.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col className="pl-1" md="6">
                                <FormGroup style={{textAlign: "center"}}>
                                    <Label htmlFor="email">Adresse email :</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col className="pl-1" md="6">
                                <FormGroup style={{textAlign: "center"}}>
                                    <Label htmlFor="address">Adresse :</Label>
                                    <Input
                                        type="text"
                                        id="address"
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col className="pl-1" md="6">
                                <FormGroup style={{textAlign: "center"}}>
                                    <Label htmlFor="phoneNumber">Numéro de téléphone :</Label>
                                    <Input
                                        type="tel"
                                        id="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(event) => setPhoneNumber(event.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col className="pl-1" md="6">
                                <FormGroup style={{textAlign: "center"}}>
                                    <Label htmlFor="password">Mot de passe :</Label>
                                    <Input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
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
                                        onClick={() => sendCreatePatientRequest()}
                                        type="button"
                                    >
                                        Ajouter le patient
                                    </Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
            <NotificationAlert ref={notificationAlert}/>
        </>
    );
}

export default AddPatientForDoctor;
