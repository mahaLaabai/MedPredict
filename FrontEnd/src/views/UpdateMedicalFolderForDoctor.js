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

function UpdateMedicalFolderForDoctor() {
    const [patientsForMedicalFolder, setPatientsForMedicalFolder] = useState([]);
    const [doctorsForMedicalFolder, setDoctorsForMedicalFolder] = useState([]);
    const [patient, setPatient] = useState(0);
    const [folderNumber, setFolderNumber] = useState('');
    const [service, setService] = useState('');
    const [nationality, setNationality] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [medicalCover, setMedicalCover] = useState('');
    const [practitioner, setPractitioner] = useState(0);
    const [statusReport, setStatusReport] = useState('');
    const [analysis, setAnalysis] = useState('');

    function refreshPatientsListForMedicalFolder() {
        fetch(apiBaseUrl + "/users?role=PATIENT", {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                setPatientsForMedicalFolder(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

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
        refreshPatientsListForMedicalFolder();
        refreshDoctorsListForMedicalFolder()

        localStorage.setItem("lastSearchedPatient", null);

    }, []);

    const handlePatientChange = (event) => {
       setPatient(parseInt(event.target.value.toString()));
    };

    const handleChangeOfPatient = (event) => {
        setPatient(event.target.value);
    };

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
            patient: patient,
            folderNumber: folderNumber,
            service: service,
            nationality: nationality,
            gender: gender,
            birth_date: dateOfBirth,
            blood_group: bloodGroup,
            medical_cover: medicalCover,
            status_report: statusReport,
            analysis: analysis,
            practitioner_doctor: practitioner
        }
        fetch(apiBaseUrl + "/medicalfolders?patient=" + patient, {
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

    function getPatientMedicalFolder() {
        if(patient===0){
            showAlert("danger", "Veuillez saisir l'Id du patient !");
            return;
        }

        localStorage.setItem("lastSearchedPatient", patient);

        fetch(apiBaseUrl + '/medicalfolders?patient=' + patient, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    showAlert("success", "Veuillez saisir les informations du dossier médical !");
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
                    setPractitioner(data.practitioner_doctor)
                    fetch(apiBaseUrl + '/users?id=' + data.practitioner_doctor, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": Cookies.get("token")
                        }
                    }).then(response => response.json())
                        .then(data => {
                                //setPractitioner('Le médecin: ' + data.first_name + " " + data.last_name);
                            }
                        );
                } else {
                    showAlert("danger", "L'Id entré ne correspond à aucun patient !");
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

    return (
        <>
            <PanelHeader size="sm"/>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{textAlign: "center"}} tag="h4">Mettre à jour le dossier
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
                                            <li className="page-item"><a className="page-link" href="#">historique des maladies</a></li>
                                            <li className="page-item"><a className="page-link" href="#">Les maladies cronique </a></li>

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
                                        <Col className="pr-1" md="10">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Label for="patientSelect">Entrez l'Id du patient:</Label>
                                                <Input type="text" name="patient" id="patientSelect"
                                                       onChange={handlePatientChange} />
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-1" md="2">
                                            <FormGroup style={{marginTop: "16px"}}>
                                                <Button
                                                    className="btn-round"
                                                    color="success"
                                                    onClick={() => getPatientMedicalFolder()}>
                                                    <i className="fa-solid fa-magnifying-glass"></i>
                                                </Button>
                                            </FormGroup>
                                        </Col>

                                    </Row>
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
                                                    <option value="">Choisissez un service</option>
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
                                                    <option value="">Choisissez un genre</option>
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
                                                    <option value="">Choisissez un groupe sanguin</option>
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
                                                    <option value="">Choisissez une couverture médicale</option>
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
                                                    name={"practitioner"}
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfPractitioner}
                                                    value={practitioner}
                                                    placeholder="Médecin Praticien"
                                                    type="select"
                                                >
                                                    <option value="0">Choisissez un médecin</option>
                                                    {doctorsForMedicalFolder.map(doctor => (
                                                        <option key={doctor.id}
                                                                value={doctor.id}>{'Le médecin: '+doctor.first_name + ' ' + doctor.last_name}</option>
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
                                                    Mettre à jour le dossier médical
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

export default UpdateMedicalFolderForDoctor;
