import React, {useState, useEffect} from 'react';
import NotificationAlert from "react-notification-alert";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col, CardTitle, Table, Form, FormGroup, Label, Input,
} from "reactstrap";
import uploadedImage from "../assets/img/upload.png";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {apiBaseUrl, tbody, thead} from "../variables/general";
import Cookies from 'js-cookie';

function UploadScan() {
    const [patientsForUploadScan, setPatientsForUploadScan] = useState([]);
    const [selectedPatientForUploadScan, setSelectedPatientForUploadScan] = useState("0");
    const [elements, setElements] = useState([]);
    const [scanFile, setScanFile] = useState("");
    const [scanDate, setScanDate] = useState("");

    const [searchingQueryForScans, setSearchingQueryForScans] = useState('');

    useEffect(() => {
        let token = Cookies.get('token')
        if (token === undefined) {
            window.location.href = '/login';
        }
        refreshScansList();
        refreshPatientsListForUploadScan();
    }, []);


    function refreshPatientsListForUploadScan() {
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
                setPatientsForUploadScan(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const thead = ["Id", "Patient", "Scan", "Date", "Actions"];

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

    const handlePatientChange = (event) => {
        setSelectedPatientForUploadScan(event.target.value.toString());
    };

    const refreshScansList = () => {
        fetch(apiBaseUrl + "/scans", {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                for (let i = 0; i < response.length; i++) {
                    fetch(apiBaseUrl + "/users?id=" + response[i].patient, {
                        "method": "GET",
                        "headers": {
                            "content-type": "application/json",
                            "Authorization": Cookies.get("token")
                        }
                    })
                        .then(theResponse => theResponse.json())
                        .then(theResponse => {
                            let newElements = [...response];
                            newElements[i].patient = theResponse.first_name + " " + theResponse.last_name;
                            setElements(newElements);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    function setImage(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log(reader.result)
            let result = reader.result.split(",")[1];
            setScanFile(result);
        }
    }

    function clearAllFields() {
        setSelectedPatientForUploadScan("0");
        setScanFile("");
        setScanDate("");
    }

    function sendAddScanRequest() {
        if (selectedPatientForUploadScan === "0") {
            showAlert("danger", "Veuillez choisir un patient !");
            return;
        }

        fetch(apiBaseUrl + "/users?id=" + selectedPatientForUploadScan, {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                if (scanFile === "") {
                    showAlert("danger", "Veuillez choisir une image de scan !");
                    return;
                }
                if (scanDate === undefined) {
                    showAlert("danger", "Veuillez choisir une date !");
                    return;
                }
                let data = {
                    patient: parseInt(selectedPatientForUploadScan),
                    scan_file: scanFile,
                    added_at: scanDate,
                    scan_result: 'PENDING'
                }
                console.log(data)
                fetch(apiBaseUrl + "/scans", {
                    "method": "POST",
                    "headers": {
                        "content-type": "application/json",
                        "accept": "application/json",
                        "Authorization": Cookies.get("token")
                    },
                    body: JSON.stringify(data)
                }).then(response => response.json())
                    .then(response => {
                            console.log(response)
                            if (response.code === 1) {
                                showAlert("success", "Ajouté avec succès !");
                                refreshScansList();
                                clearAllFields();
                            } else {
                                showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                            }
                        }
                    );
            })
            .catch(error => {
                showAlert("danger", "Ce patient n'existe pas !");
            });
        }

    function OpenScanImageInNewTab(scan) {
        window.open('http://localhost:9095/static/photos/' + scan.scan_file, '_blank');
    }


    function searchWithinScans() {
        if (searchingQueryForScans=== "") {
            showAlert("danger", "Veuillez remplir tous les champs !");
        } else {
            let filtered = elements.filter((element) => {
                return element.id.toString().toLowerCase().includes(searchingQueryForScans.toLowerCase()) ||
                    element.added_at.toLowerCase().includes(searchingQueryForScans.toLowerCase())
            });
            setElements(filtered);
        }
    }

    function showAllscans() {
        setSearchingQueryForScans("");
        refreshScansList()
    }

    function handleChangeOfScansQuery(event) {
        setSearchingQueryForScans(event.target.value);
    }


    return (
        <>
            <PanelHeader size="sm"/>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <h5 style={{textAlign: "center"}} className="title">Charger un scan</h5>
                            </CardHeader>
                            <CardBody>
                                <Form style={{padding: "12px"}}>
                                    <Row>
                                        <Col className="pr-1" md="12">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Label for="patientSelect">Id du Patient:</Label>
                                                <Input type="number" name="patient" id="patientId"
                                                       onChange={handlePatientChange}>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-1" md="6">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Label htmlFor="firstName">Charger une image :</Label>
                                                <Input
                                                    accept="image/jpeg"
                                                    type="file"
                                                    id="image"
                                                    onChange={(event) => setImage(event.target.files[0])}
                                                />
                                                <br></br>
                                                <img
                                                    src={uploadedImage}
                                                    alt="scan" style={{width: "14%", height: "14%"}}/>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-1" md="6">
                                            <FormGroup>
                                                <Label htmlFor="lastName">Date du scan :</Label>
                                                <Input
                                                    type="date"
                                                    id="date"
                                                    value={scanDate.substring(0, 10)}
                                                    onChange={(event) => setScanDate(event.target.value.toString())}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-1" md="12">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Button
                                                    color="primary"
                                                    className="btn-round"
                                                    onClick={() => sendAddScanRequest()}
                                                    type="button"
                                                >
                                                    Ajouter le scan
                                                </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>

                        </Card>
                    </Col>

                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{textAlign: "center"}} tag="h4">Liste des scans</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form style={{padding: "12px"}}>
                                    <Row>
                                        <Col className="pr-1" md="8">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Chercher ici :</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfScansQuery}
                                                    value={searchingQueryForScans}
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
                                                    onClick={() => searchWithinScans()}>
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
                                                    onClick={() => showAllscans()}>
                                                    <i className="fa-sharp fa-solid fa-eye"></i> Tout
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
                                    {elements.map((element, index) => {
                                        return (
                                            <tr className="text-center" key={index}>
                                                <td>{element.id}</td>
                                                <td>{element.patient}</td>
                                                <td>
                                                    <img
                                                        style={{width: "160px", height: "160px"}}
                                                        src={'http://localhost:9095/static/photos/' + element.scan_file}
                                                    />
                                                </td>
                                                <td>{element.added_at}</td>
                                                <td>
                                                    <Button
                                                        className="btn-round"
                                                        color="success"
                                                        onClick={() => OpenScanImageInNewTab(element)}>
                                                        <i className="fa-sharp fa-solid fa-eye"></i>
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
                </Row>
            </div>
            <NotificationAlert ref={notificationAlert}/>
        </>
    );
}

export default UploadScan;
