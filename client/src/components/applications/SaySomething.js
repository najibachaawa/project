import React, { Component } from "react";
import { Input, Button } from "reactstrap";

class SaySomething extends Component {
  render() {
    const {
      placeholder,
      messageInput,
      handleChatInputPress,
      handleChatInputChange,
      handleSendButtonClick,
      open
    } = this.props;
    console.log("OPEEEN ",open)
    return (
      <div className="chat-input-container d-flex justify-content-between align-items-center" style={{paddingLeft:"121px"}}>
        <Input
          className="form-control flex-grow-1"
          type="text"
          disabled = {(open)? "" : "disabled"}
          placeholder={placeholder}
          value={messageInput}
          style={{paddingLeft:"51px"}}
          onKeyPress={e => handleChatInputPress(e)}
          onChange={e => handleChatInputChange(e)}
        />
        <div>
          <Button outline color="primary" className="icon-button large ml-1">
            <i className="simple-icon-paper-clip" />
          </Button>

          <Button
            color="primary"
            className="icon-button large ml-1"
            onClick={() => handleSendButtonClick()}
          >
            <i className="simple-icon-arrow-right" />
          </Button>
        </div>
      </div>
    );
  }
}
export default SaySomething;
