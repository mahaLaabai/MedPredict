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

function PatientAccount() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');

    function getPatientInfo() {
        fetch(apiBaseUrl + '/users?id=' + Cookies.get('id'), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(data => {
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setEmail(data.email);
                setAddress(data.address);
                setPhoneNumber(data.phone_number);
            });
    }

    useEffect(() => {
        let token = Cookies.get('token')
        if (token === undefined) {
            window.location.href = '/login';
        }
        getPatientInfo();
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

    function sendRequestToUpdatePersonalInformation() {
        let id = Cookies.get('id');
        if (firstName === '' || lastName === '' || email === '' || address === '' || phoneNumber === '') {
            showAlert("danger", "Veuillez remplir tous les champs !");
            return;
        }
        let body = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            address: address,
            phone_number: phoneNumber,
            photo : ''
        }
        fetch(apiBaseUrl + '/users?id=' + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": Cookies.get("token")
            }, body: JSON.stringify(body)
        }).then(response => response.json())
            .then(data => {
                if (data.code === 1) {
                    showAlert("success", "Vos informations ont été mises à jour !");
                } else {
                    showAlert("danger", "Une erreur est survenue !");
                }
            });
}

return (
    <>
        <PanelHeader size="sm"/>
        <div className="content">
            <Row>
                <Col md="12">
                    <Card>
                        <CardHeader>
                            <h5 style={{textAlign: "center"}} className="title">Mes information personnelles</h5>
                        </CardHeader>
                        <CardBody>
                            <Form style={{padding: "12px"}}>
                                <Row>
                                    <Col className="pl-1" md="6">
                                        <FormGroup>
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
                                        <FormGroup>
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
                                        <FormGroup>
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
                                        <FormGroup>
                                            <Label htmlFor="phoneNumber">Numéro de téléphone :</Label>
                                            <Input
                                                type="tel"
                                                id="phoneNumber"
                                                value={phoneNumber}
                                                onChange={(event) => setPhoneNumber(event.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col className="pl-1" md="12">
                                        <FormGroup>
                                            <Label htmlFor="address">Adresse :</Label>
                                            <Input
                                                type="text"
                                                id="address"
                                                value={address}
                                                onChange={(event) => setAddress(event.target.value)}
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
                                                onClick={() => sendRequestToUpdatePersonalInformation()}>
                                                Mettre à jour
                                            </Button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>

                    </Card>
                </Col>
            </Row>
        </div>
        <NotificationAlert ref={notificationAlert}/>
    </>
);
}

export default PatientAccount;
