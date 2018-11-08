import React from "react";
// @material-ui/core
import Hidden from "@material-ui/core/Hidden";
import GridContainer from "./GridContainer";
import GridItemChat from "./GridItemChat";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendIcon from '@material-ui/icons/Send';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { IconButton, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import avatar from "./avatar.png";
import Button from "@material-ui/core/Button";
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Transfer from '@material-ui/icons/TransferWithinAStation';
import green from '@material-ui/core/colors/green';
import HyperText from "./HyperLink";
import ScrollToBottom from 'react-scroll-to-bottom';
import Tooltip from '@material-ui/core/Tooltip';
import * as moment from 'moment';
import 'moment/locale/vi';

//Socket
import io from 'socket.io-client';
const socket = io('http://localhost:4000')

moment.locale('vi');
const img_me = "https://i.imgur.com/p9bwTYj.png";
var currentUser = null;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      right: false,
      selectedVisitorIndex: 0,
      topic: null,
      visitor: null,
      listTopic: [{
        CompanyID: 1,
        IsDelete: 0,
        LastMessageSendTime: 1541349185313,
        ServicerID: 1,
        TopicID: "127.0.0.3",
        UnreadMessageCount: 0,
        VisitorName: "User02"
      }],
      listMessage: [],
      listUser: null,
      notifyUpdateVisitor: null,
      content: '',
    };
    socket.on('chat message', (message) => this.onReceiveMessage(message));
  }

  componentDidMount() {
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  onContentChange = (event) => {
    this.setState({
      content: event.target.value,
    })
  }

  onSendMessage = () => {
    var message = {
      token: sessionStorage.getItem('token'),
      TopicID: '127.0.0.3',
      SenderID: '127.0.0.3',
      RecieverID: 2,
      Content: this.state.content,
      SendTime: new Date().getTime(),
      TypeID: 1,
    }
    this.setState({
      content: '',
    })
    console.log('Gửi tin nhắn đi server với nội dung là: message');
    socket.emit('chat message', message);
  }

  onReceiveMessage = (message) => {
    console.log('Nhận tin nhắn từ server')
    console.log(message);
    if (message.TopicID == '127.0.0.3') {
      var listMessage = this.state.listMessage;
      listMessage.push(message);
      this.setState({
        listMessage: listMessage,
      })
    }
  }


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <GridContainer>
          <GridItemChat xs={8} sm={8} md={6} >
            <div className={classes.center}>
              <div className={classes.top}>
                <Typography style={{ fontFamily: 'Roboto-Regular' }}>
                  {this.state.topic ? this.state.topic.VisitorName : null}
                </Typography>
                {this.state.topic && this.state.topic.ServicerID == this.props.userProfile.UserID
                  ?
                  <MuiThemeProvider theme={theme}>
                    <Tooltip title="Chuyển tin nhắn" placement='top'>
                      <IconButton variant="contained" color="primary" style={{ marginLeft: 'auto', marginRight: 10, alignItems: 'center', justifyContent: 'center' }} onClick={() => this.onTransferClick()}>
                        <Transfer style={{ color: '#000' }} />
                      </IconButton>
                    </Tooltip>
                  </MuiThemeProvider>
                  : null}
              </div>
              <ScrollToBottom className={classes.chat} ref={(ref) => this.messageList = ref} >
                {this.state.listMessage && this.state.listMessage.map((message, index) => {
                  var beforeMessage = this.state.listMessage[index - 1];
                  return (
                    !isNaN(message.SenderID)
                      ?
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }} key={index}>
                        <div className={{ width: 40, height: 40, marginLeft: 5, }} >
                          {beforeMessage == undefined || (beforeMessage && beforeMessage.SenderID != message.SenderID)
                            ?
                            <Avatar src={avatar} className={classes.avatar} />
                            :
                            <div className={classes.avatar} />}
                        </div>
                        <Tooltip title={moment(message.SendTime).calendar()} placement="right">
                          <div className={classes.bubble_y} style={{backgroundColor: isNaN(message.SenderID) ? "#eaeaeb'" : '#23ce3f'}}>
                            <div className={classes.b_you}>
                              <HyperText me={false} content={message.Content}/>
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                      :
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} key={index}>
                        <Tooltip title={moment(message.SendTime).calendar()} placement="left">
                          <div className={classes.bubble_m}>
                            <div className={classes.me}>
                              <HyperText me={true} content={message.Content} />
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                  )
                }
                )}
              </ScrollToBottom>
                <div className={classes.chatBottom}>
                  <MuiThemeProvider theme={theme}>
                    <TextField
                      id="outlined-bare"
                      value={this.state.content}
                      onChange={this.onContentChange}
                      className={classes.chatTextField}
                      variant="outlined"
                      InputProps={{
                        endAdornment:
                          <InputAdornment position="end">
                            {/* <IconButton>
                            <AttachmentIcon />
                          </IconButton> */}
                            <IconButton onClick={this.onSendMessage} disabled={this.state.content == '' ? true : false}>
                              <SendIcon />
                            </IconButton>
                          </InputAdornment>,
                      }} />
                  </MuiThemeProvider>
                </div>
            </div>
          </GridItemChat>
        </GridContainer>
      </div>
    );
  }
}

const styles = theme => ({
  grid: {
    padding: '0 !important',
  },
  servicerNotify: {
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    color: '#00bcd4',
    fontSize: 15,
  },
  chatBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    margin: 10,
    color: '#FFF'
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  left: {
    border: '1px solid #e6e6e6',
    height: '608px',
    overflow: 'auto',
  },
  center: {
    border: '1px solid #e6e6e6',
    height: '608px',
  },
  right: {
    border: '1px solid #e6e6e6',
    height: '608px',
    display: 'flex',
    flexDirection: 'column',
  },
  chat: {
    height: '490px',
    width: '100%',
    overflow: 'auto',
    marginBottom: 10,
  },
  img: {
    borderRadius: '20px',
    width: '40px',
    height: '40px',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  top: {
    height: '21px',
    paddingTop: '15px',
    paddingBottom: '15px',
    paddingLeft: '29px',
    backgroundColor: '#eceff1',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chatTextField: {
    width: '100%',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  bubble_y: {
    fontSize: "16px",
    position: "relative",
    display: "inline-block",
    padding: "10px",
    borderRadius: "5px",
    border: '1px solid #eaeaeb',
    minWidth: '20%',
    maxWidth: '70%',
    marginLeft: '10px',
    marginTop: '10px',
  },

  bubble_m: {
    fontSize: "16px",
    display: "inline-block",
    padding: "10px",
    borderRadius: "5px",
    border: '1px solid #00b0ff',
    backgroundColor: "#00b0ff",
    minWidth: '20%',
    maxWidth: '70%',
    marginRight: '10px',
    marginTop: '10px',
    float: 'right',
  },

  b_you: {
    maxWidth: '100%',
    color: "#fff",
    alignSelf: 'flex-start',
  },
  b_me: {
    float: 'right',
    color: "#1a1a1a",
    maxWidth: '100%',
    backgroundColor: "#eceff1",
    alignSelf: "flex-end",
  },
  list: {
    width: '200px'
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00bcd4',
    },
    secondary: green
  },
  typography: {
    useNextVariants: true,
  },
});

export default withStyles(styles)(App);
