import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { changeMenuItem } from '../reducer/modules/menu';

export function requireAuthentication(Component) {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();
    
    useEffect(() => {
      checkAuth();
    }, [props.isAuthenticated, navigate, props.changeMenuItem]);
    
    const checkAuth = () => {
      if (!props.isAuthenticated) {
        navigate('/');
        props.changeMenuItem('/');
      }
    };
    
    return <div>{props.isAuthenticated ? <Component {...props} /> : null}</div>;
  };
  
  AuthenticatedComponent.propTypes = {
    isAuthenticated: PropTypes.bool,
    changeMenuItem: PropTypes.func
  };
  
  return connect(
    state => {
      return {
        isAuthenticated: state.user.isLogin
      };
    },
    {
      changeMenuItem
    }
  )(AuthenticatedComponent);
}
