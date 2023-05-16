import React from "react";
import {NavLink} from "react-router-dom";
import {Nav} from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";
import logo from "../../assets/img/logo.png";

let ps;

function Sidebar(props) {
    const sidebar = React.useRef();
    const activeRoute = (routeName) => {
        return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    };
    React.useEffect(() => {
        if (navigator.platform.indexOf("Win") > -1) {
            ps = new PerfectScrollbar(sidebar.current, {
                suppressScrollX: true,
                suppressScrollY: false,
            });
        }
        return function cleanup() {
            if (navigator.platform.indexOf("Win") > -1) {
                ps.destroy();
            }
        };
    });
    return (
        <div className="sidebar" data-color={props.backgroundColor}>
            <div className="sidebar-wrapper" ref={sidebar}>
                <Nav>
                    {props.routes.map((prop, key) => {
                        if (prop.redirect) return null;
                        return (
                            <li
                                className={
                                    activeRoute(prop.layout + prop.path) +
                                    (prop.pro ? " active active-pro" : "")
                                }
                                key={key}
                            >
                                <NavLink
                                    to={prop.layout + prop.path}
                                    className="nav-link"
                                    activeClassName="active"
                                >
                                    <i className={prop.icon.startsWith('fa') ? prop.icon : ("now-ui-icons " + prop.icon)}/>
                                    <p>{prop.name}</p>
                                </NavLink>
                            </li>
                        );
                    })}
                </Nav>
            </div>
        </div>
    );
}

export default Sidebar;
