import React, { Component } from 'react';
import ConvBar from './ConvBar';
import { API_BASE_URL } from "../../../constants/defaultValues"
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux"
import axios from "axios"
import ChatHeading from '../../../components/applications/ChatHeading';
import MessageCard from '../../../components/applications/MessageCard';
import SaySomething from "../../../components/applications/SaySomething";
import io from 'socket.io-client';
import {PAGE_ID} from "../../../constants/defaultValues"
import moment from "moment"
import { FormattedHTMLMessage } from 'react-intl';
class index extends Component {
    state = {
        conversations: [],
        messages: [],
        messageUser: [],
        pageId: PAGE_ID,
        messageInput: "",
        convId: "",
        newMsg: {},
        shownConvs: [],
        me: {},
        open: false,
        own: true,
        users: [],
        ring:false,
        anotherUserId: "",
        notAssign:false

    }
    componentDidMount() {
        const socket = io('http://localhost:5000/');
        socket.on("message", (msg) => {
            console.log(msg)

            console.log(this.state.messageUser)
            if (msg.sender.id == this.state.messageUser.id) {
                console.log("COMPAGE ")
                setTimeout(()=>{
                    this.setState({ring:false})
                },1000)
                this.setState({ring:true, messages: [...this.state.messages, { message: msg.message.text, from: { id: msg.sender.id } }], newMsg: { message: msg.message.text, from: { id: msg.sender.id } } })
            }
        })
        console.log("API BASE ", localStorage.jwtToken)
        axios.defaults.headers.common = { Authorization: `Bearer ${localStorage.jwtToken}` }

        axios.get(`${API_BASE_URL}/conv/conversations`)
            .then((response) => {

                const userOne = response.data.convs.conversations[0]
                console.log(response)
                if (response.data.convs.conversations.length != 0) {
                    this.setState({ convId: userOne.convid })

                    this.openConv(userOne.convid, { name: userOne.name, thumb: userOne.image,updated_time:userOne.updated_time })
                }

                this.setState({ conversations: response.data.convs.conversations, me: response.data.user, shownConvs: response.data.convs.conversations, users: response.data.users }, () => {
                    if (this.state.me.convs.indexOf(userOne.convid) > -1||userOne.assignedTo == null) {
                        
                        if(userOne.assignedTo == null){
                            this.setState({notAssign:true})
                        }
                        this.setState({ open: true })
                        
                    } else if ((userOne.assignedTo != this.state.me._id)) {
                        this.setState({ open: false,notAssign:false })
                    }
                  
                    if ((userOne.assignedTo != this.state.me._id)) {
                        this.setState({ own: false })
                    } else {
                        this.setState({ own: true })
                    }
                })
            })

    }
    assignToMe = () => {
        const convId = this.state.convId
        this.setState({ own: true,open:true,notAssign:false })
        axios.post(`${API_BASE_URL}/conv/assign`, {
            convId
        })
            .then((response) => {

                console.log(response)


            })
    }
    assignToUser = () => {
        const convId = this.state.convId
        var e = document.getElementById("users");


        var userId = e.options[e.selectedIndex].value;
        this.setState({ own: false,open:false })

        axios.post(`${API_BASE_URL}/conv/assign-to`, {
            convId,
            userId
        })
            .then((response) => {
           
                console.log(response)


            })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this._scrollBarRef) {
            this._scrollBarRef._ps.element.scrollTop = this._scrollBarRef._ps.contentHeight;
        }


        if (prevState.newMsg != this.state.newMsg) {
            console.log("NEW MESG")

        }
    }
    handleChatInputPress = e => {
        if (e.key === "Enter") {
            if (this.state.messageInput.length > 0) {

                let messages = this.state.messages
                this.setState({ messageInput: "", messages: [...messages, { message: this.state.messageInput, from: { id: this.state.pageId } }], newMsg: {} })
                axios.post(`${API_BASE_URL}/conv/message/${this.state.messageUser.id}`, {

                    message: this.state.messageInput
                })

            }
        }
    }

    handleChatInputChange = e => {
        this.setState({

            messageInput: e.target.value
        });
    };

    handleSendButtonClick = () => {
        if (this.state.messageInput.length > 0) {
            let messages = this.state.messages
            this.setState({ messageInput: "", messages: [...messages, { message: this.state.messageInput, from: { id: this.state.pageId } }], newMsg: {} })
            axios.post(`${API_BASE_URL}/conv/message/${this.state.messageUser.id}`, {

                message: this.state.messageInput
            })
        }
    };
    openConv = (id, userInfo) => {

        try {
            console.log(this.state.me, id, "CHECKCOUT")
            if ((userInfo.assignedTo != this.state.me._id)) {
              
                this.setState({ own: false })
            } else {
                this.setState({ own: true })
            }
           
            if ((this.state.me.convs.indexOf(id) > -1)||userInfo.assignedTo == null) {
               if(userInfo.assignedTo == null){
                this.setState({ notAssign: true})
               }
                this.setState({ open: true})
            } else if ((userInfo.assignedTo != this.state.me._id ) ) {
                this.setState({ open: false ,notAssign:false })
            }
        } catch (e) {
            console.log("EE ", e)
        }

        axios.get(`${API_BASE_URL}/conv/messages/${id}`)
            .then((response) => {
                console.log(response ,"REPONSEEEEEEEEEEE")

                this.setState({ messages: response.data.messages, messageUser: { ...userInfo, id: response.data.messages[0].from.id==this.state.pageId?response.data.messages[0].to.data[0].id:response.data.messages[0].from.id }, convId: id,updated_time:userInfo.updated_time })
            })
    }
    toggleAppMenu = (data) => {
        if (data == "messages") {
            this.setState({ shownConvs: this.state.conversations })

        } else {
            this.setState({ shownConvs: this.state.conversations.filter((conv) => conv.assignedTo == this.state.me._id) })

        }
        console.log(data)
    }
    render() {
        return (
            <div className="conversations">
   {this.state.ring&&             <audio autoPlay>

<source src="/assets/ring/juntos.mp3" type="audio/mpeg"/>
Your browser does not support the audio element.
</audio>}
                <div className="row">
                    <div className="col-lg-9 col-sm-12" style={{position:"relative",borderRight:"1px solid #d7d7d7"}}>
                        <div className="messages-div chat-app">
                            <ChatHeading name={this.state.messageUser.name} thumb={this.state.messageUser.thumb}  lastSeenDate={moment(this.state.updated_time).fromNow()}>


                            </ChatHeading>
                            <div style={{ marginTop: "-94px", marginBottom: "109px" }}>
                                {this.state.open  && <React.Fragment>
                                    {!this.state.own && <div onClick={this.assignToMe} className="btn btn-primary float-right ml-2">Assign to me</div>}
                                    <div className="btn btn-primary float-right" type="button" data-toggle="modal" data-target="#exampleModal">Assign to friend</div></React.Fragment>}
                            </div>

                            <PerfectScrollbar
                                ref={ref => {
                                    this._scrollBarRef = ref;
                                }}
                                containerRef={ref => { }}
                                options={{ suppressScrollX: true, wheelPropagation: false }}>
                                {this.state.messages.map((msg) => (
                                    msg.from.id == this.state.pageId ? <MessageCard sender={{ name: msg.message, thumb: "https://scontent-mxp1-1.xx.fbcdn.net/v/t1.0-9/p960x960/93245412_103718371316468_4553994935375757312_o.png?_nc_cat=107&_nc_sid=85a577&_nc_ohc=apfxHdnatqAAX-KvCym&_nc_ht=scontent-mxp1-1.xx&oh=fe4340f6a05032707b1c07d3f59b91cb&oe=5F094A40" }} item={{ time:moment(msg.created_time).fromNow(), sender: "1" }} currentUserid={"2"}>

                                    </MessageCard> :
                                        <MessageCard sender={{ name: msg.message, thumb: this.state.messageUser.thumb }} item={{ time: moment(msg.created_time).fromNow(), sender: "1" }} currentUserid={"1"}>

                                        </MessageCard>


                                ))}




                            </PerfectScrollbar>

                        </div>
                        <SaySomething
     
        open={!this.state.notAssign?this.state.open:false}
          placeholder={"write..."}
          messageInput={this.state.messageInput}
          handleChatInputPress={this.handleChatInputPress}
          handleChatInputChange={this.handleChatInputChange}
          handleSendButtonClick={this.handleSendButtonClick}

        />
                    </div>
                    <div className="col-lg-3 col-sm-12">

                        <ConvBar toggleAppMenu={this.toggleAppMenu} newMsg={this.state.newMsg} openConv={this.openConv} conversations={this.state.shownConvs}>



                        </ConvBar>
                    </div>
                </div>


                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Assign Conversation</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div className="form-group">
                                    <select className="form-control" id="users">
                                        {this.state.users.map((user) => {
                                            return <option value={user._id}>{user.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.assignToUser}>Assign</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    user: state.authUser
})
export default connect(mapStateToProps, undefined)(index);