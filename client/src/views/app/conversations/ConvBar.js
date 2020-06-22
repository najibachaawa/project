import React from 'react';
import PropTypes from 'prop-types';
import { Nav, TabContent, TabPane, CardHeader, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import MessageCard from "../../../components/applications/MessageCard"
import classnames from "classnames";
import IntlMessages from "../../../helpers/IntlMessages";
import moment from "moment"
const ConvBar = props => {
    console.log(props.newMsg , "PROPS MSG")
    return (
        <div className='conv-bar'>
           <div className="conv-bar__header text-center">
           <p>Conversations</p>
           </div>
           <div className="mb-5">
           <Nav tabs className="card-header-tabs ml-0 mr-0">
            <NavItem className="w-50 text-center">
              <NavLink
                to="#"
                location={{}}
                className={classnames({
                  active: props.activeTab === "messages",
                  "nav-link": true
                })}
                onClick={() => {
                    props.toggleAppMenu("messages");
                }}>
                <IntlMessages id="Messages" />
              </NavLink>
            </NavItem>
            <NavItem className="w-50 text-center">
              <NavLink
                to="#"
                location={{}}
                className={classnames({
                  active: props.activeTab === "contacts",
                  "nav-link": true
                })}
                onClick={() => {
                    props.toggleAppMenu("contacts");
                }}>
                <IntlMessages id="Assigned" />
              </NavLink>
            </NavItem>
          </Nav>
           </div>
          <div className="conv-bar__msg">
              {props.conversations.map(conv=>(
                  <div key={conv.convid} className="cov-bar__msg__container" onClick={()=>props.openConv(conv.convid,{name:conv.name,thumb:conv.image,assignedTo:conv.assignedTo,updated_time:conv.updated_time})}>
          
          <MessageCard className={(props.newMsg?.from?.id)==conv.id?"red":"blue"}  sender={{name:conv.name,thumb:conv.image}}  item={{id:"2",time:moment(conv.updated_time).fromNow()}} currentUserid={"22"} >
           
             </MessageCard>
             </div>
              ))}


          </div>
        </div>
    );
};

ConvBar.propTypes = {
    
};

export default ConvBar;