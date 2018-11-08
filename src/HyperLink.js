import React from "react";
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";

export default class HyperText extends React.Component {

    render() {
        try {
            var contents;
            let tokens = this.props.content.split(/\s/);
        
            contents = tokens.map((token, i) => {
                let hasSpace = i !== (tokens.length - 1);
                let maybeSpace = hasSpace ? ' ' : '';
        
                if (token.match(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
                    return (
                        <a href={token}>{token}{maybeSpace}</a>
                    );
                } else {
                    return token + maybeSpace;
                }
            });
        }catch{
            return this.props.content;
        }
  
      return (
        <Typography {...this.props} style={!this.props.me ? {color: '#000'} : {color: '#FFF'}}>
          {contents}
        </Typography>
      );
    }
  
  }