import React from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Input, Button,
} from "reactstrap";

import routes from "super-user-routes";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
import {apiBaseUrl} from "../../variables/general";

function DemoNavbar(props) {
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [color, setColor] = React.useState("transparent");
    const [notifications, setNotifications] = React.useState([]);

    const sidebarToggle = React.useRef();
    const toggle = () => {
        if (isOpen) {
            setColor("transparent");
        } else {
            setColor("white");
        }
        setIsOpen(!isOpen);
    };

    function sendRequestToMakePatientScansSeen() {
        let id = Cookies.get('id');
        fetch(apiBaseUrl + "/scans?makeSeen=true&ofPatient=" + id, {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const dropdownToggle = (e) => {
        setDropdownOpen(!dropdownOpen);
        sendRequestToMakePatientScansSeen();
    };
    const getBrand = () => {
        var name;
        routes.map((prop, key) => {
            if (prop.collapse) {
                prop.views.map((prop, key) => {
                    if (prop.path === props.location.pathname) {
                        name = prop.name;
                    }
                    return null;
                });
            } else {
                if (prop.redirect) {
                    if (prop.path === props.location.pathname) {
                        name = prop.name;
                    }
                } else {
                    if (prop.path === props.location.pathname) {
                        name = prop.name;
                    }
                }
            }
            return null;
        });
        return name;
    };
    const openSidebar = () => {
        document.documentElement.classList.toggle("nav-open");
        sidebarToggle.current.classList.toggle("toggled");
    };
// function that adds color white/transparent to the navbar on resize (this is for the collapse)
    const updateColor = () => {
        if (window.innerWidth < 993 && isOpen) {
            setColor("white");
        } else {
            setColor("transparent");
        }
    };

    function getCurrentPatientScans() {
        let id = Cookies.get('id');
        fetch(apiBaseUrl + "/scans?ofPatient=" + id, {
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
                    let notification = {
                        id: response[i].id,
                        message: 'Les résultats de votre Scan du: '+response[i].added_at+' sont disponibles, Veuillez vous présenter à notre cabinet pour les récupérer !',
                        date: response[i].added_at,
                        new: !response[i].seen_by_patient
                    }
                    setNotifications(notifications => [...notifications, notification]);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    React.useEffect(() => {
        window.addEventListener("resize", updateColor);
        getCurrentPatientScans();
    }, []);
    React.useEffect(() => {
        if (
            window.innerWidth < 993 &&
            document.documentElement.className.indexOf("nav-open") !== -1
        ) {
            document.documentElement.classList.toggle("nav-open");
            sidebarToggle.current.classList.toggle("toggled");
        }
    }, [location]);

    function logout() {
        Swal.fire({
            title: 'Vous voulez vraiment vous déconnecter ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Oui',
            denyButtonText: `Non`,
        }).then((result) => {
            if (result.isConfirmed) {
                Cookies.remove('id', {path: '/'});
                Cookies.remove('role', {path: '/'});
                Cookies.remove('token', {path: '/'});
                window.location.href = '/login';
            }
        })
    }

    return (
        <Navbar color={props.location.pathname.indexOf("full-screen-maps") !== -1 ? "white" : color} expand="lg"
                className={props.location.pathname.indexOf("full-screen-maps") !== -1 ? "navbar-absolute fixed-top" : "navbar-absolute fixed-top " + (color === "transparent" ? "navbar-transparent " : "")}>
            <Container fluid>
                <div className="navbar-wrapper">
                    <div className="navbar-toggle">
                        <button type="button" ref={sidebarToggle} className="navbar-toggler"
                                onClick={() => openSidebar()}>
                            <span className="navbar-toggler-bar bar1"/>
                            <span className="navbar-toggler-bar bar2"/>
                            <span className="navbar-toggler-bar bar3"/>
                        </button>
                    </div>
                    <NavbarBrand href="/">{getBrand()}</NavbarBrand>
                </div>
                <NavbarToggler onClick={toggle}>
                    <span className="navbar-toggler-bar navbar-kebab"/>
                    <span className="navbar-toggler-bar navbar-kebab"/>
                    <span className="navbar-toggler-bar navbar-kebab"/>
                </NavbarToggler>
                <Collapse isOpen={isOpen} navbar className="justify-content-end">
                    <Nav navbar>
                        {
                            Cookies.get("role") === "PATIENT" && <NavItem>
                                <NavLink className="now-ui-icons" tag={Link} to="/" onClick={dropdownToggle}>
                                    <i className="fa fa-bell-o" aria-hidden="true"></i>
                                    {notifications.filter((notification) => notification.new).length > 0 &&
                                        <span
                                            className="badge badge-danger ml-1">{notifications.filter((notification) => notification.new).length}</span>
                                    }
                                </NavLink>
                                <Dropdown isOpen={dropdownOpen} toggle={dropdownToggle}>
                                    <DropdownToggle nav caret></DropdownToggle>
                                    <DropdownMenu right>
                                        {notifications.map((notification) =>
                                            <DropdownItem key={notification.id}>
                                                {notification.message}
                                                <br/>
                                                <small>{notification.date}</small>
                                                {notification.new &&
                                                    <span className="badge badge-danger ml-1">new</span>
                                                }
                                            </DropdownItem>
                                        )}
                                    </DropdownMenu>
                                </Dropdown>
                            </NavItem>
                        }
                        <NavItem>
                            <Button className="btn-round" color="danger" onClick={() => logout()}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            </Button>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
}

export default DemoNavbar;
