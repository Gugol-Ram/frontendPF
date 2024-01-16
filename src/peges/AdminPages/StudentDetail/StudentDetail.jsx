import { useEffect, useState } from "react";
import { Card, Container, Button, Modal, Collapse } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
const { VITE_BACK_URL } = import.meta.env;

const StudentDetail = () => {
  const { id } = useParams(); // Obtiene el parámetro id de la URL
  console.log("el id es: " + id);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(
          `${VITE_BACK_URL}/admin/studentDetail/${id}`
        );
        const data = await response.json();
        setStudent(data); // Establece la información del estudiante en el estado
      } catch (error) {
        throw new Error(`Error fetching student data: ${error.message}`);
      }
    };

    fetchStudentDetails();
  }, [id]); // Ejecuta la solicitud al servidor cuando cambia el ID en la URL

  const [validationSuccess, setValidationSuccess] = useState(false);
  const [suspension, setSuspension] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleShowConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleSuspendStudent = async () => {
    try {
      const response = await fetch(`${VITE_BACK_URL}/estudiantes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: false }), // Cambiar state a false para suspender
      });

      if (response.ok) {
        // Si la solicitud es exitosa, actualizar los detalles del estudiante localmente
        setStudent({ ...student, state: false });
        setSuspension(true);
      } else {
        console.error("Error al suspender al estudiante");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud PUT:", error);
    }
  };

  const handleConfirmSuspend = async () => {
    await handleSuspendStudent();
    setShowConfirmation(false);
  };

  const handleHideAlert = () => {
    setValidationSuccess(false);
  };
  const hideAlertSuspension = () => {
    setSuspension(false);
  };

  const handleValidateStudent = async () => {
    try {
      // Realizar la solicitud PUT al servidor para cambiar validate de false a true
      const response = await fetch(
        `${VITE_BACK_URL}/admin/studentDetail/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ validate: true }), // Cambiar validate a true
        }
      );

      if (response.ok) {
        // Si la solicitud es exitosa, actualizar los detalles del estudiante localmente
        setStudent({ ...student, validate: true });
        setValidationSuccess(true);
      } else {
        console.error("Error al actualizar la validación del estudiante");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud PUT:", error);
    }
  };

  if (!student) {
    return <p>Cargando detalles del estudiante...</p>;
  }
  const {
    idDocumento,
    nombres,
    apellidoPat,
    apellidoMat,
    Nacionalidad,
    fechNac,
    sexo,
    peso,
    estatura,
    alergias,
    grupoSanguineo,
    contactoEmerg,
    fotoPerfil,
    fotoDocumento,
    validate,
  } = student;
  console.log("La foto de perfil es: " + student.id);

  return (
    <Container>
      <h2>Detalles del Estudiante</h2>
      <Card>
        <Card.Body>
          <Card.Title>{`${nombres} ${apellidoPat} ${apellidoMat}`}</Card.Title>
          <Card.Text>ID: {idDocumento}</Card.Text>
          <Card.Text>Nacionalidad: {Nacionalidad}</Card.Text>
          <Card.Text>Fecha de Nacimiento: {fechNac}</Card.Text>
          <Card.Text>Sexo: {sexo}</Card.Text>
          <Card.Text>Peso: {peso}</Card.Text>
          <Card.Text>Estatura: {estatura}</Card.Text>
          <Card.Text>Alergias: {alergias}</Card.Text>
          <Card.Text>Grupo Sanguíneo: {grupoSanguineo}</Card.Text>
          <Card.Text>Contacto de Emergencia: {contactoEmerg}</Card.Text>
          <Card.Text>
            Foto de Perfil:
            <img
              src={fotoPerfil}
              alt="Foto de perfil"
              style={{ width: "3.5cm", height: "5cm" }}
            />
          </Card.Text>
          <Card.Text>
            Foto de Documento:
            <img
              src={fotoDocumento}
              alt="Foto del Documento"
              style={{ width: "3.5cm", height: "5cm" }}
            />
          </Card.Text>
          <Card.Text>Validado: {validate ? "Sí" : "Pendiente"}</Card.Text>
          <Button
            className="btn btn-primary mb-3 mx-2"
            onClick={handleValidateStudent}
            disabled={validate}
            variant={validate ? "success" : "primary"}
          >
            {validate
              ? "Verificado"
              : `Validar Estudiante ${nombres} ${apellidoPat}`}
          </Button>
          <Button
            className="btn btn-danger mb-3 mx-2"
            onClick={handleShowConfirmation}
            disabled={!validate} // Desactiva el botón si validate es false
          >
            Suspender a {`${nombres} ${apellidoPat}`}
          </Button>

          {/* Confirmación adicional */}
          <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación de Suspensión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Esta acción es irreversible. Solo el SuperAdmin podrá reactivar
                al usuario.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmation}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleConfirmSuspend}>
                Confirmar Suspensión
              </Button>
            </Modal.Footer>
          </Modal>
          <Link to="/Admin" className="btn btn-primary mb-3">
            Volver
          </Link>
          <Collapse in={validationSuccess}>
            <div className="alert alert-success mt-3" role="alert">
              ¡Validación exitosa!
              <Button
                onClick={handleHideAlert}
                className="close mx-1"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </Button>
            </div>
          </Collapse>
          <Collapse in={suspension}>
            <div className="alert alert-danger mt-3" role="alert">
              ¡Estudiante Suspendido!
              <Button
                onClick={hideAlertSuspension}
                className="close mx-3"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </Button>
            </div>
          </Collapse>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentDetail;
