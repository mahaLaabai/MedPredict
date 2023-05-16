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
import '../assets/css/login.css'

function UpdateMedicalFolderForPatient() {
    const [doctorsForMedicalFolder, setDoctorsForMedicalFolder] = useState([]);
    const [folderNumber, setFolderNumber] = useState('');
    const [service, setService] = useState('');
    const [nationality, setNationality] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [medicalCover, setMedicalCover] = useState('');
    const [practitioner, setPractitioner] = useState('');
    const [statusReport, setStatusReport] = useState('');
    const [analysis, setAnalysis] = useState('');
    var theDoctor = 1;

    function refreshDoctorsListForMedicalFolder() {
        fetch(apiBaseUrl + "/users?role=DOCTOR&archived=0", {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                setDoctorsForMedicalFolder(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        let token = Cookies.get('token')
        if (token === undefined) {
            window.location.href = '/login';
        }
        getPatientMedicalfolder();
        refreshDoctorsListForMedicalFolder();
    }, []);

    function getPatientMedicalfolder() {
        let id = Cookies.get('id');
        fetch(apiBaseUrl + '/medicalfolders?patient=' + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    data = data[0];
                    setFolderNumber(data.folderNumber);
                    setService(data.service);
                    setBloodGroup(data.blood_group);
                    setMedicalCover(data.medical_cover);
                    setNationality(data.nationality);
                    setGender(data.gender);
                    setDateOfBirth(data.birth_date);
                    setAnalysis(data.analysis);
                    setStatusReport(data.status_report);
                    theDoctor = data.practitioner_doctor;
                    fetch(apiBaseUrl + '/users?id=' + data.practitioner_doctor, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": Cookies.get("token")
                        }
                    }).then(response => response.json())
                        .then(data => {
                                setPractitioner('Le médecin: ' + data.first_name + " " + data.last_name);
                            }
                        );
                } else {
                    showAlert("warning", "Aucun dossier médical trouvé pour ce patient, Veuillez saisir les informations necessaries !");
                    setFolderNumber('');
                    setService('');
                    setBloodGroup('');
                    setMedicalCover('');
                    setPractitioner('');
                    setNationality('');
                    setGender('');
                    setDateOfBirth('');
                    setAnalysis('');
                    setStatusReport('');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleChangeOfFolderNumber = (event) => {
        setFolderNumber(event.target.value);
    };

    const handleChangeOfService = (event) => {
        setService(event.target.value);
    };

    const handleChangeOfNationality = (event) => {
        setNationality(event.target.value);
    };

    const handleChangeOfGender = (event) => {
        setGender(event.target.value);
    };

    const handleChangeOfDateOfBirth = (event) => {
        setDateOfBirth(event.target.value);
    };

    const handleChangeOfBloodGroup = (event) => {
        setBloodGroup(event.target.value);
    };

    const handleChangeOfMedicalCover = (event) => {
        setMedicalCover(event.target.value);
    };

    const handleChangeOfPractitioner = (event) => {
        setPractitioner(event.target.value);
    };

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

    function sendUpdateMedicalFolderRequest() {
        let data = {
            patient: parseInt(Cookies.get('id')),
            folderNumber: folderNumber,
            service: service,
            nationality: nationality,
            gender: gender,
            birth_date: dateOfBirth,
            blood_group: bloodGroup,
            medical_cover: medicalCover,
            status_report: statusReport,
            analysis: analysis,
            practitioner_doctor: parseInt(theDoctor)
        }
        fetch(apiBaseUrl + "/medicalfolders?patient=" + Cookies.get("id"), {
            "method": "PUT",
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
                    showAlert("success", "Dossier médical modifié avec succès !");
                } else {
                    showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    function handleChangeOfAnalysis(event) {
        setAnalysis(event.target.value);
    }

    function handleChangeOfStatusReport(event) {
        setStatusReport(event.target.value);
    }



    return (
        <>
            <PanelHeader size="sm"/>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{textAlign: "center"}} tag="h4">Mettre à jour votre dossier
                                    médical</CardTitle>
                            </CardHeader>


                                     <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-center">
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <a className="page-link" href="update-medical-folder" aria-label="Previous">
                                                    <span aria-hidden="true">&laquo;</span>
                                                    <span className="sr-only">Previous</span>
                                                </a>
                                            </li>
                                            <li className="page-item"><a className="page-link" href="update-medical-folder">Information Personnel </a></li>
                                            <li className="page-item"><a className="page-link" href="update-medical-folder2">Protocole standart</a></li>
                                            <li className="page-item"><a  className="page-link" href="update-medical-folder3">historique des maladies</a></li>
                                            <li className="page-item"><a className="page-link" href="update-medical-folder4">Les maladies cronique </a></li>

                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Next">
                                                    <span aria-hidden="true">&raquo;</span>
                                                    <span className="sr-only">Next</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                       </ul>
                                     </nav>


                            <CardBody>
                                <Form style={{padding: "12px"}}>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Numéro de dossier :</label>
                                                <Input
                                                    disabled={true}
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfFolderNumber}
                                                    value={folderNumber}
                                                    placeholder="Numéro de dossier"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Service :</label>
                                                <Input type="select" style={{textAlign: "center"}}
                                                       onChange={handleChangeOfService}
                                                       value={service}>
                                                    <option value="SERVICE1">Service 1</option>
                                                    <option value="SERVICE2">Service 2</option>
                                                    <option value="SERVICE3">Service 3</option>
                                                    <option value="SERVICE4">Service 4</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Nationalité :</label>
                                                <Input type="select" style={{textAlign: "center"}}
                                                       onChange={handleChangeOfNationality}
                                                       value={nationality}>
                                                    <option value="">Choisissez une nationalité</option>
                                                    <option value="Maroc">Maroc</option>
                                                    <option value="Afghanistan">Afghanistan</option>
                                                    <option value="Albania">Albania</option>
                                                    <option value="Algeria">Algeria</option>
                                                    <option value="Andorra">Andorra</option>
                                                    <option value="Angola">Angola</option>
                                                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                                    <option value="Argentina">Argentina</option>
                                                    <option value="Armenia">Armenia</option>
                                                    <option value="Australia">Australia</option>
                                                    <option value="Austria">Austria</option>
                                                    <option value="Azerbaijan">Azerbaijan</option>
                                                    <option value="Bahamas">Bahamas</option>
                                                    <option value="Bahrain">Bahrain</option>
                                                    <option value="Bangladesh">Bangladesh</option>
                                                    <option value="Barbados">Barbados</option>
                                                    <option value="Belarus">Belarus</option>
                                                    <option value="Belgium">Belgium</option>
                                                    <option value="Belize">Belize</option>
                                                    <option value="Benin">Benin</option>
                                                    <option value="Bhutan">Bhutan</option>
                                                    <option value="Bolivia">Bolivia</option>
                                                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina
                                                    </option>
                                                    <option value="Botswana">Botswana</option>
                                                    <option value="Brazil">Brazil</option>
                                                    <option value="Brunei">Brunei</option>
                                                    <option value="Bulgaria">Bulgaria</option>
                                                    <option value="Burkina Faso">Burkina Faso</option>
                                                    <option value="Burundi">Burundi</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Genre :</label>
                                                <Input type="select" style={{textAlign: "center"}}
                                                       onChange={handleChangeOfGender}
                                                       value={gender}>
                                                    <option value="HOMME">Homme</option>
                                                    <option value="FEMME">Femme</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Date de naissance :</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfDateOfBirth}
                                                    value={dateOfBirth}
                                                    placeholder="Date de naissance"
                                                    type="date"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Groupe sanguin :</label>
                                                <Input type="select" style={{textAlign: "center"}}
                                                       onChange={handleChangeOfBloodGroup} value={bloodGroup}>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Couverture médicale :</label>
                                                <Input type="select" style={{textAlign: "center"}}
                                                       onChange={handleChangeOfMedicalCover}
                                                       value={medicalCover}>
                                                    <option value="CNOPS">CNOPS</option>
                                                    <option value="CNSS">CNSS</option>
                                                    <option value="FAR">FAR</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Médecin Praticien :</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfPractitioner}
                                                    value={practitioner}
                                                    placeholder="Médecin Praticien"
                                                    type="select"
                                                >
                                                    {doctorsForMedicalFolder.map(doctor => (
                                                        <option key={doctor.id}
                                                                value={doctor.id}>{'Le médecin: ' + doctor.first_name + ' ' + doctor.last_name}</option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>

                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Analyse :</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfAnalysis}
                                                    value={analysis}
                                                    placeholder="Analyse"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col className="pr-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Etat de rapport :</label>
                                                <br></br>
                                                <textarea
                                                    disabled={true}
                                                    style={{textAlign: "center", width: "420px", height: "100px"}}
                                                    onChange={handleChangeOfStatusReport}
                                                    value={statusReport}
                                                    placeholder="Etat de rapport"
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
                                                    onClick={() => sendUpdateMedicalFolderRequest()}>
                                                    Mettre à jour votre dossier médical
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

export default UpdateMedicalFolderForPatient;
