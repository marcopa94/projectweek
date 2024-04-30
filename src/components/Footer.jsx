import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { AiFillQuestionCircle } from "react-icons/ai";

import ISO6391 from "iso-639-1";

const Footer = () => {
  const allLanguages = ISO6391.getAllNames().map((name, idx) => {
    const code = ISO6391.getCode(name);
    return (
      <option value={code} key={idx}>
        {name}
      </option>
    );
  });

  return (
    <Container fluid className="text-secondary mt-5" id="footer">
      <Row>
        <Col xs={12} md={2} className="fw-bold">
          <h5>Notizie</h5>
          <br></br>
          <p>situazione israele-palestinese</p>
          <p>Guerra russia ucraine</p>
        </Col>
        <Col xs={12} md={2} className="fw-bold">
          <h5>contattaci</h5>
          <br></br>
          <p>Unisciti a noi</p>
        </Col>
        <Col xs={12} md={2} className="fw-bold">
          <h5>I nostri reporter </h5>
          <br></br>
          <p>Marco Pala</p>
          <p>Alfio Battiato</p>
          <p>Chiara Martinelli</p>
          <p>Nicole Maini</p>
        </Col>
        <Col xs={12} md={4}>
          <div className="d-flex">
            <AiFillQuestionCircle className="fs-2" />
            <div className="ms-2">
              <p className="m-0 fw-bold fs-5">Vuoi lavorare con noi?</p>
              <p className="m-0">Contatti</p>
            </div>
          </div>
          {/*   <div className="d-flex">
            <IoMdSettings className="fs-2" />

            <div className="ms-2">
              <p className="m-0 fw-bold fs-5">Manage your account and privacy</p>
             
            </div>
          </div> */}
          {/*   <div className="d-flex">
            <FaShieldAlt className="fs-2" />
            <div className="ms-2">
              <p className="m-0 fw-bold fs-5">Recommendation transparency</p>
              <p className="m-0">Learn more about Recommeneded Content.</p>
            </div>
          </div> */}
        </Col>
        <Col xs={12} md={2}>
          <p className="m-0">Select Language</p>
          <Form.Select aria-label="Select language" value="en">
            {allLanguages}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>palaNotizie S.r.l.s. © 2024</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
