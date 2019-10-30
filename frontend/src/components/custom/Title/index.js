import React from 'react';

const styles = {
    title: { fontWeight: 'bold' }
}
export default class Title extends React.PureComponent {
    render() {
        const { text = '' } = this.props
        return <h5 style={styles.title}>{text}</h5>
    }
}
