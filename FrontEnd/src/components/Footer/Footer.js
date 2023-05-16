import React from "react";
import { Container } from "reactstrap";
import PropTypes from "prop-types";

function Footer(props) {
  return (
    <footer className={"footer" + (props.default ? " footer-default" : "")}>
      <Container fluid={props.fluid ? true : false}>
        <div className="copyright">
          &copy; {1900 + new Date().getYear()} {" "}
          <a href="/">
            MedPredict
          </a>
        </div>
      </Container>
    </footer>
  );
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
