import React from "react";
import {
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";
import { Formik, Form, Field } from "formik";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateRole,
} from "../../helpers/validators";

const AddNewModal = ({
  modalOpen,
  toggleModal,
  categories,
  onSubmitCallback,
  initialValues,
}) => {
  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="pages.add-new-user-modal-title" />
      </ModalHeader>

      <Formik
        initialValues={initialValues || {}}
        onSubmit={(values, actions) => {
          onSubmitCallback(values);
          toggleModal();
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <ModalBody>
              <FormGroup className="form-group has-float-label">
                <Field name="_id" id="_id" hidden />
                <Label>
                  <IntlMessages id="user.email" />
                </Label>
                <Field
                  className="form-control"
                  name="email"
                  validate={validateEmail}
                />
                {errors.email && touched.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </FormGroup>
              <FormGroup className="form-group has-float-label">
                <Label>
                  <IntlMessages id="user.fullname" />
                </Label>
                <Field
                  className="form-control"
                  name="name"
                  validate={validateName}
                />
                {errors.name && touched.name && (
                  <div className="invalid-feedback d-block">{errors.name}</div>
                )}
              </FormGroup>
              <FormGroup className="form-group has-float-label">
                <Label>
                  <IntlMessages id="user.password" />
                </Label>
                <Field
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder={
                    initialValues._id
                      ? "Keep empty if not changing"
                      : "Password"
                  }
                  validate={(value) => {
                    initialValues._id || validatePassword(value);
                  }} // if the _id is defined, we're updating.
                />
                {errors.password && touched.password && (
                  <div className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
              </FormGroup>
              <FormGroup className="form-group has-float-label">
                <Label>
                  <IntlMessages id="user.role" />
                </Label>
                <Field
                  name={"role"}
                  component={CustomSelectInput}
                  options={categories}
                  validate={(value)=>validateRole(value, categories)} // if the _id is defined, we're updating.
                />
                {errors.role && touched.role && (
                  <div className="invalid-feedback d-block">{errors.role}</div>
                )}
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={toggleModal}>
                <IntlMessages id="pages.cancel" />
              </Button>
              <Button color="primary">
                <IntlMessages id="pages.submit" />
              </Button>{" "}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddNewModal;
