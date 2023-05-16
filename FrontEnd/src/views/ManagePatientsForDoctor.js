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
import MySwal from "sweetalert2";
import Swal from "sweetalert2";
import AddPatientForDoctor from "./AddPatientForDoctor";

function ManagePatientsForDoctor() {
    const [selectedPatientForMedicalFolder, setSelectedPatientForMedicalFolder] = useState("0");
    const [unarchivedElements, setUnarchivedElements] = useState([]);
    const [archivedElements, setArchivedElements] = useState([]);

    const [searchingQueryForUnarchived, setSearchingQueryForUnarchived] = useState('');
    const [searchingQueryForArchived, setSearchingQueryForArchived] = useState('');

    useEffect(() => {
        let token = Cookies.get('token')
        if (token === undefined) {
            window.location.href = '/login';
        }
        refreshUnarchivedList();
        refreshArchivedList();
    }, []);


    const thead = ["Id", "Photo", "Prénom", "Nom", "Email", "GSM", "Adresse", "Activé", "Actions"];

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

    const archiveElement = (user) => {
        fetch(apiBaseUrl + "/users?id=" + user.element.id, {
            "method": "DELETE",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 1) {
                    showAlert("success", "Archivé avec succès !");
                    refreshUnarchivedList();
                    refreshArchivedList()
                } else {
                    showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const unArchiveElement = (user) => {
        fetch(apiBaseUrl + "/users?archived=" + user.element.id, {
            "method": "DELETE",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 1) {
                    showAlert("success", "Désarchivé avec succès !");
                    refreshUnarchivedList();
                    refreshArchivedList()
                } else {
                    showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const disableElement = (user) => {
        let data = {
            activated: false
        }
        fetch(apiBaseUrl + "/users?id=" + user.element.id, {
            "method": "PATCH",
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
                    showAlert("success", "Désactivé avec succès !");
                    refreshUnarchivedList();
                } else {
                    showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const enableElement = (user) => {
        let data = {
            activated: true
        }
        fetch(apiBaseUrl + "/users?id=" + user.element.id, {
            "method": "PATCH",
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
                    showAlert("success", "Activé avec succès !");
                    refreshUnarchivedList();
                } else {
                    showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

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

    function searchWithinUnarchived() {
        if (searchingQueryForUnarchived === "") {
            showAlert("danger", "Veuillez remplir tous les champs !");
        } else {
            let filtered = unarchivedElements.filter((element) => {
                return element.first_name.toLowerCase().includes(searchingQueryForUnarchived.toLowerCase()) || element.last_name.toLowerCase().includes(searchingQueryForUnarchived.toLowerCase()) || element.email.toLowerCase().includes(searchingQueryForUnarchived.toLowerCase()) || element.phone_number.toLowerCase().includes(searchingQueryForUnarchived.toLowerCase()) || element.address.toLowerCase().includes(searchingQueryForUnarchived.toLowerCase())
            });
            setUnarchivedElements(filtered);
        }
    }

    function showAllArchived() {
        setSearchingQueryForArchived("");
        refreshArchivedList();
    }

    function handleChangeOfArchivedQuery(event) {
        setSearchingQueryForArchived(event.target.value);
    }

    function searchWithinArchived() {
        if (searchingQueryForArchived === "") {
            showAlert("danger", "Veuillez remplir tous les champs !");
        } else {
            let filtered = archivedElements.filter((element) => {
                return element.first_name.toLowerCase().includes(searchingQueryForArchived.toLowerCase()) ||
                    element.last_name.toLowerCase().includes(searchingQueryForArchived.toLowerCase()) ||
                    element.email.toLowerCase().includes(searchingQueryForArchived.toLowerCase()) ||
                    element.phone_number.toLowerCase().includes(searchingQueryForArchived.toLowerCase()) ||
                    element.address.toLowerCase().includes(searchingQueryForArchived.toLowerCase())
            });
            setArchivedElements(filtered);
        }
    }

    function showAllUnarchived() {
        setSearchingQueryForUnarchived("");
        refreshUnarchivedList();
    }

    function handleChangeOfUnarchivedQuery(event) {
        setSearchingQueryForUnarchived(event.target.value);
    }

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');


    const handleChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case 'swal-input1':
                setFirstName(value);
                console.log(value);
                console.log("called1")
                break;
            case 'swal-input2':
                setLastName(value);
                console.log("called2")
                break;
            case 'swal-input3':
                setEmail(value);
                console.log("called3")
                break;
            case 'swal-input4':
                setAddress(value);
                console.log("called4")
                break;
            case 'swal-input5':
                setPhoneNumber(value);
                console.log("called5")
                break;
            case 'swal-input6':
                setPassword(value);
                console.log("called6")
                break;
            default:
                break;
        }
    };

        const [showModal, setShowModal] = useState(false);

        const openModal = () => {
            setShowModal(true);
        }

        const closeModal = () => {
            setShowModal(false);
        }

    const Modal = ({ show, onClose, children }) => {
        if(!show) {
            return null;
        }

        return (
            <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '50px'}}>
                <Button
                    style={{marginTop: "22px"}}
                    color="danger"
                    className="btn-round"
                    onClick={onClose}>
                    <i className="fa-sharp fa-solid fa-circle-xmark"></i>
                </Button>
                {children}
            </div>
        );
    }

    function gotoAddPatient() {
       openModal();
    }

    return (
        <>
            <PanelHeader size="sm"/>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{textAlign: "center"}} tag="h4">Liste des patients</CardTitle>
                            </CardHeader>

                            <CardBody>
                                <Form style={{padding: "12px"}}>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Chercher ici :</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfUnarchivedQuery}
                                                    value={searchingQueryForUnarchived}
                                                    placeholder="Chercher ici"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col className="pl-1" md="2">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Button
                                                    style={{marginTop: "22px"}}
                                                    color="success"
                                                    className="btn-round"
                                                    onClick={() => searchWithinUnarchived()}>
                                                    <i className="fa-solid fa-magnifying-glass"></i>

                                                </Button>
                                            </FormGroup>
                                        </Col>

                                        <Col className="pl-1" md="2">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Button
                                                    style={{marginTop: "22px"}}
                                                    color="primary"
                                                    className="btn-round"
                                                    onClick={() => showAllUnarchived()}>
                                                    <i className="fa-sharp fa-solid fa-eye"></i>
                                                </Button>
                                            </FormGroup>
                                        </Col>
                                         <Col className="pl-1" md="2">
                                                <FormGroup style={{textAlign: "center"}}>
                                                    <Button
                                                        style={{marginTop: "22px"}}
                                                        color="danger"
                                                        className="btn-round"
                                                        onClick={() => gotoAddPatient()}
                                                        type="button">
                                                        <i style={{marginRight: "2px"}} className="fa-solid fa-plus"></i>
                                                    Patient</Button>
                                                </FormGroup>
                                            </Col>
                                    </Row>
                                </Form>
                                <Table responsive>
                                    <thead className="text-primary">
                                    <tr className="text-center">
                                        {thead.map((prop, key) => {
                                            return (
                                                <th key={key}>
                                                    {prop}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {unarchivedElements.map((element, index) => {
                                        return (
                                            <tr className="text-center" key={index}>
                                                <td>{element.id}</td>
                                                <td>
                                                    <img
                                                        style={{width: "50px", height: "50px"}}
                                                        src={'http://localhost:9095/static/photos/' + element.photo}
                                                    />
                                                </td>
                                                <td>{element.first_name}</td>
                                                <td>{element.last_name}</td>
                                                <td>{element.email}</td>
                                                <td>{element.phone_number}</td>
                                                <td>{element.address}</td>
                                                <td>{element.activated ? 'OUI' : 'NON'}</td>
                                                <td>
                                                    {!element.activated && <Button
                                                        style={{marginRight: "8px"}}
                                                        className="btn-round"
                                                        color="success"
                                                        onClick={() => enableElement({element})}>
                                                        <i className="fa-solid fa-toggle-on"></i>
                                                    </Button>}
                                                    <Button
                                                        className="btn-round"
                                                        color="danger"
                                                        onClick={() => archiveElement({element})}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{textAlign: "center"}} tag="h4">Liste des patients
                                    (Archivés)</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form style={{padding: "12px"}}>
                                    <Row>
                                        <Col className="pr-1" md="8">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Chercher ici :</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfArchivedQuery}
                                                    value={searchingQueryForArchived}
                                                    placeholder="Chercher ici"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col className="pl-1" md="2">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Button
                                                    style={{marginTop: "22px"}}
                                                    color="success"
                                                    className="btn-round"
                                                    onClick={() => searchWithinArchived()}>
                                                   <i className="fa-solid fa-magnifying-glass"></i>
                                                </Button>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-1" md="2">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Button
                                                    style={{marginTop: "22px"}}
                                                    color="primary"
                                                    className="btn-round"
                                                    onClick={() => showAllArchived()}>
                                                    <i className="fa-sharp fa-solid fa-eye"></i>
                                                </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                                <Table responsive>
                                    <thead className="text-primary">
                                    <tr className="text-center">
                                        {thead.map((prop, key) => {
                                            return (
                                                <th key={key}>
                                                    {prop}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {archivedElements.map((element, index) => {
                                        return (
                                            <tr className="text-center" key={index}>
                                                <td>{element.id}</td>
                                                <td>
                                                    <img
                                                        style={{width: "50px", height: "50px"}}
                                                        src={'http://localhost:9095/static/photos/' + element.photo}
                                                    />
                                                </td>
                                                <td>{element.first_name}</td>
                                                <td>{element.last_name}</td>
                                                <td>{element.email}</td>
                                                <td>{element.phone_number}</td>
                                                <td>{element.address}</td>
                                                <td>{element.activated ? 'OUI' : 'NON'}</td>
                                                <td>
                                                    {!element.activated && <Button
                                                        style={{marginRight: "8px"}}
                                                        className="btn-round"
                                                        color="success"
                                                        onClick={() => enableElement({element})}>
                                                        <i className="fa-solid fa-toggle-on"></i>
                                                    </Button>}
                                                    <Button
                                                        className="btn-round"
                                                        color="success"
                                                        onClick={() => unArchiveElement({element})}>
                                                        <i className="fa-sharp fa-solid fa-trash-can-arrow-up"></i>                                               </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
            <NotificationAlert ref={notificationAlert}/>
            <Modal show={showModal} onClose={closeModal}>
                <AddPatientForDoctor />
            </Modal>
        </>
    );
}

export default ManagePatientsForDoctor;
