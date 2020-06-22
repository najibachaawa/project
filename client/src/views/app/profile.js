import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import PropTypes from "prop-types";
import IntlMessages from "../../helpers/IntlMessages";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
// import Grid from "@material-ui/core/Grid";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import InputLabel from "@material-ui/core/InputLabel";
// import { Input,Button } from '@material-ui/core';
export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeBirthDay = this.onChangeBirthDay.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.updateProfile = this.updateProfile.bind(this);

    this.state = {
      id: '',
      token: '',
      name: '',
      lastname: '',
      email: '',
      birthDay: '',
      address: '',
      imageUrl: '',
    }
  }
  componentDidMount() {
    this.state.id = localStorage.getItem('id')
    this.state.token = localStorage.getItem('jwtToken')
    if (this.state.id) {
      axios.get('http://localhost:5000/profil/' + this.state.id, { headers: { "Authorization": `Bearer ${this.state.token}` } })
        .then(res => {
          this.setState({
            name: res.data.name,
            lastname: res.data.lastname,
            email: res.data.email,
            birthDay: res.data.birthDay,
            address: res.data.address,
            imageUrl: res.data.imageUrl,
            imageHash: Date.now()
          });
          console.log(this.state.birthDay)
          console.log("response : ", res.data)
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }
  onChangeFirstName(e) {
    this.setState({ name: e.target.value })
  }
  onChangeLastName(e) {
    this.setState({ lastname: e.target.value })
  }
  onChangeEmail(e) {
    this.setState({ email: e.target.value })
  }
  onChangeBirthDay(e) {
    this.setState({ birthDay: e.target.value })
  }
  onChangeAddress(e) {
    this.setState({ address: e.target.value })
  }

  updateProfile(e) {
    e.preventDefault()

    const userBody = {
      name: this.state.name,
      lastname: this.state.lastname,
      email: this.state.email,
      birthDay: this.state.birthDay,
      address: this.state.address,
    };


    console.log(this.state.token)

    axios.put('http://localhost:5000/profil/edit/' + this.state.id, userBody, { headers: { "Authorization": `Bearer ${this.state.token}` } })
      .then((res) => {
        console.log(res.data)
        console.log('user successfully updated')
      }).catch((error) => {
        console.log(error)
      })

  }

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    console.log(file);
    // this.setState({file}); 

    if(file){
      const form = new FormData();
      form.append("avatar", file);
      axios.post('http://localhost:5000/profil/avatar/' + this.state.id, form, { headers: { "Authorization": `Bearer ${this.state.token}` } })
      .then((res) => {
        console.log(res.data.file)
        console.clear()
        console.log("before imageUrl : ",this.state.imageUrl)
        // this.state.imageUrl = res.data.file
        this.setState({ imageUrl: res.data.file })

        console.log("after imageUrl : ",this.state.imageUrl)
        console.log('user successfully updated')
      }).catch((error) => {
        console.log(error)
      })
    }

}

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.profile" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row style={{ "textAlign": "center" }}>
          <Colxx md="6" className="mb-4">
            <Label>Avatar</Label>



            <Row style={{ "textAlign": "center" }}>
              <Colxx xxs="12">
                <label htmlFor="fileUpload">
                  <Row>
                    <Colxx md="12">
                      {this.state.imageUrl ? <img style={{ "width": "250px", "borderRadius": "10px", "marginBottom": "10px", "cursor": "pointer" }} src={'http://localhost:5000/' + this.state.imageUrl}></img> : ""}
                    </Colxx>
                  </Row>
                  <div style={{"cursor": "pointer","border":"black 0.5px " }}>
                    <h3>Upload</h3>
                  </div>
                </label>
                <input hidden id="fileUpload" type="file" accept="image/*" ref={(ref) => this.upload = ref} style={{display: 'none'}} onChange={this.onChangeFile.bind(this)} />
                {/* <input hidden id="fileUpload" type="file" accept="image/*" onChange={this.uploadUserAvatar} /> */}
              </Colxx>
            </Row>
          </Colxx>
          <Colxx md="6" className="mb-4">
            {/* <p><IntlMessages id="menu.profile"/></p> */}
            <form>
              <Row>
                <Colxx md="6">
                  <Label>First Name</Label>
                  <Input type="text" placeholder="First Name" value={this.state.name} onChange={this.onChangeFirstName}></Input>
                </Colxx>
                <Colxx md="6">
                  <Label>Last Name</Label>
                  <Input type="text" placeholder="Last Name" value={this.state.lastname} onChange={this.onChangeLastName}></Input>
                </Colxx>
              </Row>
              <br />
              <Row>
                <Colxx xxs="6">
                  <Label>Birthday</Label>
                  <Input type="text" placeholder="BirthDay" value={this.state.birthDay} onChange={this.onChangeBirthDay} disabled></Input>
                </Colxx>
                <Colxx xxs="6">
                  <Label>Email</Label>
                  <Input type="email" placeholder="email" value={this.state.email} onChange={this.onChangeEmail}></Input>
                </Colxx>
              </Row>
              <br />
              <Row>
                <Colxx xxs="12">
                  <Label>Address</Label>
                  <Input type="text" placeholder="Address" value={this.state.address} onChange={this.onChangeAddress}></Input>
                </Colxx>
              </Row>
            </form>
          </Colxx>

        </Row>
        <Row style={{ "textAlign": "right" }}>
          <Colxx xxs="12">
            <Button type="submit" onClick={this.updateProfile}>Save</Button>
          </Colxx>
        </Row>


      </Fragment>
    )
  }
}