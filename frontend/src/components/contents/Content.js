import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('ScreenStore')
@observer
class Content extends Component {

    render() {
        return (
            <div id="content">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid header-custom">
                        <button type="button" id="sidebarCollapse" className="btn btn-info">
                            <i className="fas fa-align-left" />
                        </button>
                        <p className="ml-3 mb-0 font-weight-bold h4">{this.props.ScreenStore.title}</p>
                    </div>

                </nav>
                {/* <div className="container-fluid">                 
                </div> */}
            </div>
        );
    }
}
export default Content