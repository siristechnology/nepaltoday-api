import React, { useState } from 'react';

import { connect } from "react-redux";
import { Link } from "react-router-dom";

// Import menuDropdown
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

import logo from "../../assets/images/logo.svg";
import logoLightPng from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";
import logoDark from "../../assets/images/logo-dark.png";

// Redux Store
import {  showRightSidebarAction,toggleLeftmenu,changeSidebarType } from "../../store/actions";

const Header = (props) => {

  const isMobile =  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

function tToggle()
{
       props.toggleLeftmenu(!props.leftMenu);
      if (props.leftSideBarType === "default") {
         props.changeSidebarType("condensed", isMobile);
    } else if (props.leftSideBarType === "condensed") {
         props.changeSidebarType("default", isMobile);
    }  
}
      return (
       <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logo} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" height="17" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoLightSvg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLightPng} alt="" height="19" />
                  </span>
                </Link>
              </div>

              <button type="button" onClick={() => {   tToggle() }} className="btn btn-sm px-3 font-size-16 header-item waves-effect" id="vertical-menu-btn">
                <i className="fa fa-fw fa-bars"></i>
              </button>
            </div>

            <div className="d-flex">
              <div className="dropdown d-none d-lg-inline-block ml-1">
                <button type="button" onClick={() => { toggleFullscreen(); }} className="btn header-item noti-icon waves-effect" data-toggle="fullscreen">
                  <i className="bx bx-fullscreen"></i>
                </button>
              </div>

              <NotificationDropdown />
              <ProfileMenu />

            </div>
          </div>
        </header>
      </React.Fragment>
      );
    }
const mapStatetoProps = state => {
  const { layoutType,showRightSidebar,leftMenu,leftSideBarType } = state.Layout;
  return { layoutType,showRightSidebar,leftMenu,leftSideBarType };
};

export default connect(mapStatetoProps, { showRightSidebarAction,toggleLeftmenu,changeSidebarType })(Header);
